/**
 * 급여/카드 전표 분개 그리드 (U10) — Act02_Tab_CreateJournalBiz 아래에서 고른 행의 분개(차변/대변)를 보여 준다
 * AS-IS: myApp/client/vi/act/Act02_Grid_CreateJournalBiz.java (452줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L42-61: BorderLayout 가운데 = 그리드(행번호, 체크 다중, 차변 4열 · 대변 4열, [변경] 아이콘, 맨 아래 합계 행 "계"), buildGrid() L87-233
 * retrieve(jnlModel, stdDate) L262 → retrieve() L294-350: 거래 코드로 서비스를 가른다 — 9001 selectBizCard / 1001·1002 selectChargeFee / 1004 selectErpChargeFee / 그 밖 selectByJournalId → 첫 행 선택
 * [변경] 아이콘 = Act02_Lookup_ModiJournal(W05 2단계) — 저장하면 retrieve()
 */
import React, { useEffect, useRef, useState } from 'react';
import { message } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { actApi } from '@/api/act';
import { errorMessage } from '@/api/client';
import { JournalBizLine, JournalBizRow } from '@/types/act';
import { MultiGrid, gbFor, iconCell } from '@/components/grid';
import { Act02_Lookup_ModiJournal } from './Act02_Lookup_ModiJournal';

const gb = gbFor<JournalBizLine>();
const DR = { color: '#456EA6', fontWeight: 'bold' };
const CR = { color: '#DD5E5E', fontWeight: 'bold' };

/** buildGrid() L207-208 헤더 묶음(차변 456EA6 · 대변 DD5E5E), 합계 행 L228-230 */
const SUM_ROW = { labelField: 'date', label: '계', sum: ['drAmt', 'crAmt'] };

interface Props {
  /** retrieve(jnlModel, stdDate) — 없으면 목록을 비운다(gridClear) */
  target: JournalBizRow | null;
  /** getYYYYMM() — "yyyy.MM" */
  stdMonth: string;
  /** 같은 행을 다시 읽으려면 값을 바꾼다 (AS-IS는 retrieve()를 다시 불렀다) */
  nonce?: number;
}

export const Act02_Grid_CreateJournalBiz: React.FC<Props> = ({ target, stdMonth, nonce }) => {
  const gridRef = useRef<AgGridReact<JournalBizLine>>(null);
  const [rows, setRows] = useState<JournalBizLine[]>([]);
  const [modiJournalId, setModiJournalId] = useState<number | null>(null);
  /** [변경] 창에서 저장한 뒤 같은 행을 다시 읽는다 */
  const [reload, setReload] = useState(0);

  // [E0] 화면 열림 (생성자 L42-61) → settings() — retrieve() L294-350
  useEffect(() => {
    if (target == null) { setRows([]); return; }
    let cancelled = false;
    void (async () => {
      try {
        const list = await actApi.searchJournalBizLines(stdMonth, target);
        if (cancelled) return;
        setRows(list);
        if (list[0]) setTimeout(() => gridRef.current?.api?.getRowNode(String(list[0].journalDtlId))?.setSelected(true), 0);
      } catch (err) {
        if (!cancelled) message.error(errorMessage(err, '조회 실패'));
      }
    })();
    return () => { cancelled = true; };
  }, [target, stdMonth, nonce, reload]);

  const columnDefs = [
    gb.date('date', 100, '전표일자'),  // L211
    gb.textCenter('journalNoStr', 85, '전표번호'),  // L212
    gb.textArea('note', 200, '적요'),  // L213
    {
      ...gb.group('차변', [
        gb.textCenter('drAccountCode', 100, '계정코드', { headerStyle: DR }),  // L214
        gb.textArea('drAstAccountName', 300, '계정과목', { headerStyle: DR }),  // L215
        gb.long('drAmt', 100, '금액', { headerStyle: DR }),  // L216
        gb.textArea('drNote', 100, '적요', { headerStyle: DR }),  // L218
      ]),
      headerStyle: DR,
    },
    {
      ...gb.group('대변', [
        gb.textCenter('crAccountCode', 100, '계정코드', { headerStyle: CR }),  // L219
        gb.textArea('crAstAccountName', 300, '계정과목', { headerStyle: CR }),  // L220
        gb.long('crAmt', 100, '금액', { headerStyle: CR }),  // L221
        gb.textArea('crNote', 100, '적요', { headerStyle: CR }),  // L223
      ]),
      headerStyle: CR,
    },
    // L191-205 editCell: Act02_Lookup_ModiJournal.open(selectModel) → 저장하면 retrieve()
    iconCell<JournalBizLine>('edit', 'actionCell', 60, '변경', row => setModiJournalId(row.journalId)),  // L224
  ];

  return (
    <>
      <MultiGrid<JournalBizLine> gridRef={gridRef} rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.journalDtlId)} sumRow={SUM_ROW} />
      <Act02_Lookup_ModiJournal journalId={modiJournalId} onSaved={() => setReload(n => n + 1)} onClose={() => setModiJournalId(null)} />
    </>
  );
};
