/**
 * 전표 분개 그리드 (U09) — Pay50_Tab_ExpenseJournal 아래에서 고른 전표의 분개(차변/대변)를 보여 준다
 * AS-IS: myApp/client/vi/act/Act02_Grid_CreateJournal.java (92줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L25-38: BorderLayout 가운데 = 그리드(행번호, 단일 선택, 차변 4열 · 대변 4열, 맨 아래 합계 행 "계"), buildGrid() L40-62
 * retrieve(journalId) L64-86: act.Act03_JournalDtl.selectByJournalId → 첫 행 선택 / init() L69-71: 목록 비움
 */
import React, { useEffect, useRef, useState } from 'react';
import { message } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { actApi } from '@/api/act';
import { errorMessage } from '@/api/client';
import { JournalLine } from '@/types/act';
import { SingleGrid, gbFor } from '@/components/grid';

const gb = gbFor<JournalLine>();
const DR = { color: '#456EA6', fontWeight: 'bold' };
const CR = { color: '#DD5E5E', fontWeight: 'bold' };

/** buildGrid() L40-62: 차변/대변 묶음 헤더(456EA6 · DD5E5E), 합계 행 */
const columnDefs = [
  {
    ...gb.group('차변', [
      gb.textCenter('drAccountCode', 120, '계정코드', { headerStyle: DR }),  // L48
      gb.textArea('drAstAccountName', 350, '계정과목', { headerStyle: DR }),  // L49
      gb.long('drAmt', 120, '금액', { headerStyle: DR }),  // L50
      gb.textArea('drNote', 180, '적요', { headerStyle: DR }),  // L51
    ]),
    headerStyle: DR,
  },
  {
    ...gb.group('대변', [
      gb.textCenter('crAccountCode', 120, '계정코드', { headerStyle: CR }),  // L52
      gb.textArea('crAstAccountName', 350, '계정과목', { headerStyle: CR }),  // L53
      gb.long('crAmt', 120, '금액', { headerStyle: CR }),  // L54
      gb.textArea('crNote', 180, '적요', { headerStyle: CR }),  // L55
    ]),
    headerStyle: CR,
  },
];

const SUM_ROW = { labelField: 'drAstAccountName', label: '계', sum: ['drAmt', 'crAmt'] };

interface Props {
  /** retrieve(journalId) — 없으면 init()으로 목록을 비운다 */
  journalId: number | null;
  /** 같은 전표를 다시 읽으려면 값을 바꾼다 (AS-IS는 retrieve()를 다시 불렀다) */
  nonce?: number;
}

export const Act02_Grid_CreateJournal: React.FC<Props> = ({ journalId, nonce }) => {
  const gridRef = useRef<AgGridReact<JournalLine>>(null);
  const [rows, setRows] = useState<JournalLine[]>([]);

  // [E0] 화면 열림 (생성자 L25-38) → settings() — retrieve() L73-86: act.Act03_JournalDtl.selectByJournalId → 첫 행 선택
  useEffect(() => {
    if (journalId == null) { setRows([]); return; }
    let cancelled = false;
    void (async () => {
      try {
        const list = await actApi.searchJournalLines(journalId);
        if (cancelled) return;
        setRows(list);
        if (list[0]) setTimeout(() => gridRef.current?.api?.getRowNode(String(list[0].journalDtlId))?.setSelected(true), 0);
      } catch (err) {
        if (!cancelled) message.error(errorMessage(err, '조회 실패'));
      }
    })();
    return () => { cancelled = true; };
  }, [journalId, nonce]);

  return (
    <SingleGrid<JournalLine> gridRef={gridRef} rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.journalDtlId)} sumRow={SUM_ROW} />
  );
};
