/**
 * 최저보수 청구 파일 창 (EE21) — Biz20_Tab_FeeCharge 행의 [파일] 아이콘이 연다 (parentId = 당분기 청구보수 ID)
 * AS-IS: myApp/client/vi/biz/Biz20_Lookup_FileList.java (265줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open(parentId, fixYn, callback) L107-114: 모달 850×450 "파일 List", 위 [파일업로드] / 그리드(행번호) / [닫기]. 확정(fixYn)이면 [파일업로드]를 감추고 파일삭제 열(4)을 숨긴다
 * 올리기·받기·삭제는 첨부 목록(Biz11_Lookup_FileList)과 같은 파일 API(fileApi)를 쓴다 — 목록 sys.Sys10_File.selectByFeeChargeId 는 parentId 조회와 같다
 * 스타일: MG (임시 스크립트 판별 — docs/page-style.md 모달 스타일)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Modal } from 'antd';
import { fileApi, FILE_DELETE_STATUS } from '@/api/file';
import { errorMessage } from '@/api/client';
import { FileInfo } from '@/types/sys';
import { Button } from '@/components/button';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { FileUpdownForm, FileUpdownFormHandle } from '@/components/form/FileUpdownForm';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Sys10_Lookup_FileViewer } from '../sys/Sys10_Lookup_FileViewer';

const gb = gbFor<FileInfo>();

interface Props {
  /** open(parentId, …) — 값이 있으면 열린다 (당분기 청구보수 ID) */
  parentId: number | null;
  /** 확정된 청구보수 — [파일업로드]와 파일삭제 열을 숨긴다 */
  fixYn: boolean;
  onClose: () => void;
}

export const Biz20_Lookup_FileList: React.FC<Props> = ({ parentId, fixYn, onClose }) => {
  const [rows, setRows] = useState<FileInfo[]>([]);
  const [viewFile, setViewFile] = useState<FileInfo | null>(null);
  const fileUpload = useRef<FileUpdownFormHandle>(null);

  // retrieve() L211-215: 서비스 sys.Sys10_File.selectByFeeChargeId(parentId)
  const retrieve = useCallback(async () => {
    if (parentId == null) { setRows([]); return; }
    try {
      setRows(await fileApi.searchByParentId(parentId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [parentId]);
  // [E0] 화면 열림 (생성자 L63-105) → show() · open() → settings(), retrieve()
  useEffect(() => { void retrieve(); }, [retrieve]);

  // [E3] uploadButton[파일업로드].Select (L122) → fileUpload() · [E5]·[E7] fileUpload.Change (L142·L224) → FileUpload?parentId={parentId}
  //   · [E1] fileUploadForm.SubmitComplete (L81) → resetFileUpload(), retrieve()
  const onFilesChange = async (files: File[]) => {
    if (parentId == null || files.length === 0) return;
    try {
      for (const file of files) await fileApi.upload(parentId, file);
    } catch (err) {
      message.error(errorMessage(err, '파일 올리기 실패'));
    }
    await retrieve();
  };

  // checkFileDelete() L234-259: 1 연결만 지움 → retrieve(), 2 안내 문구, 3 FileDelete?fileId= → [E2] fileDeleteForm.SubmitComplete (L88) → retrieve()
  const checkFileDelete = async (row: FileInfo) => {
    try {
      const { status, message: text } = await fileApi.checkFileDeleteResult(row.fileId, row.parentId);
      if (status === FILE_DELETE_STATUS.RELATE_DELETED) {
        await retrieve();
      } else if (status === FILE_DELETE_STATUS.IN_USE) {
        Modal.info({ title: '확인', content: text ?? '해당 파일은 삭제할 수 없습니다', okText: '확인' });
      } else if (status === FILE_DELETE_STATUS.DELETABLE) {
        await fileApi.deleteFile(row.fileId);
        await retrieve();
      }
    } catch (err) {
      message.error(errorMessage(err, '삭제 실패'));
    }
  };

  // buildGrid() L154-209: 파일명 500 · size(KB) 60 · 파일받기 80 · 파일삭제 80(확정이면 숨김) · 미리보기 80
  const columnDefs = useMemo(() => [
    gb.text('fileNm', 500, '파일명'),  // L202
    gb.double('size', 60, 'size(KB)'),  // L203
    iconCell<FileInfo>('down', 'downloadCell', 80, '파일받기', row => {  // L204 → FileDownload?fileType=file&fileId=
      fileApi.download(row.fileId).catch(err => message.error(errorMessage(err, '다운로드 실패')));
    }),
    ...(fixYn ? [] : [iconCell<FileInfo>('delete', 'deleteCell', 80, '파일삭제', row => {  // L205 → [E6] msgBox "해당 파일을 삭제하시겠습니까?" [YES] (L172) → checkFileDelete()
      Modal.confirm({
        title: '확인',
        content: '해당 파일을 삭제하시겠습니까?',
        okText: '예',
        cancelText: '아니오',
        width: 250,
        onOk: () => checkFileDelete(row),
      });
    })]),  // 확정이면 파일삭제 열(4)을 숨긴다 (settings() L117-120)
    iconCell<FileInfo>('view', 'viewCell', 80, '미리보기', row => setViewFile(row)),  // L206 → Sys10_Lookup_FileViewer.open(fileId)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [retrieve, fixYn]);

  return (
    <>
      <LookupModal
        open={parentId != null}
        title="파일 List"
        width={1000}
        style={{ top: 20 }}
        maskClosable={false}
        onCancel={onClose}
        destroyOnHidden
        styles={{
          header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 12 },
          footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 12 },
        }}
        footer={
          <div style={{ textAlign: 'center' }}>
            {/* [E4] closeButton[닫기].Select (L128) → callback.execute(), hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </div>
        }
      >
        <div style={{ height: 'calc(100vh - 280px)', minHeight: 300, maxHeight: 520, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {!fixYn && (
            <div>
              <Button type="upload" onClick={() => fileUpload.current?.click()}>파일업로드</Button>
            </div>
          )}
          <div style={{ flex: 1, minHeight: 0 }}>
            <SingleGrid<FileInfo>
              rowData={rows}
              columnDefs={columnDefs}
              getRowId={p => String(p.data.fileId)}
            />
          </div>
        </div>
      </LookupModal>
      <FileUpdownForm ref={fileUpload} onChange={() => undefined} onChangeFiles={onFilesChange} />
      <Sys10_Lookup_FileViewer file={viewFile} onClose={() => setViewFile(null)} />
    </>
  );
};
