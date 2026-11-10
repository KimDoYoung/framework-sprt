/**
 * 증빙자료 파일 목록 (EE34) — Com01_Lookup_RelateAppr 아래 칸(높이 200)에 붙는 조각
 * AS-IS: myApp/client/vi/com/Com01_Grid_RelateFile.java (300줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L80-133: 툴바 [파일업로드](숨은 파일 선택) + 파일 그리드(buildFileGrid L157-205: 체크박스 단일, 첨부파일 500 · 보기 50 · 받기 50 · 삭제 50)
 * open(keyTableId, callback) L64-69 / view(keyTableId) L71-78: view 는 [파일업로드]와 삭제 열을 숨기고 callback 이 없다(setDisable L244-247)
 * 끌어놓기(initDropPanel·initFileDropNative L253-)는 FileUpdownForm 이 맡는 파일 선택으로 대신한다(Biz05_Lookup_RelateFile 과 같음)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Modal } from 'antd';
import { fileApi, FILE_DELETE_STATUS } from '@/api/file';
import { errorMessage } from '@/api/client';
import { FileInfo } from '@/types/sys';
import { Button } from '@/components/button';
import { FileUpdownForm, FileUpdownFormHandle } from '@/components/form/FileUpdownForm';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { Sys10_Lookup_FileViewer } from '@/pages/sys/Sys10_Lookup_FileViewer';

const gb = gbFor<FileInfo>();
const SINGLE_SELECTION = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;

interface Props {
  /** open(keyTableId, …)·view(keyTableId) 의 keyTableId — 파일의 parentId. 없으면 비운다 */
  keyTableId: number | null;
  /** view() — [파일업로드]·삭제 열을 숨긴다 */
  readOnly?: boolean;
  /** 업로드·삭제가 끝난 뒤 (AS-IS callback.execute()) — 부르는 쪽이 증빙자료 건수를 다시 센다 */
  onChanged?: () => void;
}

export const Com01_Grid_RelateFile: React.FC<Props> = ({ keyTableId, readOnly = false, onChanged }) => {
  const fileForm = useRef<FileUpdownFormHandle>(null);
  const [rows, setRows] = useState<FileInfo[]>([]);
  const [viewFile, setViewFile] = useState<FileInfo | null>(null);

  // retrieve() L207-211: 서비스 sys.Sys10_File.selectByParentId(parentId = keyTableId)
  const retrieve = useCallback(async () => {
    if (keyTableId == null) { setRows([]); return; }
    try {
      setRows(await fileApi.searchByParentId(keyTableId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [keyTableId]);

  // [E0] 열림 (생성자 L80-133, open L64-69) → settings(), retrieve()
  useEffect(() => { void retrieve(); }, [retrieve]);

  // [E1] fileUpload.Change (L88) → FileUpload?parentId=keyTableId 제출 → [E2] fileUploadForm.SubmitComplete [callback != null] (L98) → callback.execute(), retrieve()
  const onFiles = async (files: File[]) => {
    if (keyTableId == null) return;
    try {
      for (const file of files) await fileApi.upload(keyTableId, file);
    } catch (err) {
      message.error(errorMessage(err, '파일 업로드 실패'));
    }
    onChanged?.();
    await retrieve();
  };

  // [E5] messageBox.DialogHide [YES] (L177) → checkFileDelete() L213-242: 연결만 지움(1) → retrieve / 사용 중(2) → 서버 문구 / 지워도 됨(3) → FileDelete → [E4] fileDeleteForm.SubmitComplete (L149) → retrieve(), callback.execute()
  const checkFileDelete = async (row: FileInfo) => {
    try {
      // 상태 2 문구는 서버 것(AS-IS SimpleMessage(result.getMessage())) — 상신문서 사용 중 / 사용중인 파일 두 가지
      const { status, message: inUseMessage } = await fileApi.checkFileDeleteResult(row.fileId, row.parentId);
      if (status === FILE_DELETE_STATUS.RELATE_DELETED) {
        await retrieve();
      } else if (status === FILE_DELETE_STATUS.IN_USE) {
        message.warning(inUseMessage ?? '해당 파일은 다른 상신문서에서 사용 중이므로 삭제할 수 없습니다');
      } else if (status === FILE_DELETE_STATUS.DELETABLE) {
        await fileApi.deleteFile(row.fileId);
        onChanged?.();
        await retrieve();
      }
    } catch (err) {
      message.error(errorMessage(err, '삭제 실패'));
    }
  };

  // buildFileGrid() L157-205
  const columnDefs = useMemo(() => [
    gb.text('fileNm', 500, '첨부파일'),  // L199
    iconCell<FileInfo>('view', 'viewCell', 50, '보기', setViewFile),  // L200 viewCell → Sys10_Lookup_FileViewer.open(fileId)
    iconCell<FileInfo>('down', 'downloadCell', 50, '받기', row => {  // L201 downloadCell → FileDownload?fileType=file&fileId=
      fileApi.download(row.fileId).catch(err => message.error(errorMessage(err, '다운로드 실패')));
    }),
    ...(readOnly ? [] : [
      iconCell<FileInfo>('delete', 'deleteCell', 50, '삭제', row => {  // L202 deleteCell → "삭제"/"선택한 파일을 삭제하시겠습니까?" → [E5]
        Modal.confirm({
          title: '삭제',
          content: '선택한 파일을 삭제하시겠습니까?',
          okText: '예',
          cancelText: '아니오',
          onOk: () => checkFileDelete(row),
        });
      }),
    ]),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [retrieve, readOnly]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, boxSizing: 'border-box', border: '1px solid #d9d9d9', padding: 8 }}>
      {!readOnly && (
        <div>
          {/* [E3] uploadFileButton[파일업로드].Select (L139) → fileUpload.click() */}
          <Button type="upload" onClick={() => fileForm.current?.click()}>파일업로드</Button>
        </div>
      )}
      <FileUpdownForm ref={fileForm} onChange={() => undefined} onChangeFiles={onFiles} />
      <div style={{ flex: 1, minHeight: 0 }}>
        <SingleGrid<FileInfo>
          rowData={rows}
          columnDefs={columnDefs}
          getRowId={p => String(p.data.fileId)}
          rowSelection={SINGLE_SELECTION}
        />
      </div>
      <Sys10_Lookup_FileViewer file={viewFile} onClose={() => setViewFile(null)} />
    </div>
  );
};
