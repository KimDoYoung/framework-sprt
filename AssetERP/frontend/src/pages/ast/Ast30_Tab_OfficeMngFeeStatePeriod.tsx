/**
 * [1249] 관리회계 > 30. 사무보수관리 > 보수원장(기간조회) (X26)
 * AS-IS: myApp/client/vi/ast/Ast30_Tab_OfficeMngFeeStatePeriod.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L52-96: BorderLayout 위 = 툴바 50(여백 20,20,0,20: 조회일자 100 ~ 100 · 검색 250 "운용사/펀드" · [조회]) / 가운데 0.6 = 일자·운용사 그리드(행번호, 단일 선택, 8열) + 페이징 툴바(100) / 아래 0.4(분할) = 펀드 그리드(행번호, 단일 선택, 13열)
 * 함께: Ast30_Lookup_FeeDetail(펀드 그리드 더블클릭 — 증감액 상세 창, X25에서 만든 것)
 * 스타일: GG (견본 docs/page-style/GG/Est02_Tab_PfResultReport.tsx — 툴바는 위 패널 안)
 * UX보강(10): 툴바 = SearchBar(UX-01). 조건이 3개라도 버튼을 넣을 공간이 있는 초기화(UX-02)는 원본에 없어 넣지 않는다
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { DatePicker, message, Splitter } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { astApi } from '@/api/ast';
import { errorMessage } from '@/api/client';
import { AstBookFundFeeFund, AstBookFundFeePeriod } from '@/types/ast';
import { PagingToolBar, SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { Ast30_Lookup_FeeDetail, FeeDetailTarget } from './Ast30_Lookup_FeeDetail';

const LIMIT = 100;   // gridToolBar.setToolBar(100)
const FORMAT = 'YYYY-MM-DD';
const gb = gbFor<AstBookFundFeePeriod>();
const gbFund = gbFor<AstBookFundFeeFund>();

/** AS-IS buildGrid() L149-161 */
const columnDefs = [
  gb.date('holdDate', 100, '일자'),
  gb.textCenter('corpCode', 80, '운용사코드'),
  gb.text('corpName', 200, '운용사명'),
  gb.long('diffFee', 150, '증감액'),
  gb.long('fee', 150, '당일잔액'),
  gb.long('unRcvFee', 150, '유보금액'),
  gb.long('tyFee', 150, '당기보수'),
  gb.long('fixFee', 150, '전기보수'),
];

/** AS-IS fundBuildGrid() L163-180 */
const fundColumnDefs = [
  gbFund.textCenter('fundCode', 80, '펀드코드'),
  gbFund.text('fundName', 400, '펀드명'),
  gbFund.textCenter('curCode', 50, '통화'),
  gbFund.long('diffFee', 120, '증감액(KRW)'),
  gbFund.long('fee', 120, '당일잔액(KRW)'),
  gbFund.long('unRcvFee', 120, '유보금액(KRW)'),
  gbFund.long('tyFee', 120, '당기보수(KRW)'),
  gbFund.long('fixFee', 120, '전기보수(KRW)'),
  gbFund.double('forDiffFee', 120, '증감액(통화)'),
  gbFund.double('forFee', 120, '당일잔액(통화)'),
  gbFund.double('forUnRcvFee', 120, '유보금액(통화)'),
  gbFund.date('calcStartDate', 100, '보수계산시작일'),
  gbFund.date('calcCloseDate', 100, '보수계산종료일'),
];

interface Condition {
  startDate: string;
  closeDate: string;
  searchText: string;
}

