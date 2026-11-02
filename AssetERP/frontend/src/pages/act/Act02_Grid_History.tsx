/**
 * 자산별 분개 이력 그리드 (X19) — Ast09_Tab_PreDepositBook 아래쪽에 붙는다 (다른 화면도 쓸 수 있다)
 * AS-IS: myApp/client/vi/act/Act02_Grid_History.java (56줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * buildGrid() L24-34: 일자 120 · 자산명 300 · 거래구분 200 · 금액 150 · 비고 500, 합계 행 "계"(금액). retrieve(astClassTreeId) L36-50: act.Act02_Journal.selectByAstClassTreeId. clear() L52-54
 */
import React, { useEffect, useMemo, useState } from 'react';
import { message } from 'antd';
import { actApi } from '@/api/act';
import { errorMessage } from '@/api/client';
import { JournalHistory } from '@/types/act';
import { SingleGrid, gbFor } from '@/components/grid';

const gb = gbFor<JournalHistory>();
const SUM_ROW = { labelField: 'date', label: '계', sum: ['journalAmt'] };

interface Props {
  /** 값이 있으면 그 자산의 분개 이력을 읽고, null이면 비운다(clear()) */
  astClassTreeId: number | null;
  /** 같은 자산을 다시 읽으려면 값을 바꾼다 (AS-IS는 행을 누를 때마다 retrieve()를 다시 불렀다) */
  nonce?: number;
}

export const Act02_Grid_History: React.FC<Props> = ({ astClassTreeId, nonce }) => {
  const [rows, setRows] = useState<JournalHistory[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (astClassTreeId == null) { setRows([]); return; }
    let live = true;
    setLoading(true);  // grid.mask("Loading")
    actApi.searchJournalHistory(astClassTreeId)
      .then(list => { if (live) setRows(list); })
      .catch(err => message.error(errorMessage(err, '조회 실패')))
      .finally(() => { if (live) setLoading(false); });
    return () => { live = false; };
  }, [astClassTreeId, nonce]);

  const columnDefs = useMemo(() => [
    gb.date('date', 120, '일자'),  // L27
    gb.text('astClassTreeName', 300, '자산명'),  // L28
    gb.text('trName', 200, '거래구분'),  // L29
    gb.long('journalAmt', 150, '금액'),  // L30
    gb.text('note', 500, '비고'),  // L31
  ], []);

  return (
    <SingleGrid<JournalHistory>
      rowData={rows}
      columnDefs={columnDefs}
      getRowId={p => String(p.data.journalId)}
      sumRow={SUM_ROW}
      loading={loading}
    />
  );
};
