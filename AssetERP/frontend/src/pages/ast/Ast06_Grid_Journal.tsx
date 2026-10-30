/**
 * 분개 그리드 (U04) — Ast06_Tab_TrTax 아래에서 고른 거래의 분개를 보여 준다
 * AS-IS: myApp/client/vi/ast/Ast06_Grid_Journal.java (143줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L41-58: BorderLayout 가운데 = 툴바 50([변경]) + 그리드(행번호, 체크 다중, 차변 4열 · 대변 4열, 맨 아래 합계 행 "계"), buildGrid() L75-99
 * [다음 단계] [변경]이 여는 분개 수정 창 Act02_Lookup_ModiJournal(이벤트 13)은 다른 도메인이라 지금은 안내만 한다
 */
import { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { message } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { actApi } from '@/api/act';
import { errorMessage } from '@/api/client';
import { JournalLine } from '@/types/act';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';

const gb = gbFor<JournalLine>();
const DR = { color: '#456EA6', fontWeight: 'bold' };
const CR = { color: '#DD5E5E', fontWeight: 'bold' };

/** buildGrid() L75-99: setChecked(MULTI), 차변/대변 묶음 헤더(456EA6 · DD5E5E), 합계 행 */
const columnDefs = [
  gb.textArea('trName', 120, '거래유형'),  // L84
  {
    ...gb.group('차변', [
      gb.textCenter('drAccountCode', 100, '계정코드', { headerStyle: DR }),  // L85
      gb.textArea('drAstAccountName', 300, '계정과목', { headerStyle: DR }),  // L86
      gb.long('drAmt', 100, '금액', { headerStyle: DR }),  // L87
      gb.textArea('drNote', 200, '적요', { headerStyle: DR }),  // L88
    ]),
    headerStyle: DR,
  },
  {
    ...gb.group('대변', [
      gb.textCenter('crAccountCode', 100, '계정코드', { headerStyle: CR }),  // L89
      gb.textArea('crAstAccountName', 300, '계정과목', { headerStyle: CR }),  // L90
      gb.long('crAmt', 100, '금액', { headerStyle: CR }),  // L91
      gb.textArea('crNote', 200, '적요', { headerStyle: CR }),  // L92
    ]),
    headerStyle: CR,
  },
];

export interface Ast06_Grid_JournalHandle {
  /** retrieve(journalId, journalDate) L101-105 — journalId가 없으면 빈 목록 */
  retrieve: (journalId: number | null | undefined) => Promise<void>;
  /** gridClear() L107-109 */
  clear: () => void;
}

// [E0] 화면 열림 (생성자 L41-58) → settings()
export const Ast06_Grid_Journal = forwardRef<Ast06_Grid_JournalHandle>((_props, ref) => {
  const gridRef = useRef<AgGridReact<JournalLine>>(null);
  const [rows, setRows] = useState<JournalLine[]>([]);

  // retrieve() L112-125: act.Act03_JournalDtl.selectByJournalId → 첫 행 선택
  const retrieve = async (journalId: number | null | undefined) => {
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

  const sumRow = useMemo(() => ({ labelField: 'trName', label: '계', sum: ['drAmt', 'crAmt'] }), []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {/* [E1] modiButton[변경].Select (L61) → Act02_Lookup_ModiJournal.open(grid.getStore().get(0), …) — 닫으면 retrieve() */}
        <Button type="change" onClick={() => message.info('분개 수정 창(Act02_Lookup_ModiJournal)은 다음 단계에서 연결합니다.')}>변경</Button>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <MultiGrid<JournalLine> gridRef={gridRef} rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.journalDtlId)} sumRow={sumRow} />
      </div>
    </div>
  );
});
Ast06_Grid_Journal.displayName = 'Ast06_Grid_Journal';
