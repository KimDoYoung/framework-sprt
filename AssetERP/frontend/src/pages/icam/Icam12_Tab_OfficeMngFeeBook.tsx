/**
 * [1200] 관리회계 > 30. 사무보수관리 > ICAM 펀드보수 월말잔액 (X24)
 * AS-IS: myApp/client/vi/icam/Icam12_Tab_OfficeMngFeeBook.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L46-80: 위 = 툴바(기준년월 YYYY.MM · 검색 운용사/펀드/수탁사 250 · 조회 · ICAM 월말잔액 대사), 아래 = 그리드(행번호 + 11열, 체크박스 없음) + 페이징 툴바(100)
 * 함께: Icam13_Lookup_FeeBookCheck(월말잔액 대사 창)
 * 스타일: SG (조회 툴바 + 그리드 하나 — yunhee 판별은 비어 있는 update/insertRow/deleteRow 때문에 CG로 나오지만 편집 그리드가 아니다, X23과 같음). 견본 docs/page-style/SG/Tdm01_Tab_Hr.tsx
 * UX보강(10): 툴바 = SearchBar(UX-01). 조건이 2개라 초기화(UX-02)는 넣지 않는다
 * 버튼 type: 조회 `search`, ICAM 월말잔액 대사 = `register`(원본 사용된 버튼 목록 그대로)
 */
import React, { useCallback, useRef, useState } from 'react';
import { message } from 'antd';
import dayjs from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { icamApi } from '@/api/icam';
import { errorMessage } from '@/api/client';
import { IcamFeeBook } from '@/types/icam';
import { Button } from '@/components/button';
import { PagingToolBar, SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { Icam13_Lookup_FeeBookCheck } from './Icam13_Lookup_FeeBookCheck';

const LIMIT = 100;   // gridToolBar.setToolBar(100)
const gb = gbFor<IcamFeeBook>();

/** AS-IS buildGrid() L126-144 */
const columnDefs = [
  gb.date('stdDate', 100, '기준일'),
  gb.textCenter('icamCompanyCode', 70, '운용사코드'),
  gb.text('icamCompanyName', 200, '운용사명'),
  gb.textCenter('fundCode', 70, '펀드코드'),
  gb.text('fundName', 400, '펀드명'),
  gb.textCenter('curCode', 55, '통화'),
  gb.double('forFee', 120, '누적보수(기준통화)'),
  gb.long('fee', 120, '누적보수(KRW)'),
  gb.text('consignmentName', 150, '수탁사'),
  gb.textCenter('workDateString', 150, '생성일시'),
  gb.textCenter('worker', 150, '생성자'),
];

/** AS-IS getStdDate() L174-180: yyyyMM의 '-'를 '.'로 바꿔 그 달 말일 */
function getStdDate(yyyyMM: string): string | null {
  const d = dayjs(yyyyMM.replace(/-/g, '.').replace(/\./g, '-') + '-01', 'YYYY-MM-DD', true);
  return d.isValid() ? d.endOf('month').format('YYYY-MM-DD') : null;
}

interface Condition {
  stdDate: string;
  searchText: string;
}

// [E0] 화면 열림 (생성자 L46-80) → setting() L82-124: 기준년월 기본 지난달(YYYY.MM, 폭 100), 검색칸 안내 "운용사/펀드/수탁사". 열 때 조회하지 않는다
export const Icam12_Tab_OfficeMngFeeBook: React.FC = () => {
  const gridRef = useRef<AgGridReact<IcamFeeBook>>(null);
  // setting() L82-90: 기본값 = 지난달 (이번 달 1일 - 1일)
  const [yyyyMM, setYyyyMM] = useState(() => dayjs().startOf('month').subtract(1, 'day').format('YYYY.MM'));
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<IcamFeeBook[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [checkStdDate, setCheckStdDate] = useState<string | null>(null);
  /** 조회한 때의 조건 — 페이지를 넘길 때 같은 조건으로 (gridToolBar.addParam) */
  const cond = useRef<Condition | null>(null);
  /** 조회 뒤 그리드가 행을 채우면 첫 행을 선택한다 (L163-167) */
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

  // [E1] yyyyMM.KeyPress [Enter] (L91)·[E2] searchTextField.KeyPress [Enter] (L102)·[E3] retrieveButton[조회].Select (L111) → retrieve() L147-172
  // 기준년월이 비면 "기준년월을 입력해주세요." → 조건 저장 → 1페이지부터 조회, 행이 있으면 첫 행 선택
  const retrieve = useCallback(async () => {
    if (!yyyyMM.trim()) {
      message.info('기준년월을 입력해주세요.');
      return;
    }
    const stdDate = getStdDate(yyyyMM.trim());
    if (!stdDate) {
      message.info('기준년월은 YYYY.MM 형식으로 입력해주세요.');
      return;
    }
    cond.current = { stdDate, searchText };
    await getPaging(1);
  }, [yyyyMM, searchText, getPaging]);

  // [E4] checkButton[ICAM 월말잔액 대사].Select (L117) → Icam13_Lookup_FeeBookCheck.open(getStdDate())
  const openCheck = () => {
    const stdDate = getStdDate(yyyyMM.trim());
    if (!stdDate) {
      message.info(yyyyMM.trim() ? '기준년월은 YYYY.MM 형식으로 입력해주세요.' : '기준년월을 입력해주세요.');
      return;
    }
    setCheckStdDate(stdDate);
  };

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', padding: 10, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <SearchBar
          onSearch={retrieve}
          extra={<Button type="register" onClick={openCheck}>ICAM 월말잔액 대사</Button>}
        >
          <SearchBar.Field label="기준년월">
            <SearchBar.Input style={{ width: 100 }} placeholder="YYYY.MM" value={yyyyMM} onChange={e => setYyyyMM(e.target.value)} />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 250 }} placeholder="운용사/펀드/수탁사" value={searchText} onChange={e => setSearchText(e.target.value)} />
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
      <Icam13_Lookup_FeeBookCheck stdDate={checkStdDate} onClose={() => setCheckStdDate(null)} />
    </div>
  );
};