export const Ast30_Tab_OfficeMngFeeStatePeriod: React.FC = () => {
  // setting() L98-147: 조회일자 100 = 어제 ~ 어제, 검색 250 "운용사/펀드"
  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs().subtract(1, 'day'));
  const [closeDate, setCloseDate] = useState<Dayjs>(() => dayjs().subtract(1, 'day'));
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<AstBookFundFeePeriod[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [funds, setFunds] = useState<AstBookFundFeeFund[]>([]);
  const [loading, setLoading] = useState(false);
  const [fundLoading, setFundLoading] = useState(false);
  const [detail, setDetail] = useState<FeeDetailTarget | null>(null);
  /** 조회한 때의 조건 — 페이지를 넘길 때(gridToolBar.addParam)·펀드 조회(searchText)에 같은 조건으로 */
  const cond = useRef<Condition | null>(null);
  const fundSeq = useRef(0);

  // retrieveFund() L210-229: ast.Ast30_BookFundFee.selectByCorpId(companyId, model.holdDate, searchText, model.corpId) → 첫 행 선택
  const retrieveFund = useCallback(async (row: AstBookFundFeePeriod | null) => {
    const my = ++fundSeq.current;
    setFunds([]);   // fundGrid.store.clear()
    if (!row) return;
    setFundLoading(true);
    try {
      const list = await astApi.searchBookFundFeeFunds({ holdDate: row.holdDate, corpId: row.corpId, searchText: cond.current?.searchText ?? '' });
      if (my === fundSeq.current) setFunds(list);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      if (my === fundSeq.current) setFundLoading(false);
    }
  }, []);

  // GridPagingLoader.getPaging(): 저장된 조건 + offset·limit → 목록·전체 건수
  const getPaging = useCallback(async (p: number) => {
    const c = cond.current;
    if (!c) return;
    setLoading(true);  // grid.mask("Loading")
    fundSeq.current++;
    setFunds([]);
    try {
      const res = await astApi.searchBookFundFeePeriod({ ...c, offset: (p - 1) * LIMIT, limit: LIMIT });
      setRows(res.rows);
      setTotal(res.total);
      setPage(p);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);  // grid.unmask()
    }
  }, []);

  // [E1] searchText.KeyPress [Enter] (L111)·[E4] retrieveButton[조회].Select (L141) → retrieve() L182-208:
  //   펀드 그리드 비움 → 조건 저장 → 1페이지부터 조회, 행이 있으면 첫 행 선택 + retrieveFund()
  const retrieve = useCallback(async () => {
    cond.current = { startDate: startDate.format(FORMAT), closeDate: closeDate.format(FORMAT), searchText };
    await getPaging(1);
  }, [startDate, closeDate, searchText, getPaging]);

  // [E0] 화면 열림 (생성자 L52-96) → setting(), retrieve()
  useEffect(() => { void retrieve(); }, []);   // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ height: '100%', background: '#fff' }}>
      <Splitter layout="vertical" style={{ height: '100%' }}>
        <Splitter.Panel defaultSize="60%" min={120}>
          <div style={{ height: '100%', padding: '20px 20px 0 20px', boxSizing: 'border-box' }}>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <SearchBar onSearch={retrieve} loading={loading}>
                <SearchBar.Field label="조회일자">
                  <DatePicker style={{ width: 130 }} allowClear={false} value={startDate} format={FORMAT} onChange={d => d && setStartDate(d)} />
                  <span style={{ margin: '0 4px' }}>~</span>
                  <DatePicker style={{ width: 130 }} allowClear={false} value={closeDate} format={FORMAT} onChange={d => d && setCloseDate(d)} />
                </SearchBar.Field>
                <SearchBar.Field label="검색">
                  <SearchBar.Input style={{ width: 250 }} placeholder="운용사/펀드" value={searchText} onChange={e => setSearchText(e.target.value)} />
                </SearchBar.Field>
              </SearchBar>
              <div style={{ flex: 1, minHeight: 0 }}>
                {/* [E2] grid.RowClick [model != null] (L120) → retrieveFund(model) */}
                <SingleGrid<AstBookFundFeePeriod>
                  rowData={rows}
                  loading={loading}
                  columnDefs={columnDefs}
                  getRowId={p => `${p.data.holdDate}|${p.data.corpId}`}
                  onRowDataUpdated={e => { if (e.api.getSelectedRows().length === 0) e.api.getDisplayedRowAtIndex(0)?.setSelected(true); }}
                  onSelect={row => void retrieveFund(row ?? null)}
                />
              </div>
              <PagingToolBar page={page} limit={LIMIT} total={total} loading={loading} onChange={getPaging} />
            </div>
          </div>
        </Splitter.Panel>
        <Splitter.Panel defaultSize="40%" min={200}>
          <div style={{ height: '100%', padding: '8px 20px 20px 20px', boxSizing: 'border-box' }}>
            {/* [E3] fundGrid.RowDoubleClick [model != null] (L130) → Ast30_Lookup_FeeDetail.open(corpId, fundCode, holdDate) */}
            <SingleGrid<AstBookFundFeeFund>
              rowData={funds}
              loading={fundLoading}
              columnDefs={fundColumnDefs}
              getRowId={p => String(p.data.bookFundFeeId)}
              onRowDataUpdated={e => { if (e.api.getSelectedRows().length === 0) e.api.getDisplayedRowAtIndex(0)?.setSelected(true); }}
              onRowDoubleClicked={e => e.data && setDetail({ corpId: e.data.corpId, fundCode: e.data.fundCode, stdDate: e.data.holdDate ?? '' })}
            />
          </div>
        </Splitter.Panel>
      </Splitter>
      <Ast30_Lookup_FeeDetail target={detail} onClose={() => setDetail(null)} />
    </div>
  );
};
