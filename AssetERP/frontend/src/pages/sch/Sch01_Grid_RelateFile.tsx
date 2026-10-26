/**
 * 업무일정 첨부파일 목록 (O01) — Sch01_Lookup_Info의 "첨부파일" 칸
 * AS-IS: myApp/client/vi/sch/Sch01_Grid_RelateFile.java (212줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L50-96: 위 툴바 50([파일업로드], 숨은 업로드 폼), 아래 그리드(체크 단일: 첨부파일명 400 · 받기 80 · 삭제 80 · 보기 80)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message } from 'antd';
import { fileApi, FILE_DELETE_STATUS } from '@/api/file';
import { errorMessage } from '@/api/client';
import { FileInfo } from '@/types/sys';
import { Button } from '@/components/button';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { FileUpdownForm, FileUpdownFormHandle } from '@/components/form/FileUpdownForm';
import { Sys10_Lookup_FileViewer } from '@/pages/sys/Sys10_Lookup_FileViewer';

const gb = gbFor<FileInfo>();

interface Props {
  /** retrieve(parentId) L146-158 — 업무일정 ID */
  parentId: number | null;
}

export const Sch01_Grid_RelateFile: React.FC<Props> = ({ parentId }) => {
  const [rows, setRows] = useState<FileInfo[]>([]);
  const [viewFile, setViewFile] = useState<FileInfo | null>(null);
  const fileUpload = useRef<FileUpdownFormHandle>(null);

  // retrieve(parentId) L146-158: 서비스 sys.Sys10_File.selectByParentId(parentId)
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

  // [E0] 화면 열림 (생성자 L50-96) → settings() L98-106
  useEffect(() => { void retrieve(); }, [retrieve]);

  // [E5 생략] fileUpload.Change (L194) → resetFileUpload() 안에서 업로드 칸을 다시 만들며 같은 핸들러를 다시 단다 — FileUpdownForm이 고른 뒤 값을 비워 같은 파일도 다시 고를 수 있다
  // [E4] updateButton[파일업로드].Select (L100) → fileUpload.click(), [E2] fileUpload.Change (L68) → FileUpload?parentId={ID}
  // [E1] fileUploadForm.SubmitComplete (L60) → resetFileUpload() + retrieve()
  const onFileChange = async (file: File | undefined) => {
    if (parentId == null || !file) return;
    try {
      await fileApi.upload(parentId, file);
    } catch (err) {
      message.error(errorMessage(err, '파일 올리기 실패'));
    }
    await retrieve();
  };

  // checkFileDelete() L160-185: sys.Sys11_RelateFile.checkFileDelete(fileId, parentId) → 1 연결만 지움 → retrieve(), 2 메시지, 3 FileDelete?fileId= → [E3] fileDeleteForm.SubmitComplete (L78) → retrieve()
  const checkFileDelete = async (row: FileInfo) => {
    try {
      const result = await fileApi.checkFileDeleteResult(row.fileId, row.parentId ?? parentId ?? 0);
      if (result.status === FILE_DELETE_STATUS.IN_USE) {
        message.warning(result.message ?? '삭제할 수 없는 파일입니다');
        return;
      }
      if (result.status === FILE_DELETE_STATUS.DELETABLE) await fileApi.deleteFile(row.fileId);
      await retrieve();
    } catch (err) {
      message.error(errorMessage(err, '삭제 실패'));
    }
  };

  // buildApprFileGrid() L108-144
  const columnDefs = useMemo(() => [
    gb.text('fileNm', 400, '첨부파일명'),  // L137
    iconCell<FileInfo>('down', 'downloadCell', 80, '받기', row => {  // L138 downloadCell → FileDownload?fileType=file&fileId=
      fileApi.download(row.fileId).catch(err => message.error(errorMessage(err, '다운로드 실패')));
    }),
    iconCell<FileInfo>('delete', 'deleteCell', 80, '삭제', row => { void checkFileDelete(row); }),  // L139 deleteCell → checkFileDelete() (확인 없이)
    iconCell<FileInfo>('view', 'viewCell', 80, '보기', setViewFile),  // L140 viewCell → Sys10_Lookup_FileViewer.open(fileId)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [retrieve]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div>
        <Button type="upload" onClick={() => fileUpload.current?.click()}>파일업로드</Button>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <SingleGrid<FileInfo>
          rowData={rows}
          columnDefs={columnDefs}
          getRowId={p => String(p.data.fileId)}
          rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: true }}
        />
      </div>
      <FileUpdownForm ref={fileUpload} onChange={file => { void onFileChange(file); }} />
      <Sys10_Lookup_FileViewer file={viewFile} onClose={() => setViewFile(null)} />
    </div>
  );
};
