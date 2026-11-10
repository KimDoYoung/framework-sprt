/**
 * [1215] 관리회계 > 30. 펀드운용보수관리 > ICAM 운용보수 월말잔액 (X30)
 * AS-IS: myApp/client/vi/icam/Icam12_Tab_FundMngFeeBook.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L53-89: 위 = 툴바(기준년월 YYYY.MM · 펀드 350 "전체" · 검색 200 "펀드/수탁사" · 조회), 아래 = 그리드(행번호 + 7열, 체크박스 없음) + 페이징 툴바(100)
 * X24 `Icam12_Tab_OfficeMngFeeBook`의 짝 — 같은 `icam/fee-books` API에 펀드 조건(fundCode)을 더했다. 대사 단추는 없다
 * 함께: Icam10_Lookup_FundCode(펀드 조회창, X29)
 * 스타일: SG (조회 툴바 + 그리드 하나 — yunhee 판별은 비어 있는 update/insertRow/deleteRow 때문에 CG로 나오지만 편집 그리드가 아니다, X23과 같음). 견본 docs/page-style/SG/Tdm01_Tab_Hr.tsx
 * UX보강(10): 툴바 = SearchBar(UX-01). 조건이 3개지만 펀드 칸이 350이라 줄바꿈을 피하려고 초기화(UX-02)는 넣지 않는다
 * 버튼 type: 조회 `search`
 */
import React, { useCallback, useRef, useState } from 'react';
import { message } from 'antd';
import dayjs from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { icamApi } from '@/api/icam';
import { errorMessage } from '@/api/client';
import { IcamFeeBook, IcamFeeFund } from '@/types/icam';
import { PagingToolBar, SingleGrid, gbFor } from '@/components/grid';
import { LookupInput } from '@/components/lookup/LookupInput';
import { SearchBar } from '@/components/search';
import { Icam10_Lookup_FundCode } from './Icam10_Lookup_FundCode';

const LIMIT = 100;   // gridToolBar.setToolBar(100)
const gb = gbFor<IcamFeeBook>();

/** AS-IS buildGrid() L151-165 */
const columnDefs = [
  gb.date('stdDate', 100, '기준일'),
  gb.textCenter('fundCode', 70, '펀드코드'),
  gb.text('fundName', 400, '펀드명'),
  gb.long('fee', 120, '누적보수'),
  gb.text('consignmentName', 150, '수탁사'),
  gb.textCenter('workDateString', 150, '생성일시'),
  gb.textCenter('worker', 150, '생성자'),
];

/** AS-IS getDate(type) L208-218: yyyyMM의 '-'를 '.'로 바꿔 그 달 1일("firstDay") 또는 말일("lastDay") */
function getDate(yyyyMM: string, type: 'firstDay' | 'lastDay'): string | null {
  const d = dayjs(yyyyMM.replace(/-/g, '.').replace(/\./g, '-') + '-01', 'YYYY-MM-DD', true);
  if (!d.isValid()) return null;
  return (type === 'lastDay' ? d.endOf('month') : d).format('YYYY-MM-DD');
}

interface Condition {
  stdDate: string;
  fundCode: string | null;
  searchText: string;
}

