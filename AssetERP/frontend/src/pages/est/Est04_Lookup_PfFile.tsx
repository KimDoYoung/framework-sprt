/**
 * 증빙자료 조회창 (Q12) — Est03_TabPage_PfHistoryList의 증빙자료 아이콘이 여는 읽기 전용 창
 * AS-IS: myApp/client/vi/est/Est04_Lookup_PfFile.java (138줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L51-99: 모달 900×500 "증빙자료" = 툴바 50([새로고침]) + 그리드(증빙파일형식 150 · 파일명 350 · 받기 50 · 증빙 확인 경로 250) + [닫기]
 * 파일명 칸을 누르면 Sys10_Lookup_FileViewer
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { message } from 'antd';
import { estApi } from '@/api/est';
import { fileApi } from '@/api/file';
import { errorMessage } from '@/api/client';
import { PfFile } from '@/types/est';
import { FileInfo } from '@/types/sys';
import { Button } from '@/components/button';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Sys10_Lookup_FileViewer } from '@/pages/sys/Sys10_Lookup_FileViewer';

const gb = gbFor<PfFile>();

interface Props {
  /** open(pfHistoryId) L46-49 — 값이 있으면 열린다 */
  pfHistoryId: number | null;
  onClose: () => void;
}

export const Est04_Lookup_PfFile: React.FC<Props> = ({ pfHistoryId, onClose }) => {
  const [rows, setRows] = useState<PfFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewFile, setViewFile] = useState<FileInfo | null>(null);

  // retrieve() L121-133: est.Est04_PfFile.selectByPfHistoryId(pfHistoryId)
  const retrieve = useCallback(async () => {
    if (pfHistoryId == null) return;
    setLoading(true);
    try {
      setRows(await estApi.searchPfFiles(pfHistoryId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [pfHistoryId]);

  // [E0] 화면 열림 (생성자 L51-99 → show()) / open() → retrieve()
  useEffect(() => {
    setRows([]);
    void retrieve();
  }, [retrieve]);

  // [E3] grid.CellClick [cellIndex == 2] (L78) → 파일이 있으면 Sys10_Lookup_FileViewer.open(fileId)
  const openViewer = async (row: PfFile) => {
    if (row.fileId == null) return;
    try {
      const list = await fileApi.searchByParentId(row.pfFileId);
      setViewFile(list.find(f => f.fileId === row.fileId) ?? null);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // buildGrid() L101-119
  const columnDefs = useMemo(() => [
    gb.text('fileDesc', 150, '증빙파일형식'),
    gb.text('fileName', 350, '파일명'),
    iconCell<PfFile>('down', 'downloadCell', 50, '받기', row => {  // → FileDownload?fileType=file&fileId=
      if (row.fileId == null) return;
      fileApi.download(row.fileId).catch(err => message.error(errorMessage(err, '다운로드 실패')));
    }),
    gb.text('checkRoute', 250, '증빙 확인 경로<br>(증빙첨부 불가시)'),
  ], []);

  return (
    <LookupModal
      open={pfHistoryId != null}
      title="증빙자료"
      width={900}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          {/* [E2] closeButton[닫기].Select (L72) → hide() */}
          <Button type="close" onClick={onClose}>닫기</Button>
        </div>
      }
    >
      <div style={{ height: 400, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div>
          {/* [E1] retrieveButton[새로고침].Select (L66) → retrieve() */}
          <Button type="reset" onClick={retrieve} loading={loading}>새로고침</Button>
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<PfFile>
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.pfFileId)}
            onCellClicked={e => { if (e.colDef.field === 'fileName' && e.data) void openViewer(e.data); }}
          />
        </div>
      </div>
      <Sys10_Lookup_FileViewer file={viewFile} onClose={() => setViewFile(null)} />
    </LookupModal>
  );
};
