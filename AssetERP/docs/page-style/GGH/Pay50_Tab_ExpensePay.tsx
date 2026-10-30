/**
 * [1400] 자금관리 > 20. 사업비관리 > 자금집행결의서 조회 (U08)
 * AS-IS: myApp/client/vi/pay/Pay50_Tab_ExpensePay.java (270줄) + Sys15_Lookup_TelInfo (pages/sys) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L59-99: North(50, 여백 20·20·0·20) = 툴바(조회기간 100~100 · 검색 250 "상신제목/지출내역/지출처" · 완료/반려건 제외 · [조회]) /
 *   West(680, 분할·최대 1000, 여백 -2·0·20·20) = 집행결의서 그리드 / Center(여백 -2·20·20·-2) = 지출내역 그리드. 열 때 retrieve()
 * 조회가 끝나면 첫 행을 고르고 아래(오른쪽) 상세를 읽는다. 행을 누르면 그 행의 settleApprId로 상세를 다시 읽는다
 * 1단계: 그리드 [집행결의서]·[지출결의서] 문서보기 아이콘이 여는 전자결재 편집창 Apr01_Edit_ApprDoc(lookupAppr)은 다른 도메인(apr)이라 다음 단계 — 상신문서 유무 안내까지 하고 편집창 자리에 안내만 띄운다
 * 스타일: GGH (제안 2026-10-30 — 원본이 좌우 분할이라 GG(상하 분할)와 다르다. docs/page-style.md)
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 조건이 3개지만 원본에 없어 넣지 않는다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, DatePicker, message, Splitter } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { payApi } from '@/api/pay';
import { errorMessage } from '@/api/client';
import { PayExpenseSettleAppr, PayExpenseSettleApprRow } from '@/types/pay';
import { SingleGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { SearchBar } from '@/components/search';
import { Sys15_Lookup_TelInfo } from '@/pages/sys/Sys15_Lookup_TelInfo';

const gbMaster = gbFor<PayExpenseSettleAppr>();
const gbDetail = gbFor<PayExpenseSettleApprRow>();
const FORMAT = 'YYYY-MM-DD';

// lookupAppr() L233-262: 상신문서가 없으면 "상신문서가 존재하지 않습니다", 있으면 Apr01_Edit_ApprDoc.retrieveApproval — 다른 도메인 컴포넌트라 다음 단계
const viewAppr = (apprId: number | null) => {
  if (apprId == null) { message.warning('상신문서가 존재하지 않습니다'); return; }
  message.info('전자결재 문서창(Apr01_Edit_ApprDoc)은 다음 단계에서 변환합니다.');
};

/** buildGrid() L152-171: 단일 선택, 집행결의서 문서보기 아이콘(actionCell) */
const buildGrid = () => [
  gbMaster.date('settleDate', 90, '지급일자'),  // L163
  gbMaster.text('settleApprTitle', 200, '상신제목'),
  gbMaster.textCenter('count', 70, '지급건수'),
  gbMaster.long('settleAmt', 100, '지급총액'),
  gbMaster.textCenter('settleApprStatusName', 80, '결재상태'),
  iconCell<PayExpenseSettleAppr>('view', 'actionCell', 80, '집행결의서', row => viewAppr(row.settleApprId)),  // L168 addCell
];

