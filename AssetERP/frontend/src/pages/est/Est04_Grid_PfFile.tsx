/**
 * 수행내역 증빙자료 그리드 (Q10) — Est03_TabPage_PfHistory의 "증빙자료" 칸
 * AS-IS: myApp/client/vi/est/Est04_Grid_PfFile.java (358줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L76-172: 위 툴바 50([행 추가][행 삭제], 숨은 업로드·다운로드·삭제 폼) + 셀 편집 그리드(행번호 · 증빙파일형식 120(편집) · 2단 헤더 "증빙파일"[파일명 150 · 등록 50 · 받기 50 · 삭제 50] · 증빙 확인 경로 250(편집))
 * 신청(10)·승인(20)된 수행내역이면 [행 추가]·[행 삭제]·등록·삭제 아이콘이 막힌다(각 메시지는 원본 그대로).
 * [E3] retrieveButton[조회]은 툴바에 붙지 않아 도달 불가(색인 표시) — 만들지 않는다.
 * 저장은 부모(Est03_TabPage_PfHistory)의 [저장]·[승인신청]·[신청취소]가 updateChk()로 이 그리드의 행을 가져가 한 번에 보낸다(수행내역과 한 트랜잭션).
 */
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { message, Modal } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { estApi } from '@/api/est';
import { fileApi, FILE_DELETE_STATUS } from '@/api/file';
import { errorMessage } from '@/api/client';
import { PfFile } from '@/types/est';
import { FileInfo } from '@/types/sys';
import { Button } from '@/components/button';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { FileUpdownForm, FileUpdownFormHandle } from '@/components/form/FileUpdownForm';
import { Sys10_Lookup_FileViewer } from '@/pages/sys/Sys10_Lookup_FileViewer';

const gb = gbFor<PfFile>();

export interface PfFileSaveSet {
  /** updateChk() L270-301이 막은 이유 (없으면 저장해도 된다) */
  error?: string;
  files: { pfFileId: number; fileDesc: string | null; checkRoute: string | null }[];
  deleteFileIds: number[];
}

export interface Est04_Grid_PfFileHandle {
  /** updateChk(callback) L270-314 — 증빙파일형식 필수 검사 → 저장할 행과 지운 행 */
  updateChk: () => PfFileSaveSet;
}

interface Props {
  /** retrieve(pfHistoryModel) L242-255 — 선택한 수행내역 (null이면 비움) */
  pfHistoryId: number | null;
  /** 신청(10)·승인(20)이면 수정 불가 */
  statusCode: string | null;
  /** 같은 수행내역을 다시 눌러도 다시 읽도록 부모가 올린다 */
  nonce: number;
}

