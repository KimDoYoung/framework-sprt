/**
 * 대외활동신청 첨부파일 목록 (M01) — Ics35_Edit_ExtrActivity의 "첨부자료" 칸
 * AS-IS: myApp/client/vi/ics/Ics35_Grid_FileList.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 그리드 buildGrid() L90-140: 단일 선택(체크박스 없음), 파일명 440 · 보기 50 · 받기 50 · 삭제 50. 높이 190(부모 행). 파일 올리기는 부르는 쪽이 ref.upload() (L86-88)
 */
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { message, Modal } from 'antd';
import { fileApi } from '@/api/file';
import { errorMessage } from '@/api/client';
import { FileInfo } from '@/types/sys';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { FileUpdownForm, FileUpdownFormHandle } from '@/components/form/FileUpdownForm';
import { Sys10_Lookup_FileViewer } from '@/pages/sys/Sys10_Lookup_FileViewer';

const gb = gbFor<FileInfo>();

export interface Ics35_Grid_FileListHandle {
  /** AS-IS upload() L86-88 — 파일 선택 창을 연다 */
  upload: () => void;
}

interface Props {
  /** AS-IS retrieve(parentId) — 대외활동신청 ID. 없으면 비운다 */
  parentId?: number | null;
}

export const Ics35_Grid_FileList = forwardRef<Ics35_Grid_FileListHandle, Props>(({ parentId }, ref) => {
  const [rows, setRows] = useState<FileInfo[]>([]);
  const [viewFile, setViewFile] = useState<FileInfo | null>(null);
  const fileUpload = useRef<FileUpdownFormHandle>(null);

  // [E0] 화면 열림 (생성자 L41-53) → settings(), retrieve(parentId) L142-155: 서비스 sys.Sys10_File.selectByParentId(parentId)
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

  useImperativeHandle(ref, () => ({ upload: () => fileUpload.current?.click() }), []);
  useEffect(() => { void retrieve(); }, [retrieve]);

  // [E3] fileUpload.Change (L76) → FileUpload?parentId={ID} (여러 파일), [E1] fileUploadForm.SubmitComplete (L60) → resetFileUpload() L157-172 + retrieve(), [E5] fileUpload.Change (L164)
  const onFilesChange = async (files: File[]) => {
    if (parentId == null || files.length === 0) return;
    try {
      for (const file of files) await fileApi.upload(parentId, file);
    } catch (err) {
      message.error(errorMessage(err, '파일 올리기 실패'));
    }
    await retrieve();
  };

  // checkFileDelete() L174-182: FileDelete?fileId= → [E2] fileDeleteForm.SubmitComplete (L69) → retrieve()
  const checkFileDelete = async (row: FileInfo) => {
    try {
      await fileApi.deleteFile(row.fileId);
      await retrieve();
    } catch (err) {
      message.error(errorMessage(err, '삭제 실패'));
    }
  };

  const columnDefs = useMemo(() => [
    gb.text('fileNm', 440, '파일명'),  // L134
    iconCell<FileInfo>('view', 'viewCell', 50, '보기', setViewFile),  // L135 viewCell → Sys10_Lookup_FileViewer.open(fileId)
    iconCell<FileInfo>('down', 'downloadCell', 50, '받기', row => {  // L136 downloadCell → FileDownload?fileType=file&fileId=
      fileApi.download(row.fileId).catch(err => message.error(errorMessage(err, '다운로드 실패')));
    }),
    iconCell<FileInfo>('delete', 'deleteCell', 50, '삭제', row => {  // L137 deleteCell → [E4] msgBox "해당 파일을 삭제하시겠습니까?" [YES] (L114) → checkFileDelete()
      Modal.confirm({
        title: '확인',
        content: '해당 파일을 삭제하시겠습니까?',
        okText: '예',
        cancelText: '아니오',
        width: 350,
        onOk: () => checkFileDelete(row),
      });
    }),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [retrieve]);

  return (
    <>
      <div style={{ height: '100%' }}>
        <SingleGrid<FileInfo>
          rowData={rows}
          columnDefs={columnDefs}
          getRowId={p => String(p.data.fileId)}
          rowSelection={{ mode: 'singleRow', checkboxes: false, enableClickSelection: true }}
        />
      </div>
      <FileUpdownForm ref={fileUpload} onChange={() => undefined} onChangeFiles={onFilesChange} />
      <Sys10_Lookup_FileViewer file={viewFile} onClose={() => setViewFile(null)} />
    </>
  );
});
Ics35_Grid_FileList.displayName = 'Ics35_Grid_FileList';
