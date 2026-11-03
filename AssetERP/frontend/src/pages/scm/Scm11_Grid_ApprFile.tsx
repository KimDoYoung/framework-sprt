/**
 * 개발 첨부파일 그리드 (EE17) — Scm11_Edit_DevStep 아래 오른쪽(500×220)
 * AS-IS: myApp/client/vi/scm/Scm11_Grid_ApprFile.java (153줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 그리드 buildApprFileGrid() L88-140: 체크 단일, 첨부파일 270 · 보기 50 · 받기 50 · 삭제 50. hideButton(true) L142-148은 삭제 열을 감춘다(담당자가 아니거나 수정할 수 없을 때)
 * [E0] 화면 열림 (생성자 L43-67) → 그리드를 가득 채운다 · retrieve(devId, editable) L73-86: sys.Sys10_File.selectByDevId(개발 + 진행단계에 올린 파일)
 * [E1] fileDeleteForm.SubmitComplete (L58) → retrieve() · [E2] 삭제 아이콘 → 확인창 "선택한 파일을 삭제하시겠습니까?" YES → FileDelete → 다시 조회
 * 올리기는 Scm11_Edit_DevStep의 [파일업로드]가 한다(FileUpload?parentId=devStepId)
 */
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { message, Modal } from 'antd';
import { scmApi } from '@/api/scm';
import { fileApi } from '@/api/file';
import { errorMessage } from '@/api/client';
import { FileInfo } from '@/types/sys';
import { SingleGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { Sys10_Lookup_FileViewer } from '@/pages/sys/Sys10_Lookup_FileViewer';

const gb = gbFor<FileInfo>();
/** setChecked(SINGLE). 렌더마다 새 객체를 주면 선택이 풀리므로 한 번만 만든다 */
const SINGLE_CHECK = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;

export interface ScmDevApprFileHandle {
  retrieve: () => Promise<void>;
}

interface Props {
  /** 개발 번호. null이면 비운다(clear) */
  devId: number | null;
  /** hideButton(!editable) — false면 삭제 열을 감춘다 */
  editable: boolean;
}

export const Scm11_Grid_ApprFile = forwardRef<ScmDevApprFileHandle, Props>(({ devId, editable }, ref) => {
  const [rows, setRows] = useState<FileInfo[]>([]);
  const [viewFile, setViewFile] = useState<FileInfo | null>(null);

  const retrieve = useCallback(async () => {
    if (devId == null) { setRows([]); return; }
    try {
      setRows(await scmApi.searchDevFiles(devId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [devId]);

  useEffect(() => { void retrieve(); }, [retrieve]);
  useImperativeHandle(ref, () => ({ retrieve }), [retrieve]);

  // [E2] deleteCell → 확인창 YES → FileDelete?fileId= → [E1] SubmitComplete → retrieve()
  const deleteFile = (row: FileInfo) => {
    Modal.confirm({
      title: '삭제', content: '선택한 파일을 삭제하시겠습니까?', okText: '예', cancelText: '아니오',
      onOk: async () => {
        try {
          await fileApi.deleteFile(row.fileId);
          await retrieve();
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  const columnDefs = useMemo(() => [
    gb.text('fileNm', 270, '첨부파일'),
    iconCell<FileInfo>('view', 'viewCell', 50, '보기', setViewFile),
    iconCell<FileInfo>('down', 'downloadCell', 50, '받기', row => {
      fileApi.download(row.fileId).catch(err => message.error(errorMessage(err, '다운로드 실패')));
    }),
    ...(editable ? [iconCell<FileInfo>('delete', 'deleteCell', 50, '삭제', deleteFile)] : []),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [editable, retrieve]);

  return (
    <>
      <SingleGrid<FileInfo> rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.fileId)} rowSelection={SINGLE_CHECK} />
      {/* 보기 아이콘 L124-131 → Sys10_Lookup_FileViewer_AView.open(fileId) */}
      <Sys10_Lookup_FileViewer file={viewFile} onClose={() => setViewFile(null)} />
    </>
  );
});
Scm11_Grid_ApprFile.displayName = 'Scm11_Grid_ApprFile';
