/**
 * 증빙자료 파일 목록 (L02) — Biz05_Lookup_RelateAppr 아래 칸에 붙는 조각
 * AS-IS: myApp/client/vi/biz/Biz05_Lookup_RelateFile.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L60-99: 툴바 [파일업로드](숨은 파일 선택) + 파일 그리드(buildFileGrid L123-171: 체크박스 단일, 첨부파일 450 · 보기 50 · 받기 50 · 삭제 50)
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
  /** open(promoId) — 이익제공(수령) 내역 ID. 없으면 비운다 */
  promoId: number | null;
}

export const Biz05_Lookup_RelateFile: React.FC<Props> = ({ promoId }) => {
  const fileForm = useRef<FileUpdownFormHandle>(null);
  const [rows, setRows] = useState<FileInfo[]>([]);
  const [viewFile, setViewFile] = useState<FileInfo | null>(null);

  // retrieve() L173-177: 서비스 sys.Sys10_File.selectByParentId(parentId = promoId)
  const retrieve = useCallback(async () => {
    if (promoId == null) { setRows([]); return; }
    try {
      setRows(await fileApi.searchByParentId(promoId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [promoId]);

  // [E0] 열림 (생성자 L60-99, open L54-58) → settings(), retrieve()
  useEffect(() => { void retrieve(); }, [retrieve]);

  // [E1] fileUpload.Change (L68) → FileUpload?parentId=promoId 제출 → [E2] fileUploadForm.SubmitComplete (L78) → retrieve()
  const onFiles = async (files: File[]) => {
    if (promoId == null) return;
    try {
      for (const file of files) await fileApi.upload(promoId, file);
    } catch (err) {
      message.error(errorMessage(err, '파일 업로드 실패'));
    }
    await retrieve();
  };

  // [E5] messageBox.DialogHide [YES] (L143) → checkFileDelete() L179-204: 연결만 지움(1) → retrieve / 사용 중(2) → 서버 문구 / 지워도 됨(3) → FileDelete → [E4] fileDeleteForm.SubmitComplete (L115) → retrieve()
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

  // buildFileGrid() L123-171
  const columnDefs = useMemo(() => [
    gb.text('fileNm', 450, '첨부파일'),  // L165
    iconCell<FileInfo>('view', 'viewCell', 50, '보기', setViewFile),  // L166 viewCell → Sys10_Lookup_FileViewer.open(fileId)
    iconCell<FileInfo>('down', 'downloadCell', 50, '받기', row => {  // L167 downloadCell → FileDownload?fileType=file&fileId=
      fileApi.download(row.fileId).catch(err => message.error(errorMessage(err, '다운로드 실패')));
    }),
    iconCell<FileInfo>('delete', 'deleteCell', 50, '삭제', row => {  // L168 deleteCell → "삭제"/"선택한 파일을 삭제하시겠습니까?" → [E5]
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
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, boxSizing: 'border-box', border: '1px solid #d9d9d9', padding: 8 }}>
      <div>
        {/* [E3] uploadFileButton[파일업로드].Select (L105) → fileUpload.click() */}
        <Button type="upload" onClick={() => fileForm.current?.click()}>파일업로드</Button>
      </div>
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
