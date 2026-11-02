/**
 * [1201] 관리회계 > 30. 사무보수관리 > 보수원장 (X25)
 * AS-IS: myApp/client/vi/ast/Ast30_Tab_OfficeMngFeeState.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L45-80: BorderLayout 위 = 툴바 50(여백 20,20,0,20: 기준일자 100 · 검색 250 "운용사/펀드" · [조회]) / 왼쪽 850(분할) = 운용사 그리드(행번호, 단일 선택, 7열) / 가운데 = 펀드 그리드(행번호, 단일 선택, 11열)
 * 함께: Ast30_Lookup_FeeDetail(펀드 그리드 더블클릭 — 증감액 상세 창)
 * 스타일: GGH (원본이 좌우 분할 — yunhee page-style은 GG로 판별한다. docs/page-style.md). 견본 docs/page-style/GGH/Pay50_Tab_ExpensePay.tsx
 * UX보강(10): 툴바 = SearchBar(UX-01). 조건이 2개라 초기화(UX-02)는 넣지 않는다
 * 왼쪽 폭: 견본 680 대신 원본 850(열 폭 합계 780 + 행번호 — 680이면 가로 스크롤이 생긴다, 12 원칙 1)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, message, Splitter } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { astApi } from '@/api/ast';
import { errorMessage } from '@/api/client';
import { AstBookFundFeeCorp, AstBookFundFeeFund } from '@/types/ast';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { Ast30_Lookup_FeeDetail, FeeDetailTarget } from './Ast30_Lookup_FeeDetail';

const FORMAT = 'YYYY-MM-DD';
const gbCorp = gbFor<AstBookFundFeeCorp>();
const gbFund = gbFor<AstBookFundFeeFund>();

/** AS-IS buildGrid() L130-141 */
const corpColumnDefs = [
  gbCorp.textCenter('corpCode', 80, '운용사코드'),
  gbCorp.text('corpName', 200, '운용사명'),
  gbCorp.long('diffFee', 100, '증감액'),
  gbCorp.long('fee', 100, '당일잔액'),
  gbCorp.long('unRcvFee', 100, '유보금액'),
  gbCorp.long('tyFee', 100, '당기보수'),
  gbCorp.long('fixFee', 100, '전기보수'),
];

/** AS-IS fundBuildGrid() L143-158 */
const fundColumnDefs = [
  gbFund.textCenter('fundCode', 80, '펀드코드'),
  gbFund.text('fundName', 400, '펀드명'),
  gbFund.textCenter('curCode', 50, '통화'),
  gbFund.long('diffFee', 100, '증감액(KRW)'),
  gbFund.long('fee', 100, '당일잔액(KRW)'),
  gbFund.long('unRcvFee', 100, '유보금액(KRW)'),
  gbFund.long('tyFee', 100, '당기보수(KRW)'),
  gbFund.long('fixFee', 100, '전기보수(KRW)'),
  gbFund.double('forDiffFee', 100, '증감액(통화)'),
  gbFund.double('forFee', 100, '당일잔액(통화)'),
  gbFund.double('forUnRcvFee', 100, '유보금액(통화)'),
];

