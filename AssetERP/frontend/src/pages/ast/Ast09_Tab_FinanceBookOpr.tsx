/**
 * [1300] 고유자산 > 30. 고유자산 현황 > 금융상품 운용내역 (W15)
 * AS-IS: myApp/client/vi/ast/Ast09_Tab_FinanceBookOpr.java (530줄) + Ast06_TabPage_FinanceBookOpr.java (216줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L96-156: North 88(여백 20,20,0,20, 테두리) = 툴바 50(기준일 100 · ☐미보유 포함 · ◯1개월전 ◯3개월전 ◯1년전 ◯기간지정 ( 시작 ~ 종료 ) · [조회][출력/다운로드]) + 둘째 줄 36(종목유형 콤보 150 "전체" · 검색 300 "보관계좌/종목유형/종목명")
 *   Center(여백 -2,20,20,20, 테두리) = 위 170(왼쪽 160 "0000.00 자기자본"+금액, 오른쪽 투자한도 그리드·행번호 없음·합계 "계") / "• 평가내역" 30 / 평가 그리드(행번호, 앞 3열 고정, 합계 "계", 2단 헤더 평가손익·수익률) / 아래 250 = Ast06_TabPage_FinanceBookOpr(매수·매도 그리드)
 * 스타일: GG (견본 — docs/page-style.md). 원본의 고정 높이(170 · 250)를 세로 Splitter 두 칸으로 옮겼다: 위(툴바·투자한도·평가내역, 최소 120) / 아래 250(매수·매도, 최소 200)
 * UX보강(10): 툴바 = SearchBar(UX-01), 읽기 전용 날짜 열 폭 90(UX-08, 원본 100)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, DatePicker, Input, message, Modal, Radio, Select, Space, Splitter } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { astApi } from '@/api/ast';
import { sysApi } from '@/api/sys';
import { rdApi } from '@/api/rd';
import { errorMessage } from '@/api/client';
import { AstFinanceOpr, AstInvestAssetLimit } from '@/types/ast';
import { Code } from '@/types/sys';
import { Button } from '@/components/button';
import { SearchBar } from '@/components/search';
import { SingleGrid, gbFor } from '@/components/grid';
import { RdViewer } from '@/components/lookup/RdViewer';
import { Ast06_TabPage_FinanceBookOpr, FinanceOprTabParam } from './Ast06_TabPage_FinanceBookOpr';

const gbLimit = gbFor<AstInvestAssetLimit>();
const gb = gbFor<AstFinanceOpr>();
const FORMAT = 'YYYY-MM-DD';
const ALL = '';
/** 라디오 값 = AS-IS periodType (1개월전·3개월전·1년전·기간지정) */
type Radio4 = '' | '1' | '2' | '3' | '4';

