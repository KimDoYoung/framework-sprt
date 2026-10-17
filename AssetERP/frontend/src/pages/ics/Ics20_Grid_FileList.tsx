/**
 * 개정내역 첨부파일 목록 (E03) — Ics20_Edit_RevisionHistoryAdmin의 "첨부파일" 칸
 * AS-IS: myApp/client/vi/ics/ics20_Grid_FileList.java (클래스 이름 첫 글자가 소문자) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 그리드 buildApprFileGrid() L62-110: 체크박스 단일 선택, 첨부파일 380 · 받기 50 · 삭제 50. userType "user"(Ics20_Edit_RevisionHistory)는 삭제 칸을 숨기지만 이 화면은 "admin"만 쓴다
 * 부르는 쪽이 ref.retrieve()로 다시 읽는다 (AS-IS retrieve(revisionHistoryModel, userType))
 */
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { message, Modal } from 'antd';
import { fileApi, FILE_DELETE_STATUS } from '@/api/file';
import { errorMessage } from '@/api/client';
import { FileInfo } from '@/types/sys';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';

const gb = gbFor<FileInfo>();

export interface Ics20_Grid_FileListHandle {
  retrieve: () => Promise<void>;
}

interface Props {
  /** AS-IS retrieve(revisionHistoryModel) — 개정내역 ID. 없거나 저장 전(0 이하)이면 비운다 */
  parentId?: number | null;
}

export const Ics20_Grid_FileList = forwardRef<Ics20_Grid_FileListHandle, Props>(({ parentId }, ref) => {
  const [rows, setRows] = useState<FileInfo[]>([]);

  // retrieve() L90-110: 서비스 sys.Sys10_File.selectByParentId(parentId)
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

  // checkFileDelete() L112-146: 연결만 지움(1) → 다시 조회 / 사용 중(2) → 안내 / 지워도 됨(3) → FileDelete → fileDeleteForm.SubmitComplete (L48) → retrieve()
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
    gb.text('fileNm', 380, '첨부파일'),  // L105
    iconCell<FileInfo>('down', 'downloadCell', 50, '받기', row => {  // L106 downloadCell → FileDownload?fileType=file&fileId=
      fileApi.download(row.fileId).catch(err => message.error(errorMessage(err, '다운로드 실패')));
    }),
    iconCell<FileInfo>('delete', 'deleteCell', 50, '삭제', row => {  // L107 deleteCell → msgBox "선택한 파일을 삭제하시겠습니까?" → checkFileDelete()
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
    <SingleGrid<FileInfo>
      rowData={rows}
      columnDefs={columnDefs}
      getRowId={p => String(p.data.fileId)}
      rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: true }}
    />
  );
});
Ics20_Grid_FileList.displayName = 'Ics20_Grid_FileList';