export const Est04_Grid_PfFile = forwardRef<Est04_Grid_PfFileHandle, Props>(({ pfHistoryId, statusCode, nonce }, ref) => {
  const gridRef = useRef<AgGridReact<PfFile>>(null);
  const fileUpload = useRef<FileUpdownFormHandle>(null);
  const uploadTarget = useRef<PfFile | null>(null);
  const [rows, setRows] = useState<PfFile[]>([]);
  /** deleteList — [행 삭제]로 뺀 행 (저장 때 지운다) */
  const deleteList = useRef<number[]>([]);
  const [viewFile, setViewFile] = useState<FileInfo | null>(null);

  const locked = statusCode === '10' || statusCode === '20';

  // retrieve() L242-268: est.Est04_PfFile.selectByPfHistoryId(pfHistoryId)
  const retrieve = useCallback(async () => {
    deleteList.current = [];
    if (pfHistoryId == null) { setRows([]); return; }
    try {
      setRows(await estApi.searchPfFiles(pfHistoryId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [pfHistoryId]);

  // [E0] 화면 열림 (생성자 L76-172)
  useEffect(() => { void retrieve(); }, [retrieve, nonce]);

  const patchRow = (pfFileId: number, patch: Partial<PfFile>) =>
    setRows(prev => prev.map(r => (r.pfFileId === pfFileId ? { ...r, ...patch } : r)));

  // [E4] insertButton[행 추가].Select (L130) → 신청·승인이면 "신청 및 승인된 건은 수정이 불가능합니다", 아니면 insertRow() L316-322 (GridInsertRow: 서버 getSeq로 ID)
  const insertRow = async () => {
    if (locked) { message.warning('신청 및 승인된 건은 수정이 불가능합니다'); return; }
    if (pfHistoryId == null) return;
    try {
      const id = await estApi.nextPfHistoryId();
      const row: PfFile = { pfFileId: id, pfHistoryId, fileDesc: null, checkRoute: null, fileId: null, fileName: null };
      setRows(prev => [...prev, row]);
      setTimeout(() => {
        const api = gridRef.current?.api;
        const node = api?.getRowNode(String(id));
        if (api && node?.rowIndex != null) api.ensureIndexVisible(node.rowIndex);
      }, 0);
    } catch (err) {
      message.error(errorMessage(err, '행 추가 실패'));
    }
  };

  // [E5] deleteButton[행 삭제].Select (L141) → 신청·승인이면 막고, 아니면 deleteRow() L351-357: 고른 행을 deleteList에 담고 그리드에서 뺀다
  const deleteRow = () => {
    if (locked) { message.warning('신청 및 승인된 건은 수정이 불가능합니다'); return; }
    const selected = gridRef.current?.api?.getSelectedRows() ?? [];
    if (selected.length === 0) return;
    deleteList.current.push(...selected.map(r => r.pfFileId));
    const ids = new Set(selected.map(r => r.pfFileId));
    setRows(prev => prev.filter(r => !ids.has(r.pfFileId)));
  };

  // fileDelete() L324-349: sys.Sys11_RelateFile.checkFileDelete(fileId, parentId=pfFileId) → 1 retrieve(), 2 메시지, 3 FileDelete → [E1] SubmitComplete → retrieve()
  const fileDelete = async (row: PfFile) => {
    try {
      if (row.fileId == null) { await retrieve(); return; }
      const result = await fileApi.checkFileDeleteResult(row.fileId, row.pfFileId);
      if (result.status === FILE_DELETE_STATUS.IN_USE) { message.warning(result.message ?? '삭제할 수 없는 파일입니다'); return; }
      if (result.status === FILE_DELETE_STATUS.DELETABLE) await fileApi.deleteFile(row.fileId);
      await retrieve();
    } catch (err) {
      message.error(errorMessage(err, '삭제 실패'));
    }
  };

  // fileDeleteButton L203-230: 신청·승인이면 "신청 및 승인된 건은 삭제가 불가능합니다", 아니면 확인(제목 확인, 300폭) → fileDelete()
  // [E7] msgBox.DialogHide [YES] (L212) → fileDelete()
  const askFileDelete = (row: PfFile) => {
    if (locked) { message.warning('신청 및 승인된 건은 삭제가 불가능합니다'); return; }
    Modal.confirm({
      title: '확인',
      content: '해당 증빙자료를 삭제하시겠습니까?',
      width: 300,
      okText: '예',
      cancelText: '아니오',
      onOk: () => fileDelete(row),
    });
  };

  // fileUpButton L176-192: 신청·승인이면 "신청 및 승인된 건은 등록이 불가능합니다", 이미 파일이 있으면 "이미 등록되어있는 파일이 존재합니다.", 아니면 파일 고르기
  const pickFile = (row: PfFile) => {
    if (locked) { message.warning('신청 및 승인된 건은 등록이 불가능합니다'); return; }
    if (row.fileName != null) { message.warning('이미 등록되어있는 파일이 존재합니다.'); return; }
    uploadTarget.current = row;
    fileUpload.current?.click();
  };

  // [E2] fileUpdownForm.Change (L96) → FileUpload?fileType=file&parentId=pfFileId → sys.Sys10_File.selectByParentId → 파일명 칸만 바꾼다(addChange)
  // 원본은 fileId를 채우지 않아 다시 읽기 전에는 받기·보기가 안 된다 — 올린 파일의 fileId도 함께 넣는다(작업기록)
  const onFileChange = async (file: File | null | undefined) => {
    const target = uploadTarget.current;
    if (!file || !target) return;
    try {
      const uploaded = await fileApi.upload(target.pfFileId, file);
      patchRow(target.pfFileId, { fileName: uploaded.fileNm, fileId: uploaded.fileId });
    } catch (err) {
      message.error(errorMessage(err, '파일 올리기 실패'));
    }
  };

  // [E6] grid.CellClick [cellIndex == 2] (L152) → 파일이 있으면 Sys10_Lookup_FileViewer.open(fileId)
  const openViewer = async (row: PfFile) => {
    if (row.fileId == null) return;
    try {
      const list = await fileApi.searchByParentId(row.pfFileId);
      setViewFile(list.find(f => f.fileId === row.fileId) ?? null);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  useImperativeHandle(ref, () => ({
    updateChk: () => {
      if (rows.some(r => !r.fileDesc || r.fileDesc.trim() === '')) {
        return { error: '증빙파일형식은 필수 입력항목입니다.', files: [], deleteFileIds: [] };
      }
      return {
        files: rows.map(r => ({ pfFileId: r.pfFileId, fileDesc: r.fileDesc, checkRoute: r.checkRoute === '' ? null : r.checkRoute })),
        deleteFileIds: [...deleteList.current],
      };
    },
  }), [rows]);

  // buildGrid() L174-240
  const columnDefs = useMemo(() => [
    gb.text('fileDesc', 120, '증빙파일형식', { editor: 'text' }),  // L232
    gb.group('증빙파일', [                                           // L231 HeaderGroupMap(0, 2, "증빙파일", 1, 4)
      gb.text('fileName', 150, '파일명'),                            // L233 (클릭하면 보기)
      iconCell<PfFile>('upload', 'uploadCell', 50, '등록', pickFile),      // L234
      iconCell<PfFile>('down', 'downloadCell', 50, '받기', row => {        // L235 → FileDownload?fileType=file&fileId=
        if (row.fileId == null) return;
        fileApi.download(row.fileId).catch(err => message.error(errorMessage(err, '다운로드 실패')));
      }),
      iconCell<PfFile>('delete', 'deleteCell', 50, '삭제', askFileDelete), // L236
    ]),
    gb.text('checkRoute', 250, '증빙 확인 경로<br>(증빙첨부 불가시)', { editor: 'text' }),  // L237
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [locked, retrieve]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', gap: 4 }}>
        <Button type="addRow" onClick={insertRow}>행 추가</Button>
        <Button type="removeRow" onClick={deleteRow}>행 삭제</Button>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <SingleGrid<PfFile>
          gridRef={gridRef}
          rowData={rows}
          columnDefs={columnDefs}
          getRowId={p => String(p.data.pfFileId)}
          onCellValueChanged={e => { if (e.data) patchRow(e.data.pfFileId, { [e.colDef.field as keyof PfFile]: e.newValue } as Partial<PfFile>); }}
          onCellClicked={e => { if (e.colDef.field === 'fileName' && e.data) void openViewer(e.data); }}
        />
      </div>
      <FileUpdownForm ref={fileUpload} onChange={file => { void onFileChange(file); }} />
      <Sys10_Lookup_FileViewer file={viewFile} onClose={() => setViewFile(null)} />
    </div>
  );
});
Est04_Grid_PfFile.displayName = 'Est04_Grid_PfFile';
