/**
 * 법규등록 서식파일 목록 (E09) — Ics17_Edit_UserRequestAdmin의 "서식파일" 칸
 * AS-IS: myApp/client/vi/ics/Ics17_Grid_FileList.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 그리드 buildApprFileGrid() L92-140: 체크박스 단일 선택, 첨부파일 270 · 보기 50 · 받기 50 · 삭제 50. 높이 150
 * 부르는 쪽이 ref.retrieve()로 다시 읽는다 (AS-IS retrieve(userRequestModel, editable))
 */
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { message, Modal } from 'antd';
import { fileApi, FILE_DELETE_STATUS } from '@/api/file';
import { errorMessage } from '@/api/client';
import { FileInfo } from '@/types/sys';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { Sys10_Lookup_FileViewer } from '@/pages/sys/Sys10_Lookup_FileViewer';

const gb = gbFor<FileInfo>();

export interface Ics17_Grid_FileListHandle {
  retrieve: () => Promise<void>;
}

interface Props {
  /** AS-IS retrieve(userRequestModel) — 법규등록요청 ID. 없으면 비운다 */
  parentId?: number | null;
}

export const Ics17_Grid_FileList = forwardRef<Ics17_Grid_FileListHandle, Props>(({ parentId }, ref) => {
  const [rows, setRows] = useState<FileInfo[]>([]);
  const [viewFile, setViewFile] = useState<FileInfo | null>(null);

  // [E0] 화면 열림 (생성자 L47-71), retrieve() L77-90: 서비스 sys.Sys10_File.selectByParentId(parentId)
  const retrieve = useCallback(async () => {
    if (parentId == null || parentId <= 0) {
      setRows([]);
      return;
    }
    try {
      setRows(await fileApi.searchByParentId(parentId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [parentId]);

  useImperativeHandle(ref, () => ({ retrieve }), [retrieve]);
  useEffect(() => { void retrieve(); }, [retrieve]);

  // checkFileDelete() L142-167: 연결만 지움(1) → 다시 조회 / 사용 중(2) → 안내 / 지워도 됨(3) → FileDelete → [E1] fileDeleteForm.SubmitComplete (L62) → retrieve()
  const checkFileDelete = async (row: FileInfo) => {
    try {
      const status = await fileApi.checkFileDelete(row.fileId, row.parentId);
      if (status === FILE_DELETE_STATUS.RELATE_DELETED) {
        await retrieve();
      } else if (status === FILE_DELETE_STATUS.IN_USE) {
        message.warning('해당 파일은 다른 상신문서에서 사용 중이므로 삭제할 수 없습니다');
      } else if (status === FILE_DELETE_STATUS.DELETABLE) {
        await fileApi.deleteFile(row.fileId);
        await retrieve();
      }
    } catch (err) {
      message.error(errorMessage(err, '삭제 실패'));
    }
  };

  const columnDefs = useMemo(() => [
    gb.text('fileNm', 270, '첨부파일'),  // L134
    iconCell<FileInfo>('view', 'viewCell', 50, '보기', setViewFile),  // L135 viewCell → Sys10_Lookup_FileViewer.open(fileId)
    iconCell<FileInfo>('down', 'downloadCell', 50, '받기', row => {  // L136 downloadCell → FileDownload?fileType=file&fileId=
      fileApi.download(row.fileId).catch(err => message.error(errorMessage(err, '다운로드 실패')));
    }),
    iconCell<FileInfo>('delete', 'deleteCell', 50, '삭제', row => {  // L137 deleteCell → [E2] msgBox "선택한 파일을 삭제하시겠습니까?" [YES] (L112) → checkFileDelete()
      Modal.confirm({
        title: '삭제',
        content: '선택한 파일을 삭제하시겠습니까?',
        okText: '예',
        cancelText: '아니오',
        onOk: () => checkFileDelete(row),
      });
    }),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [retrieve]);

  return (
    <>
      <div style={{ height: 150 }}>
        <SingleGrid<FileInfo>
          rowData={rows}
          columnDefs={columnDefs}
          getRowId={p => String(p.data.fileId)}
          rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: true }}
        />
      </div>
      <Sys10_Lookup_FileViewer file={viewFile} onClose={() => setViewFile(null)} />
    </>
  );
});
Ics17_Grid_FileList.displayName = 'Ics17_Grid_FileList';