export const Ast09_Tab_FinanceBookOpr: React.FC = () => {
  const gridRef = useRef<AgGridReact<AstFinanceOpr>>(null);
  // settings() L158-291: 기준일 100(오늘), 미보유 포함 off, 라디오 넷 비활성, 시작·종료일 비활성, 종목유형 콤보 150 "전체", 검색 300
  const [stdDate, setStdDate] = useState<Dayjs>(() => dayjs());
  const [holdYn, setHoldYn] = useState(false);
  const [radio, setRadio] = useState<Radio4>('');
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [closeDate, setCloseDate] = useState<Dayjs | null>(null);
  const [investType, setInvestType] = useState(ALL);
  const [typeOptions, setTypeOptions] = useState<Code[]>([]);
  const [searchText, setSearchText] = useState('');
  const [capital, setCapital] = useState<{ ym: string | null; amt: number | null }>({ ym: null, amt: null });
  const [limits, setLimits] = useState<AstInvestAssetLimit[]>([]);
  const [rows, setRows] = useState<AstFinanceOpr[]>([]);
  const [loading, setLoading] = useState(false);
  const [tabParam, setTabParam] = useState<FinanceOprTabParam | null>(null);
  const [nonce, setNonce] = useState(0);
  const [busy, setBusy] = useState(false);
  const [rdUrl, setRdUrl] = useState<string | null>(null);

  // retrieve() 때 최신 값을 읽도록 ref에 둔다 (콤보 닫힘·Enter에서 부름)
  const cur = useRef({ stdDate, holdYn, radio, startDate, closeDate, investType, searchText });
  cur.current = { stdDate, holdYn, radio, startDate, closeDate, investType, searchText };

  // getPeriodType() L488-508 — 미보유 포함이 아니면 "0", 포함이면 고른 라디오, 안 골랐으면 안내 문구
  const getPeriodType = (): string => {
    const c = cur.current;
    if (!c.holdYn) return '0';
    return c.radio === '' ? '미보유 포함 기간조건을 선택하세요' : c.radio;
  };

  const params = (periodType: string) => {
    const c = cur.current;
    return {
      holdDate: c.stdDate.format(FORMAT),
      searchText: c.searchText,
      investAssetType: c.investType,
      holdYn: c.holdYn,
      periodType,
      startDate: c.startDate?.format(FORMAT),
      closeDate: c.closeDate?.format(FORMAT),
    };
  };

  // retrieveTabpage() L293-306: 고른 행이 있으면 tabPage.retrieve(astClassTreeId, keepAccountId, stdDate = 행의 holdDate), 없으면 init()
  const retrieveTabpage = (row: AstFinanceOpr | undefined) => {
    setTabParam(row ? { astClassTreeId: row.astClassTreeId, keepAccountId: row.keepAccountId, stdDate: row.holdDate } : null);
    setNonce(n => n + 1);
  };

  // retrieve() L350-407
  const retrieve = useCallback(async () => {
    const periodType = getPeriodType();
    if (periodType.length > 1) { Modal.info({ title: '알림', content: periodType, okText: '확인' }); return; }
    setLoading(true);
    try {
      const p = params(periodType);
      const [cap, lim, list] = await Promise.all([
        astApi.getOwnerCapitalMax(p.holdDate),                // ast.Ast40_OwnerCapital.selectByMaxDate L360
        astApi.searchInvestAssetLimits(p.holdDate),           // ast.Ast09_Book.selectInvestAssetLimit L385
        astApi.searchFinanceOpr(p),                           // ast.Ast09_Book.selectFinanceByHoldDate L397
      ]);
      setCapital(cap ? { ym: cap.stdDate.slice(0, 7).replace('-', '.'), amt: cap.amt } : { ym: null, amt: null });
      setLimits(lim);
      setRows(list);
      // 콜백 L398-405: 첫 행 선택 → retrieveTabpage()
      const first = list[0];
      retrieveTabpage(first);
      if (first) setTimeout(() => gridRef.current?.api?.getRowNode(String(first.bookId))?.setSelected(true), 0);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // [E0] 화면 열림 (생성자 L96-156) → settings() / [E3] 콤보 만들어지면(callbackOnCreate L241) "전체"로 두고 retrieve()
  useEffect(() => {
    void (async () => {
      try {
        setTypeOptions(await sysApi.searchCodesByKindGroup('ItemMClassCode002'));
      } catch (err) {
        message.error(errorMessage(err, '종목유형 조회 실패'));
      }
      void retrieve();
    })();
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // [E1] holdYnCheckBox.ValueChange (L170-195): 라디오 모두 해제 — 켜면 라디오 활성(토글 비움), 끄면 라디오·시작/종료일 비활성하고 날짜 비움
  const onHoldYn = (checked: boolean) => {
    setHoldYn(checked);
    setRadio('');
    if (!checked) { setStartDate(null); setCloseDate(null); }
  };

  // [E2] toggle.ValueChange (L219-234): 기간지정이면 시작·종료일 활성 + 오늘, 아니면 비활성 + 비움
  const onRadio = (v: Radio4) => {
    setRadio(v);
    if (v === '4') { setStartDate(dayjs()); setCloseDate(dayjs()); } else { setStartDate(null); setCloseDate(null); }
  };

  // [E7] rdButton[출력/다운로드].Select (L279) → createPrint() L409-486: insertRdFinanceBookOpr1(투자한도, 창 이름 "Ast09_Tab_FinanceBookOpr_1") → 기간 조건 확인 → insertRdFinanceBookOpr2(보유·매매내역, "…_2")
  //   → RDViewer(page CommonViewer.html · mrd Ast09_Rd_FinanceBookOpr · options "/rhtmlimportopt [2]" · rv rdGroupId = 보유&매매 그룹, investLimitGroupId, bookGroupId, holdDate)
  const createPrint = async () => {
    const holdDate = cur.current.stdDate.format(FORMAT);
    setBusy(true);
    try {
      const investLimitGroupId = await astApi.rdFinanceOprLimit(holdDate);
      const periodType = getPeriodType();
      if (periodType.length > 1) { Modal.info({ title: '알림', content: periodType, okText: '확인' }); return; }
      const bookGroupId = await astApi.rdFinanceOprBook(params(periodType));
      const res = await rdApi.buildUrl({
        kind: 'viewer',
        mrd: 'Ast09_Rd_FinanceBookOpr',
        options: '/rhtmlimportopt [2]',
        rv: { rdGroupId: String(bookGroupId), investLimitGroupId: String(investLimitGroupId), bookGroupId: String(bookGroupId), holdDate },
      });
      setRdUrl(res.url);
    } catch (err) {
      message.error(errorMessage(err, '출력 실패'));
    } finally {
      setBusy(false);
    }
  };

  // buildGrid1() L308-320 — 행번호 없음, getSumGrid("계", 1, 4, 5): 라벨은 두 번째 열(투자한도%), 합계는 매입원가·자기자본대비
  const limitCols = useMemo(() => [
    gbLimit.text('investAssetTypeName', 200, '보유자산'),   // L311
    gbLimit.double('limitRate', 150, '투자한도(%)'),        // L312
    gbLimit.long('limitAmt', 200, '투자한도액'),            // L313
    gbLimit.long('evalAmt', 200, '투자금액'),               // L314
    gbLimit.long('purAmt', 200, '매입원가'),                // L315
    gbLimit.double('capitalRatio', 200, '자기자본대비(%)'), // L316
  ], []);

  // buildGrid2() L322-348 — 앞 3열 고정, 2단 헤더(평가손익·수익률), getSumGrid("계", 1, 6, 12, "8,9")
  const columnDefs = useMemo(() => [
    { ...gb.text('keepAccountName', 150, '보관계좌'), pinned: 'left' as const },       // L329
    { ...gb.text('astClassName', 130, '종목유형'), pinned: 'left' as const },          // L330
    { ...gb.text('astClassTreeName', 250, '종목명'), pinned: 'left' as const },        // L331
    gb.date('firstPurDate', 90, '최초취득일'),                                          // L333 (원본 100 — UX-08)
    gb.double('holdQty', 100, '보유수량'),                                              // L334
    gb.long('purAmt', 100, '취득금액'),                                                 // L335
    gb.long('bookAmt', 100, '장부금액'),                                                // L336
    gb.double('purPrice', 80, '취득단가'),                                              // L337
    gb.double('evalPrice', 80, '평가단가'),                                             // L338
    gb.long('evalAmt', 100, '평가금액'),                                                // L339
    gb.group('평가손익', [                                                              // HeaderGroupMap(0, 11) L324
      gb.long('evalPl', 100, '당기분'),                                                 // L340
      gb.long('purEvalPl', 100, '취득대비'),                                            // L341
    ]),
    gb.group('수익률(%)', [                                                             // HeaderGroupMap(0, 13) L325
      gb.double('tyPlRate', 80, '당기분'),                                              // L342
      gb.double('purPlRate', 80, '취득대비'),                                           // L343
    ]),
    {                                                                                   // L344 addStopLoss — 가운데, "매도필요"는 빨강 굵게
      ...gb.textCenter('stopLossNotice', 100, 'StopLoss<br>(취득가대비)'),
      cellRenderer: (p: { value?: string | null }) => (p.value === '매도필요' ? <b style={{ color: '#E95749' }}>{p.value}</b> : <span>{p.value}</span>),
    },
    gb.date('sellPossibleDate', 90, '매도가능일'),                                      // L345 (원본 100 — UX-08)
    gb.textRight('holdPeriod', 115, '보유기간'),                                        // L346
  ], []);  // eslint-disable-line react-hooks/exhaustive-deps

  const bar = { background: '#fff' };
  return (
    <div style={{ height: '100%', ...bar }}>
      <Splitter layout="vertical" style={{ height: '100%' }}>
        <Splitter.Panel min={120}>
          <div style={{ height: '100%', padding: '20px 20px 0 20px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {/* [E6] retrieveButton[조회].Select (L273) → retrieve(), [E5] searchText.KeyPress [Enter] (L265) → retrieve() */}
            <SearchBar onSearch={retrieve} loading={loading} extra={<Button type="download" loading={busy} onClick={createPrint}>출력/다운로드</Button>}>
              <SearchBar.Field label="기준일">
                <DatePicker style={{ width: 120 }} allowClear={false} value={stdDate} format={FORMAT} onChange={d => d && setStdDate(d)} />
              </SearchBar.Field>
              <Checkbox checked={holdYn} onChange={e => onHoldYn(e.target.checked)}>미보유 포함</Checkbox>
              <Radio.Group value={radio || undefined} disabled={!holdYn} onChange={e => onRadio(e.target.value as Radio4)}>
                <Radio value="1">1개월전</Radio>
                <Radio value="2">3개월전</Radio>
                <Radio value="3">1년전</Radio>
                <Radio value="4">기간지정</Radio>
              </Radio.Group>
              <Space size={4}>
                <span>(</span>
                <DatePicker style={{ width: 120 }} disabled={radio !== '4'} value={startDate} format={FORMAT} allowClear={false} onChange={d => setStartDate(d)} />
                <span>~</span>
                <DatePicker style={{ width: 120 }} disabled={radio !== '4'} value={closeDate} format={FORMAT} allowClear={false} onChange={d => setCloseDate(d)} />
                <span>)</span>
              </Space>
            </SearchBar>
            <Space>
              <strong>종목유형</strong>
              {/* [E4] investAssetTypeComboBox.Collapse (L250) → retrieve() — 고른 코드 + "%" */}
              <Select style={{ width: 150 }} value={investType} onChange={setInvestType}
                onOpenChange={open => { if (!open) setTimeout(() => void retrieve(), 0); }}
                options={[{ value: ALL, label: '전체' }, ...typeOptions.map(c => ({ value: c.code, label: c.name }))]} />
              <strong>검색</strong>
              <Input style={{ width: 300 }} allowClear placeholder="보관계좌/종목유형/종목명" value={searchText}
                onChange={e => setSearchText(e.target.value)} onPressEnter={() => void retrieve()} />
            </Space>
            <div style={{ flex: 'none', height: 170, display: 'flex', gap: 20 }}>
              <div style={{ flex: '0 0 160px', paddingTop: 5 }}>
                <div style={{ fontWeight: 'bold', height: 30 }}>{capital.ym ? `${capital.ym} 자기자본` : '0000.00 자기자본'}</div>
                <Input readOnly style={{ width: 140, textAlign: 'right' }} value={capital.amt == null ? '' : capital.amt.toLocaleString()} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <SingleGrid<AstInvestAssetLimit> rowData={limits} columnDefs={limitCols} rowNumber={false} getRowId={p => String(p.data.bookId)} loading={loading}
                  sumRow={{ labelField: 'limitRate', label: '계', sum: ['purAmt', 'capitalRatio'] }} />
              </div>
            </div>
            <div style={{ flex: 'none', height: 30, fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>• 평가내역</div>
            <div style={{ flex: 1, minHeight: 0 }}>
              {/* [E8] grid2.RowClick (L285) → retrieveTabpage() */}
              <SingleGrid<AstFinanceOpr> gridRef={gridRef} rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.bookId)} loading={loading}
                onRowClicked={e => retrieveTabpage(e.data)}
                sumRow={{ labelField: 'keepAccountName', label: '계', sum: ['purAmt', 'bookAmt', 'evalAmt', 'evalPl', 'purEvalPl'] }} />
            </div>
          </div>
        </Splitter.Panel>
        <Splitter.Panel defaultSize={250} min={200}>
          <div style={{ height: '100%', padding: '10px 20px 20px 20px', boxSizing: 'border-box' }}>
            <Ast06_TabPage_FinanceBookOpr param={tabParam} nonce={nonce} />
          </div>
        </Splitter.Panel>
      </Splitter>
      <RdViewer url={rdUrl} title="금융상품 운용내역" onClose={() => setRdUrl(null)} />
    </div>
  );
};
