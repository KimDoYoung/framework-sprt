/**
 * 연관문서 창의 첨부파일 목록 (W05 2단계 ⓑ) — Act80_Lookup_RelateAppr 아래
 * AS-IS: myApp/client/vi/act/Act80_LookupGrid_RelateFile.java (236줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L55-94: 위 툴바 50([파일업로드], 숨은 업로드 폼) + 그리드(체크 단일: 첨부파일 450 · 보기 50 · 받기 50 · 삭제 50 · 잠금 40)
 * open(code, relateId) L96-120: code가 journalId면 relateId가 곧 전표 ID, trId면 act.Act02_Journal.selectOneJournalIdByTrId로 전표 ID를 찾고 없으면 [파일업로드]를 막는다
 * 샘플: 같은 모양의 Sch01_Grid_RelateFile(O01) — 이 목록은 sys.Sys10_File.selectByParentId2(잠김 포함)를 읽는다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Modal } from 'antd';
import { actApi } from '@/api/act';
import { fileApi, FILE_DELETE_STATUS } from '@/api/file';
import { errorMessage } from '@/api/client';
import { FileLock } from '@/types/sys';
import { Button } from '@/components/button';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { FileUpdownForm, FileUpdownFormHandle } from '@/components/form/FileUpdownForm';
import { Sys10_Lookup_FileViewer } from '@/pages/sys/Sys10_Lookup_FileViewer';

const gb = gbFor<FileLock>();

interface Props {
  /** open(code, relateId)의 code — 값이 없으면 닫힌 상태(읽지 않는다) */
  code: 'trId' | 'journalId' | null;
  relateId: number | null;
}

export const Act80_LookupGrid_RelateFile: React.FC<Props> = ({ code, relateId }) => {
  const [rows, setRows] = useState<FileLock[]>([]);
  /** 첨부파일의 부모(전표 ID). 거래에 전표가 없으면 null이고 [파일업로드]를 막는다 */
  const [journalId, setJournalId] = useState<number | null>(null);
  const [viewFile, setViewFile] = useState<FileLock | null>(null);
  const fileUpload = useRef<FileUpdownFormHandle>(null);

  // retrieve() L227-231: sys.Sys10_File.selectByParentId2(parentId = 전표 ID)
  const retrieve = useCallback(async (id: number | null = journalId) => {
    if (id == null) { setRows([]); return; }
    try {
      setRows(await fileApi.searchByParentIdWithLock(id));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [journalId]);

  // [E0] 화면 열림 (생성자 L55-94, open L96-120) → settings(), journalId면 곧바로 retrieve(), trId면 전표 ID를 찾아 retrieve()
  useEffect(() => {
    setRows([]);
    setJournalId(null);
    if (code == null || relateId == null) return;
    if (code === 'journalId') {
      setJournalId(relateId);
      void retrieve(relateId);
      return;
    }
    void (async () => {
      try {
        const id = await actApi.getJournalIdByTr(relateId);
        setJournalId(id);
        if (id != null) await retrieve(id);
      } catch (err) {
        message.error(errorMessage(err, '조회 실패'));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, relateId]);

  // [E3] uploadFileButton[파일업로드].Select (L126) → fileUpload.click(), [E1] fileUpload.Change (L63) → FileUpload?parentId={전표 ID}, [E2] fileUploadForm.SubmitComplete (L73) → retrieve()
  const onFileChange = async (file: File | undefined) => {
    if (journalId == null || !file) return;
    try {
      await fileApi.upload(journalId, file);
    } catch (err) {
      message.error(errorMessage(err, '파일 올리기 실패'));
    }
    await retrieve();
  };

  // checkFileDelete() L195-225: 잠김이면 "삭제할 수 없는 파일입니다" → sys.Sys11_RelateFile.checkFileDelete(fileId, parentId) → 1 연결만 지움 → retrieve(), 2 메시지, 3 FileDelete?fileId= → [E4] fileDeleteForm.SubmitComplete (L136) → retrieve()
  const checkFileDelete = async (row: FileLock) => {
    if (row.lockYn) { message.warning('삭제할 수 없는 파일입니다'); return; }
    try {
      const result = await fileApi.checkFileDeleteResult(row.fileId, row.parentId ?? journalId ?? 0);
      if (result.status === FILE_DELETE_STATUS.IN_USE) { message.warning(result.message ?? '삭제할 수 없는 파일입니다'); return; }
      if (result.status === FILE_DELETE_STATUS.DELETABLE) await fileApi.deleteFile(row.fileId);
      await retrieve();
    } catch (err) {
      message.error(errorMessage(err, '삭제 실패'));
    }
  };

  // buildFileGrid() L144-193
  const columnDefs = useMemo(() => [
    gb.text('fileNm', 450, '첨부파일'),  // L186
    iconCell<FileLock>('view', 'viewCell', 50, '보기', setViewFile),  // L187 viewCell → Sys10_Lookup_FileViewer.open(fileId)
    iconCell<FileLock>('down', 'downloadCell', 50, '받기', row => {  // L188 downloadCell → FileDownload?fileType=file&fileId=
      fileApi.download(row.fileId).catch(err => message.error(errorMessage(err, '다운로드 실패')));
    }),
    // [E5] messageBox.DialogHide [YES] (L164) → checkFileDelete()
    iconCell<FileLock>('delete', 'deleteCell', 50, '삭제', row => {  // L189 deleteCell → 확인 "삭제" "선택한 파일을 삭제하시겠습니까?"
      Modal.confirm({ title: '삭제', content: '선택한 파일을 삭제하시겠습니까?', okText: '예', cancelText: '아니오', onOk: () => checkFileDelete(row) });
    }),
    gb.booleanIcon('lockYn', 40, ''),  // L190 addBooleanIcon
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [retrieve]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div>
        <Button type="upload" disabled={journalId == null} onClick={() => fileUpload.current?.click()}>파일업로드</Button>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <SingleGrid<FileLock>
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
