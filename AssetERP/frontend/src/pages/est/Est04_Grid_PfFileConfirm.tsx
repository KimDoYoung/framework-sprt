/**
 * 수행내역 증빙자료 보기 (Q11) — Est03_TabPage_PfHistoryConfirm의 "증빙자료" 칸 (읽기 전용)
 * AS-IS: myApp/client/vi/est/Est04_Grid_PfFileConfirm.java (159줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 그리드(행번호 · 증빙파일형식 120 · 증빙파일(파일명) 250 · 받기 50 · 증빙 확인 경로 250), 툴바 없음. 파일명 칸을 누르면 Sys10_Lookup_FileViewer
 * [E1] fileDeleteForm.SubmitComplete·[E2] fileUpdownForm.Change는 보이는 단추에 연결되지 않은 숨은 폼의 핸들러(올리기·삭제가 없는 화면)라 만들지 않는다.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { message } from 'antd';
import { estApi } from '@/api/est';
import { fileApi } from '@/api/file';
import { errorMessage } from '@/api/client';
import { PfFile } from '@/types/est';
import { FileInfo } from '@/types/sys';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { Sys10_Lookup_FileViewer } from '@/pages/sys/Sys10_Lookup_FileViewer';

const gb = gbFor<PfFile>();

interface Props {
  /** retrieve(pfHistoryModel) L139 — 선택한 수행내역 (null이면 비움, init) */
  pfHistoryId: number | null;
  /** 같은 행을 다시 눌러도 다시 읽도록 부모가 올린다 */
  nonce: number;
}

export const Est04_Grid_PfFileConfirm: React.FC<Props> = ({ pfHistoryId, nonce }) => {
  const [rows, setRows] = useState<PfFile[]>([]);
  const [viewFile, setViewFile] = useState<FileInfo | null>(null);

  // [E0] 화면 열림 (생성자 L47-110) / retrieve() L139·L152: est.Est04_PfFile.selectByPfHistoryId(pfHistoryId)
  const retrieve = useCallback(async () => {
    if (pfHistoryId == null) { setRows([]); return; }
    try {
      setRows(await estApi.searchPfFiles(pfHistoryId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [pfHistoryId]);

  useEffect(() => { void retrieve(); }, [retrieve, nonce]);

  // [E3] grid.CellClick [cellIndex == 2] (L87) → 파일이 있으면 Sys10_Lookup_FileViewer.open(fileId)
  const openViewer = async (row: PfFile) => {
    if (row.fileId == null) return;
    try {
      const list = await fileApi.searchByParentId(row.pfFileId);
      setViewFile(list.find(f => f.fileId === row.fileId) ?? null);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // buildGrid() L62-107
  const columnDefs = useMemo(() => [
    gb.text('fileDesc', 120, '증빙파일형식'),
    gb.text('fileName', 250, '증빙파일(파일명)'),
    iconCell<PfFile>('down', 'downloadCell', 50, '받기', row => {  // → FileDownload?fileType=file&fileId=
      if (row.fileId == null) return;
      fileApi.download(row.fileId).catch(err => message.error(errorMessage(err, '다운로드 실패')));
    }),
    gb.text('checkRoute', 250, '증빙 확인 경로<br>(증빙첨부 불가시)'),
  ], []);

  return (
    <>
      <SingleGrid<PfFile>
        rowData={rows}
        columnDefs={columnDefs}
        getRowId={p => String(p.data.pfFileId)}
        onCellClicked={e => { if (e.colDef.field === 'fileName' && e.data) void openViewer(e.data); }}
      />
      <Sys10_Lookup_FileViewer file={viewFile} onClose={() => setViewFile(null)} />
    </>
  );
};
