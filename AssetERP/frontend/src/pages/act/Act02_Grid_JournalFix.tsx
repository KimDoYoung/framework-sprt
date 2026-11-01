/**
 * 전표 분개 그리드 (X02) — Act02_Tab_JournalFix 아래에서 고른 전표의 분개(차변/대변)를 보여 주고 [변경]으로 고친다
 * AS-IS: myApp/client/vi/act/Act02_Grid_JournalFix.java (174줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L41-58: BorderLayout 가운데 = 툴바 50([변경]) + 그리드(행번호, 체크 다중, 거래유형 150 · 차변 4열 · 대변 4열, 맨 아래 합계 행 "계"), buildGrid() L89-115
 * retrieve(journalModel) L133-136 / retrieve() L143-156: act.Act03_JournalDtl.selectByJournalId → 첫 행 선택, gridClear() L138-140: 목록 비움
 * [변경] L61-86: 원화(KRW) 전표면 Act02_Lookup_ModiJournal(저장하면 retrieve()), 외화 전표면 Act02_Lookup_ModiForJournal — 다음 단계(X07 외화 전표입력에서 만든다)
 */
import React, { useEffect, useRef, useState } from 'react';
import { message } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { actApi } from '@/api/act';
import { errorMessage } from '@/api/client';
import { JournalFix, JournalLine } from '@/types/act';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';
import { Act02_Lookup_ModiJournal } from './Act02_Lookup_ModiJournal';

const gb = gbFor<JournalLine>();
const DR = { color: '#456EA6', fontWeight: 'bold' };
const CR = { color: '#DD5E5E', fontWeight: 'bold' };

/** buildGrid() L89-115: setChecked(MULTI), 차변/대변 묶음 헤더(456EA6 · DD5E5E), 합계 행 */
const columnDefs = [
  gb.textArea('trName', 150, '거래유형'),  // L98
  {
    ...gb.group('차변', [
      gb.textCenter('drAccountCode', 100, '계정코드', { headerStyle: DR }),  // L99
      gb.textArea('drAstAccountName', 300, '계정과목', { headerStyle: DR }),  // L100
      gb.long('drAmt', 100, '금액', { headerStyle: DR }),  // L101
      gb.textArea('drNote', 200, '적요', { headerStyle: DR }),  // L103
    ]),
    headerStyle: DR,
  },
  {
    ...gb.group('대변', [
      gb.textCenter('crAccountCode', 100, '계정코드', { headerStyle: CR }),  // L104
      gb.textArea('crAstAccountName', 300, '계정과목', { headerStyle: CR }),  // L105
      gb.long('crAmt', 100, '금액', { headerStyle: CR }),  // L106
      gb.textArea('crNote', 200, '적요', { headerStyle: CR }),  // L108
    ]),
    headerStyle: CR,
  },
];

const SUM_ROW = { labelField: 'trName', label: '계', sum: ['drAmt', 'crAmt'] };

interface Props {
  /** retrieve(journalModel) — 없으면 gridClear()로 목록을 비운다. [변경]이 통화(curCode)를 본다 */
  journal: Pick<JournalFix, 'journalId' | 'curCode'> | null;
  /** 같은 전표를 다시 읽으려면 값을 바꾼다 (AS-IS는 retrieve()를 다시 불렀다) */
  nonce?: number;
}

export const Act02_Grid_JournalFix: React.FC<Props> = ({ journal, nonce }) => {
  const gridRef = useRef<AgGridReact<JournalLine>>(null);
  const [rows, setRows] = useState<JournalLine[]>([]);
  const [modiOpen, setModiOpen] = useState(false);
  const [reload, setReload] = useState(0);
  const journalId = journal?.journalId ?? null;

  // [E0] 화면 열림 (생성자 L41-58) → settings() — retrieve() L143-156: act.Act03_JournalDtl.selectByJournalId → 첫 행 선택
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
  }, [journalId, nonce, reload]);

  // [E1] modiButton[변경].Select [journalModel == null] (L61) → 전표가 없으면 아무 것도 안 한다. KRW면 Act02_Lookup_ModiJournal, 아니면 Act02_Lookup_ModiForJournal
  const modi = () => {
    if (journalId == null) return;
    if ((journal?.curCode ?? 'KRW') === 'KRW') setModiOpen(true);
    else message.info('외화 전표 변경 창(Act02_Lookup_ModiForJournal)은 X07(전표입력(외화))에서 연결합니다.');
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Button type="change" onClick={modi}>변경</Button>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <MultiGrid<JournalLine> gridRef={gridRef} rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.journalDtlId)} sumRow={SUM_ROW} />
      </div>
      <Act02_Lookup_ModiJournal journalId={modiOpen ? journalId : null} onSaved={() => setReload(n => n + 1)} onClose={() => setModiOpen(false)} />
    </div>
  );
};