export const Ast30_Tab_OfficeMngFeeState: React.FC = () => {
  // setting() L82-128: 기준일자 100 = 어제, 검색칸 250 "운용사/펀드"
  const [stdDate, setStdDate] = useState<Dayjs>(() => dayjs().subtract(1, 'day'));
  const [searchText, setSearchText] = useState('');
  const [corps, setCorps] = useState<AstBookFundFeeCorp[]>([]);
  const [funds, setFunds] = useState<AstBookFundFeeFund[]>([]);
  const [loading, setLoading] = useState(false);
  const [fundLoading, setFundLoading] = useState(false);
  const [detail, setDetail] = useState<FeeDetailTarget | null>(null);
  const fundSeq = useRef(0);

  // retrieveFund() L182-201: ast.Ast30_BookFundFee.selectByCorpId(companyId, holdDate, searchText, corpId) → 첫 행 선택
  const retrieveFund = useCallback(async (corpId: number | null, holdDate: string, text: string) => {
    const my = ++fundSeq.current;
    setFunds([]);   // fundGrid.store.clear()
    if (corpId == null) return;
    setFundLoading(true);
    try {
      const list = await astApi.searchBookFundFeeFunds({ holdDate, corpId, searchText: text });
      if (my === fundSeq.current) setFunds(list);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      if (my === fundSeq.current) setFundLoading(false);
    }
  }, []);

  /** 조회한 때의 조건 — 운용사 행을 누를 때 같은 조건으로 (원본은 그때의 stdDate·searchText를 다시 읽는다) */
  const [queried, setQueried] = useState<{ holdDate: string; searchText: string }>({ holdDate: stdDate.format(FORMAT), searchText: '' });

  // [E1] searchText.KeyPress [Enter] (L92)·[E4] retrieveButton[조회].Select (L122) → retrieve() L160-180:
  //   ast.Ast30_BookFundFee.selectByCompanyId(companyId, holdDate, searchText) → 펀드 그리드 비움 → 행이 있으면 첫 행 선택 + retrieveFund(corpId)
  const retrieve = useCallback(async () => {
    const cond = { holdDate: stdDate.format(FORMAT), searchText };
    setLoading(true);  // grid.mask("Loading")
    fundSeq.current++;
    setFunds([]);
    try {
      const list = await astApi.searchBookFundFeeCorps(cond);
      setQueried(cond);
      setCorps(list);
      if (list.length === 0) setFunds([]);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);  // grid.unmask()
    }
  }, [stdDate, searchText]);

  // [E0] 화면 열림 (생성자 L45-80) → setting(), retrieve()
  useEffect(() => { void retrieve(); }, []);   // eslint-disable-line react-hooks/exhaustive-deps

  const corpColumns = useMemo(() => corpColumnDefs, []);
  const fundColumns = useMemo(() => fundColumnDefs, []);

  return (
    <div style={{ height: '100%', background: '#fff', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 'none', padding: '20px 20px 0 20px', boxSizing: 'border-box' }}>
        <SearchBar onSearch={retrieve} loading={loading}>
          <SearchBar.Field label="기준일자">
            <DatePicker style={{ width: 130 }} allowClear={false} value={stdDate} format={FORMAT} onChange={d => d && setStdDate(d)} />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 250 }} placeholder="운용사/펀드" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
      </div>
      <Splitter style={{ flex: 1, minHeight: 0 }}>
        <Splitter.Panel defaultSize={850} min={300} max={1000}>
          <div style={{ height: '100%', boxSizing: 'border-box', padding: '8px 10px 20px 20px' }}>
            {/* [E2] grid.RowClick [model != null] (L101) → retrieveFund() */}
            <SingleGrid<AstBookFundFeeCorp>
              rowData={corps}
              loading={loading}
              columnDefs={corpColumns}
              getRowId={p => String(p.data.corpId)}
              onRowDataUpdated={e => { if (e.api.getSelectedRows().length === 0) e.api.getDisplayedRowAtIndex(0)?.setSelected(true); }}
              onSelect={row => void retrieveFund(row?.corpId ?? null, queried.holdDate, queried.searchText)}
            />
          </div>
        </Splitter.Panel>
        <Splitter.Panel>
          <div style={{ height: '100%', boxSizing: 'border-box', padding: '8px 20px 20px 10px' }}>
            {/* [E3] fundGrid.RowDoubleClick [model != null] (L111) → Ast30_Lookup_FeeDetail.open(corpId, fundCode, holdDate) */}
            <SingleGrid<AstBookFundFeeFund>
              rowData={funds}
              loading={fundLoading}
              columnDefs={fundColumns}
              getRowId={p => String(p.data.bookFundFeeId)}
              onRowDataUpdated={e => { if (e.api.getSelectedRows().length === 0) e.api.getDisplayedRowAtIndex(0)?.setSelected(true); }}
              onRowDoubleClicked={e => e.data && setDetail({ corpId: e.data.corpId, fundCode: e.data.fundCode, stdDate: e.data.holdDate ?? queried.holdDate })}
            />
          </div>
        </Splitter.Panel>
      </Splitter>
      <Ast30_Lookup_FeeDetail target={detail} onClose={() => setDetail(null)} />
    </div>
  );
};
