/**
 * 파일관리(목록·미리보기) 조회창 (A30) — Sys90_Edit_BoardAdmin의 파일관리 단추에서 연다. 다른 도메인에서도 쓰는 공통 클래스(B13에서 components/lookup으로)
 * AS-IS: myApp/client/vi/sys/Sys10_Lookup_ListFileViewer.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L78-186: 모달 1300×700 "파일보기", 왼쪽 450(파일업로드 단추 + 파일 그리드: 파일명 300·받기 50·삭제 50) | 오른쪽 미리보기, 하단 닫기
 * 그리드 끝의 viewerYn·fileType·viewerPath(L229-231)는 DB에 없는 변환 서버용 열이고 fileRandomCopy()(L254-277)도 그 서버 준비용이라 옮기지 않는다
 * (미리보기는 FilePreview — Sys10_Lookup_FileViewer 주석).
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Modal } from 'antd';
import { LookupModal } from '@/components/lookup/LookupModal';
import { fileApi, FILE_DELETE_STATUS } from '@/api/file';
import { errorMessage } from '@/api/client';
import { FileInfo } from '@/types/sys';
import { Button } from '@/components/button';
import { FileUpdownForm, FileUpdownFormHandle } from '@/components/form/FileUpdownForm';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { FilePreview } from './Sys10_Lookup_FileViewer';

const gb = gbFor<FileInfo>();

interface Props {
  /** AS-IS open(parentId, callback) — 있으면 열린다 */
  parentId?: number | null;
  /** AS-IS callback.execute() — 닫을 때 부른다(부모가 첨부 목록을 다시 읽는다) */
  onClose: () => void;
}

export const Sys10_Lookup_ListFileViewer: React.FC<Props> = ({ parentId, onClose }) => {
  const fileForm = useRef<FileUpdownFormHandle>(null);
  const [rows, setRows] = useState<FileInfo[]>([]);
  const [selected, setSelected] = useState<FileInfo | null>(null);
  const open = parentId != null;

  // retrieve(parentId) L236-252: 서비스 sys.Sys10_File.selectByParentId(parentId)
  const retrieve = useCallback(async () => {
    if (parentId == null) return;
    try {
      setRows(await fileApi.searchByParentId(parentId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [parentId]);

  // [E0] 화면 열림 (생성자 L78-84) → open() L103-186 끝: retrieve(parentId)
  useEffect(() => {
    setSelected(null);
    setRows([]);
    retrieve();
  }, [retrieve]);

  // checkFileDelete() L322-347 — Sys90_Grid_ApprFile과 같다
  const checkFileDelete = async (row: FileInfo) => {
    try {
      const status = await fileApi.checkFileDelete(row.fileId, row.parentId);
      if (status === FILE_DELETE_STATUS.IN_USE) {
        message.warning('해당 파일은 다른 상신문서에서 사용 중이므로 삭제할 수 없습니다');
        return;
      }
      if (status === FILE_DELETE_STATUS.DELETABLE) await fileApi.deleteFile(row.fileId);  // [E6] fileDeleteForm.SubmitComplete (L146)
      if (selected?.fileId === row.fileId) setSelected(null);
      await retrieve();
    } catch (err) {
      message.error(errorMessage(err, '삭제 실패'));
    }
  };

  const columnDefs = useMemo(() => [
    gb.text('fileNm', 300, '파일명'),  // L226
    iconCell<FileInfo>('down', 'downloadCell', 50, '받기', row => {  // L227 downloadCell
      fileApi.download(row.fileId).catch(err => message.error(errorMessage(err, '다운로드 실패')));
    }),
    iconCell<FileInfo>('delete', 'deleteCell', 50, '삭제', row => {  // L228 deleteCell → [E7] msgBox.DialogHide [YES] (L205) → checkFileDelete()
      Modal.confirm({
        title: '확인',
        content: '해당 파일을 삭제하시겠습니까?',
        width: 450,
        okText: '예',
        cancelText: '아니오',
        onOk: () => checkFileDelete(row),
      });
    }),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [retrieve, selected]);

  // [E3]·[E4] uploadButton[파일업로드].Select (L107) → fileUpload.click() → Change (L119) → FileUpload?parentId → [E5] SubmitComplete (L129) → resetFileUpload(), retrieve()
  const upload = async (file?: File) => {
    if (!file || parentId == null) return;
    try {
      await fileApi.upload(parentId, file);
      await retrieve();
    } catch (err) {
      message.error(errorMessage(err, '업로드 실패'));
    }
  };

  return (
    <LookupModal
      open={open}
      title="파일보기"
      width={1300}
      maskClosable={false}
      onCancel={onClose}
      destroyOnClose
      footer={
        <div style={{ textAlign: 'center' }}>
          {/* [E1] closeButton[닫기].Select (L87) → hide() */}
          <Button type="close" onClick={onClose}>닫기</Button>
        </div>
      }
    >
      <div style={{ display: 'flex', height: 520, gap: 8 }}>
        <div style={{ width: 450, flex: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ flex: 'none' }}>
            <Button type="upload" onClick={() => fileForm.current?.click()}>파일업로드</Button>
            <FileUpdownForm ref={fileForm} onChange={upload} />
          </div>
          <div style={{ flex: 1, minHeight: 0 }}>
            {/* [E2] grid.CellClick (L95) → viewerOpen(): 클릭한 파일을 오른쪽에 미리보기 */}
            <SingleGrid<FileInfo>
              rowData={rows}
              columnDefs={columnDefs}
              getRowId={p => String(p.data.fileId)}
              onRowClicked={e => setSelected(e.data ?? null)}
            />
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <FilePreview file={selected} height="100%" />
        </div>
      </div>
    </LookupModal>
  );
};