export const Pay50_Tab_ExpensePay: React.FC = () => {
  const masterRef = useRef<AgGridReact<PayExpenseSettleAppr>>(null);
  // [E0] 화면 열림 (생성자 L59-99) → settings() L101-150, retrieve(): 조회기간 = 이번 달 1일 ~ 한 달 뒤 하루 전, "완료/반려건 제외" 체크
  const [startDate, setStartDate] = useState<Dayjs>(dayjs().startOf('month'));
  const [closeDate, setCloseDate] = useState<Dayjs>(dayjs().startOf('month').add(1, 'month').subtract(1, 'day'));
  const [searchText, setSearchText] = useState('');
  const [statusCheckYn, setStatusCheckYn] = useState(true);
  const [rows, setRows] = useState<PayExpenseSettleAppr[]>([]);
  const [detailRows, setDetailRows] = useState<PayExpenseSettleApprRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [telRow, setTelRow] = useState<PayExpenseSettleApprRow | null>(null);
  const retrieveSeq = useRef(0);
  const detailSeq = useRef(0);

  // retrieveDetail() L219-231: pay.Pay50_Expense.selectBySettleApprId(settleApprId)
  const retrieveDetail = useCallback(async (settleApprId: number | null) => {
    const my = ++detailSeq.current;
    if (settleApprId == null) { setDetailRows([]); return; }
    setLoading(true);
    try {
      const list = await payApi.searchExpenseSettleApprRows(settleApprId);
      if (my === detailSeq.current) setDetailRows(list);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      if (my === detailSeq.current) setLoading(false);
    }
  }, []);

  // [E2] retrieveButton[조회].Select (L128) / [E1] searchText.KeyPress [Enter] (L116) → retrieve() L195-217:
  //   pay.Pay50_Expense.selectBySettleDate(companyId, startDate, closeDate, statusCheckYn, searchText "%검색어%") → 행이 있으면 첫 행을 고르고 retrieveDetail(), 없으면 detailGrid.store.clear()
  const retrieve = useCallback(async () => {
    const my = ++retrieveSeq.current;
    setLoading(true);  // this.mask("loading")
    try {
      const list = await payApi.searchExpenseSettleApprs({ startDate: startDate.format(FORMAT), closeDate: closeDate.format(FORMAT), statusCheckYn, searchText });
      if (my !== retrieveSeq.current) return;
      setRows(list);
      if (list.length === 0) { detailSeq.current++; setDetailRows([]); }
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      if (my === retrieveSeq.current) setLoading(false);
    }
  }, [startDate, closeDate, statusCheckYn, searchText]);

  useEffect(() => { void retrieve(); }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  const columnDefs = useMemo(buildGrid, []);
  // buildDetailGrid() L173-193: 지출결의서 문서보기 아이콘(actionCell)
  const detailColumnDefs = useMemo(() => [
    gbDetail.date('occDate', 90, '발생일자'),  // L184
    gbDetail.text('expenseName', 100, '구분'),
    gbDetail.text('desc', 300, '지출내역'),
    gbDetail.text('corpName', 130, '지출처'),  // [E4] detailGrid.CellDoubleClick [cellIndex 4] (L140) → Sys15_Lookup_TelInfo.view
    gbDetail.long('settleAmt', 100, '지급금액'),
    gbDetail.textCenter('payMethodName', 80, '지급방법'),
    iconCell<PayExpenseSettleApprRow>('view', 'actionCell', 80, '지출결의서', row => viewAppr(row.expenseApprId)),  // L190 addCell
  ], []);

  return (
    <div style={{ height: '100%', background: '#fff', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 'none', padding: '20px 20px 0 20px', boxSizing: 'border-box' }}>
        <SearchBar onSearch={() => void retrieve()} loading={loading}>
          <SearchBar.Field label="조회기간">
            <DatePicker style={{ width: 130 }} allowClear={false} value={startDate} format={FORMAT} onChange={d => d && setStartDate(d)} />
            <span style={{ margin: '0 4px' }}>~</span>
            <DatePicker style={{ width: 130 }} allowClear={false} value={closeDate} format={FORMAT} onChange={d => d && setCloseDate(d)} />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 250 }} placeholder="상신제목/지출내역/지출처" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
          <Checkbox checked={statusCheckYn} onChange={e => setStatusCheckYn(e.target.checked)}>완료/반려건 제외</Checkbox>
        </SearchBar>
      </div>
      <Splitter style={{ flex: 1, minHeight: 0 }}>
        <Splitter.Panel defaultSize={680} min={300} max={1000}>
          <div style={{ height: '100%', boxSizing: 'border-box', padding: '8px 10px 20px 20px' }}>
            {/* [E3] grid.RowClick (L134) → retrieveDetail() */}
            <SingleGrid<PayExpenseSettleAppr>
              gridRef={masterRef}
              rowData={rows}
              columnDefs={columnDefs}
              getRowId={p => String(p.data.expenseId)}
              loading={loading}
              onRowDataUpdated={e => { if (e.api.getSelectedRows().length === 0) e.api.getDisplayedRowAtIndex(0)?.setSelected(true); }}
              onSelect={row => void retrieveDetail(row?.settleApprId ?? null)}
            />
          </div>
        </Splitter.Panel>
        <Splitter.Panel>
          <div style={{ height: '100%', boxSizing: 'border-box', padding: '8px 20px 20px 10px' }}>
            <SingleGrid<PayExpenseSettleApprRow>
              rowData={detailRows}
              columnDefs={detailColumnDefs}
              getRowId={p => String(p.data.expenseId)}
              onCellDoubleClicked={e => { if (e.colDef.field === 'corpName' && e.data) setTelRow(e.data); }}
            />
          </div>
        </Splitter.Panel>
      </Splitter>
      <Sys15_Lookup_TelInfo open={telRow != null} tel={telRow?.tel ?? null} addr={telRow?.addr ?? null} onClose={() => setTelRow(null)} />
    </div>
  );
};