// [E0] 화면 열림 (생성자 L53-89) → setting() L91-149: 기준년월 기본 지난달(YYYY.MM), 펀드 "전체", 검색칸 안내 "펀드/수탁사". 열 때 조회하지 않는다
export const Icam12_Tab_FundMngFeeBook: React.FC = () => {
  const gridRef = useRef<AgGridReact<IcamFeeBook>>(null);
  // setting() L93-100: 기본값 = 지난달 (이번 달 1일 - 1일)
  const [yyyyMM, setYyyyMM] = useState(() => dayjs().startOf('month').subtract(1, 'day').format('YYYY.MM'));
  const [fundCode, setFundCode] = useState<string | null>(null);
  const [fundName, setFundName] = useState('');
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<IcamFeeBook[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fundStdDate, setFundStdDate] = useState<string | null>(null);
  /** 조회한 때의 조건 — 페이지를 넘길 때 같은 조건으로 (gridToolBar.addParam) */
  const cond = useRef<Condition | null>(null);
  /** 조회 뒤 그리드가 행을 채우면 첫 행을 선택한다 (L185-189) */
  const selectFirst = useRef(false);

  // GridPagingLoader.getPaging(): 저장된 조건 + offset·limit → 목록·전체 건수
  const getPaging = useCallback(async (p: number) => {
    const c = cond.current;
    if (!c) return;
    setLoading(true);  // grid.mask("Loading")
    try {
      const res = await icamApi.searchFeeBooks({ ...c, offset: (p - 1) * LIMIT, limit: LIMIT });
      selectFirst.current = true;
      setRows(res.rows);
      setTotal(res.total);
      setPage(p);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);  // grid.unmask()
    }
  }, []);

  // [E1] yyyyMM.KeyPress [Enter] (L100)·[E3] searchTextField.KeyPress [Enter] (L134)·[E4] retrieveButton[조회].Select (L143) → retrieve() L168-194
  // 기준년월이 비면 "기준년월(YYYY.MM)을 입력해주세요." → 조건(말일·펀드·검색어) 저장 → 1페이지부터 조회, 행이 있으면 첫 행 선택
  const retrieve = useCallback(async () => {
    if (!yyyyMM.trim()) {
      message.info('기준년월(YYYY.MM)을 입력해주세요.');
      return;
    }
    const stdDate = getDate(yyyyMM.trim(), 'lastDay');
    if (!stdDate) {
      message.info('기준년월은 YYYY.MM 형식으로 입력해주세요.');
      return;
    }
    cond.current = { stdDate, fundCode, searchText };
    await getPaging(1);
  }, [yyyyMM, fundCode, searchText, getPaging]);

  // [E2] fundName.TriggerClick (L112) → Icam10_Lookup_FundCode.open(getDate("firstDay"), callback): 고르면 코드·"코드 이름", [전체]면 둘 다 비운다
  const openFund = () => {
    const stdDate = getDate(yyyyMM.trim(), 'firstDay');
    if (!stdDate) {
      message.info(yyyyMM.trim() ? '기준년월은 YYYY.MM 형식으로 입력해주세요.' : '기준년월(YYYY.MM)을 입력해주세요.');
      return;
    }
    setFundStdDate(stdDate);
  };
  const onFundResult = (fund: IcamFeeFund | null) => {
    setFundCode(fund ? fund.fundCode : null);
    setFundName(fund ? `${fund.fundCode} ${fund.fundName ?? ''}` : '');
  };

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <SearchBar onSearch={retrieve}>
          <SearchBar.Field label="기준년월">
            <SearchBar.Input style={{ width: 100 }} placeholder="YYYY.MM" value={yyyyMM} onChange={e => setYyyyMM(e.target.value)} />
          </SearchBar.Field>
          <SearchBar.Field label="펀드">
            <LookupInput width={350} value={fundName} placeholder="전체" onOpen={openFund} onClear={() => onFundResult(null)} />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 200 }} placeholder="펀드/수탁사" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<IcamFeeBook>
            gridRef={gridRef}
            rowData={rows}
            loading={loading}
            columnDefs={columnDefs}
            getRowId={p => `${p.data.icamCompanyCode}|${p.data.fundCode}|${p.data.stdDate}`}
            onRowDataUpdated={e => {
              if (selectFirst.current) {
                selectFirst.current = false;
                e.api.getDisplayedRowAtIndex(0)?.setSelected(true, true);
              }
            }}
          />
        </div>
        <PagingToolBar page={page} limit={LIMIT} total={total} loading={loading} onChange={getPaging} />
      </div>
      <Icam10_Lookup_FundCode open={fundStdDate !== null} stdDate={fundStdDate ?? ''} onResult={onFundResult} onClose={() => setFundStdDate(null)} />
    </div>
  );
};
