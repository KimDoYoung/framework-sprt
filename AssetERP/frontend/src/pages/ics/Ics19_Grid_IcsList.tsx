/**
 * 개정내역 연결법규 목록 (E03) — Ics20_Edit_RevisionHistoryAdmin의 "연결법규" 칸
 * AS-IS: myApp/client/vi/ics/ics19_Grid_IcsList.java (클래스 이름 첫 글자가 소문자) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 그리드 buildApprFileGrid() L40-52: 체크박스 다중 선택, 법규명 310 · 상세보기 60. 새 행(GridInsertRow)은 저장 전까지 임시 음수 ID로 목록에만 있다
 * 부르는 쪽이 ref로 읽기·행 추가·체크한 행·새 행·삭제를 한다
 */
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { message } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { icsApi } from '@/api/ics';
import { errorMessage } from '@/api/client';
import { IcsRevisionLaw } from '@/types/ics';
import { MultiGrid, gbFor, iconCell } from '@/components/grid';

const gb = gbFor<IcsRevisionLaw>();

export interface Ics19_Grid_IcsListHandle {
  retrieve: () => Promise<void>;
  /** GridInsertRow.insertRow: 고른 법규를 새 행으로 (저장 전) */
  addRows: (laws: { classTreeId: number; classTreeName?: string | null }[]) => void;
  /** grid.getSelectionModel().getSelectedItems() */
  getChecked: () => IcsRevisionLaw[];
  /** 저장 전 새 행 (임시 음수 ID) */
  getNewRows: () => IcsRevisionLaw[];
  /** 목록에서 행을 뺀다 (지운 행) */
  removeRows: (ids: number[]) => void;
  /** 저장한 새 행을 서버가 준 행으로 바꾼다 */
  replaceNewRows: (saved: IcsRevisionLaw[]) => void;
}

interface Props {
  /** AS-IS retrieve(revisionHistoryModel) — 개정내역 ID. 없거나 저장 전(0 이하)이면 비운다 */
  revisionHistoryId?: number | null;
  /** 상세보기 아이콘 → Ics01_Lookup_ClassTreeDetail.open(classTreeId) (부르는 쪽이 연다) */
  onDetail: (row: IcsRevisionLaw) => void;
}

export const Ics19_Grid_IcsList = forwardRef<Ics19_Grid_IcsListHandle, Props>(({ revisionHistoryId, onDetail }, ref) => {
  const [rows, setRows] = useState<IcsRevisionLaw[]>([]);
  const gridRef = useRef<AgGridReact<IcsRevisionLaw>>(null);
  const tempSeq = useRef(0);

  // retrieve() L54-66: 서비스 ics.Ics19_RevisionRelateIcs.selectByRevisionHistoryId(revisionHistoryId)
  const retrieve = useCallback(async () => {
    if (revisionHistoryId == null || revisionHistoryId <= 0) {
      setRows([]);
      return;
    }
    try {
      setRows(await icsApi.searchRevisionLaws(revisionHistoryId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [revisionHistoryId]);

  useEffect(() => { void retrieve(); }, [retrieve]);

  useImperativeHandle(ref, () => ({
    retrieve,
    addRows: laws => setRows(prev => [
      ...prev,
      ...laws.map(l => ({ revisionRelateIcsId: --tempSeq.current, revisionHistoryId, classTreeId: l.classTreeId, classTreeName: l.classTreeName })),
    ]),
    getChecked: () => gridRef.current?.api?.getSelectedRows() ?? [],
    getNewRows: () => rows.filter(r => r.revisionRelateIcsId <= 0),
    removeRows: ids => setRows(prev => prev.filter(r => !ids.includes(r.revisionRelateIcsId))),
    replaceNewRows: saved => setRows(prev => [...prev.filter(r => r.revisionRelateIcsId > 0), ...saved]),
  }), [retrieve, revisionHistoryId, rows]);

  const columnDefs = useMemo(() => [
    gb.text('classTreeName', 310, '법규명'),  // L48
    iconCell<IcsRevisionLaw>('view', 'actionCell', 60, '상세보기', onDetail),  // L49 actionCell(View) → Ics01_Lookup_ClassTreeDetail.open(classTreeId)
  ], [onDetail]);

  return (
    <MultiGrid<IcsRevisionLaw>
      gridRef={gridRef}
      rowData={rows}
      columnDefs={columnDefs}
      getRowId={p => String(p.data.revisionRelateIcsId)}
    />
  );
});
Ics19_Grid_IcsList.displayName = 'Ics19_Grid_IcsList';
