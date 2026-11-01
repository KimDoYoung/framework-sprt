/**
 * 분개 그리드(외화) (X08) — Ast06_Tab_TrForIntrinsic 아래에서 고른 거래·결제의 분개를 보여 준다
 * AS-IS: myApp/client/vi/ast/Ast06_Grid_ForJournal.java (145줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L41-58: BorderLayout 가운데 = 툴바 50([변경]) + 그리드(행번호, 체크 다중, 거래유형 · 차변 5열 · 대변 5열 — 외화금액이 더해진 Ast06_Grid_Journal, 맨 아래 합계 행 "계"), buildGrid() L75-101
 * [변경] = 외화 분개 수정 창 Act02_Lookup_ModiForJournal(X08) — 저장하면 retrieve()
 */
import { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { message } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { actApi } from '@/api/act';
import { errorMessage } from '@/api/client';
import { JournalLine } from '@/types/act';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';
import { Act02_Lookup_ModiForJournal } from '../act/Act02_Lookup_ModiForJournal';

const gb = gbFor<JournalLine>();
const DR = { color: '#456EA6', fontWeight: 'bold' };
const CR = { color: '#DD5E5E', fontWeight: 'bold' };

/** buildGrid() L75-101: setChecked(MULTI), 차변/대변 묶음 헤더(456EA6 · DD5E5E), 합계 행 */
const columnDefs = [
  gb.text('trName', 120, '거래유형'),  // L82
  {
    ...gb.group('차변', [
      gb.textCenter('drAccountCode', 100, '계정코드', { headerStyle: DR }),  // L83
      gb.textArea('drAstAccountName', 350, '계정과목', { headerStyle: DR }),  // L84
      gb.double('drForAmt', 100, '외화금액', { headerStyle: DR }),  // L85
      gb.long('drAmt', 100, '원화금액', { headerStyle: DR }),  // L86
      gb.textArea('drNote', 100, '적요', { headerStyle: DR }),  // L87
    ]),
    headerStyle: DR,
  },
  {
    ...gb.group('대변', [
      gb.textCenter('crAccountCode', 100, '계정코드', { headerStyle: CR }),  // L88
      gb.textArea('crAstAccountName', 350, '계정과목', { headerStyle: CR }),  // L89
      gb.double('crForAmt', 100, '외화금액', { headerStyle: CR }),  // L90
      gb.long('crAmt', 100, '원화금액', { headerStyle: CR }),  // L91
      gb.textArea('crNote', 100, '적요', { headerStyle: CR }),  // L92
    ]),
    headerStyle: CR,
  },
];

export interface Ast06_Grid_ForJournalHandle {
  /** retrieve(journalId, journalDate) L103-107 — journalId가 없으면 빈 목록 */
  retrieve: (journalId: number | null | undefined) => Promise<void>;
  /** gridClear() L107-109 */
  clear: () => void;
}

// [E0] 화면 열림 (생성자 L41-58) → settings()
export const Ast06_Grid_ForJournal = forwardRef<Ast06_Grid_ForJournalHandle>((_props, ref) => {
  const gridRef = useRef<AgGridReact<JournalLine>>(null);
  const [rows, setRows] = useState<JournalLine[]>([]);
  /** 지금 보이는 분개의 전표 ID — [변경]이 연다 */
  const [journalId, setJournalId] = useState<number | null>(null);
  const [modiOpen, setModiOpen] = useState(false);

  // retrieve() L114-128: act.Act03_JournalDtl.selectByJournalId → 첫 행 선택
  const retrieve = async (journalId: number | null | undefined) => {
    setJournalId(journalId ?? null);
    if (journalId == null) { setRows([]); return; }
    try {
      const list = await actApi.searchJournalLines(journalId);
      setRows(list);
      if (list[0]) setTimeout(() => gridRef.current?.api?.getRowNode(String(list[0].journalDtlId))?.setSelected(true), 0);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  useImperativeHandle(ref, () => ({ retrieve, clear: () => setRows([]) }));

  const sumRow = useMemo(() => ({ labelField: 'trName', label: '계', sum: ['drForAmt', 'drAmt', 'crForAmt', 'crAmt'] }), []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {/* [E1] modiButton[변경].Select (L61) → Act02_Lookup_ModiForJournal.open(grid.getStore().get(0), …) — 닫으면 retrieve() */}
        <Button type="change" onClick={() => { if (journalId != null) setModiOpen(true); }}>변경</Button>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <MultiGrid<JournalLine> gridRef={gridRef} rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.journalDtlId)} sumRow={sumRow} />
      </div>
      <Act02_Lookup_ModiForJournal journalId={modiOpen ? journalId : null} onSaved={() => void retrieve(journalId)} onClose={() => setModiOpen(false)} />
    </div>
  );
});
Ast06_Grid_ForJournal.displayName = 'Ast06_Grid_ForJournal';
