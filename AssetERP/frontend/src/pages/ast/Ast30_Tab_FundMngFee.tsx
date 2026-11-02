/**
 * [1401] 관리회계 > 30. 펀드운용보수관리 > 펀드보수현황 (X32)
 * AS-IS: myApp/client/vi/ast/Ast30_Tab_FundMngFee.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L39-68: 위 = 툴바(기준일 100 · 검색 200 "펀드코드/펀드명" · [조회]), 아래 = 그리드 하나(행번호 + 6열, 체크박스 없음, 페이징 없음)
 * 열 때 setting(), retrieve() — 화면을 열면 곧바로 어제 기준으로 조회한다
 * 스타일: SG (견본 docs/page-style/SG/Tdm01_Tab_Hr.tsx)
 * UX보강(10): 툴바 = SearchBar(UX-01). 조건이 2개라 초기화(UX-02)는 넣지 않는다
 * 버튼 type: 조회 `search`
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { DatePicker, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { astApi } from '@/api/ast';
import { errorMessage } from '@/api/client';
import { AstBookFundFeeMonth } from '@/types/ast';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';

const FORMAT = 'YYYY-MM-DD';
const gb = gbFor<AstBookFundFeeMonth>();

/** AS-IS buildGrid() L97-107 */
const columnDefs = [
  gb.textCenter('fundCode', 100, '펀드코드'),  // L99
  gb.text('fundName', 400, '펀드명'),  // L100
  gb.long('preFee', 120, '전월 잔액'),  // L101
  gb.long('occFee', 120, '당월 발생액'),  // L102
  gb.long('drawFee', 120, '당월 인출액'),  // L103
  gb.long('fee', 120, '당월 잔액'),  // L104
];

export const Ast30_Tab_FundMngFee: React.FC = () => {
  // setting() L70-95: 기준일 어제
  const [stdDate, setStdDate] = useState<Dayjs>(() => dayjs().subtract(1, 'day'));
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<AstBookFundFeeMonth[]>([]);
  const [loading, setLoading] = useState(false);
  /** 조회 뒤 그리드가 행을 채우면 첫 행을 선택한다 (L117-119) */
  const selectFirst = useRef(false);

  // [E1] searchText.KeyPress [Enter] (L80)·[E2] retrieveButton[조회].Select (L89) → retrieve() L109-125
  const retrieve = useCallback(async () => {
    setLoading(true);  // grid.mask("Loading")
    try {
      const list = await astApi.searchBookFundFeeMonths({ stdDate: stdDate.format(FORMAT), searchText });
      selectFirst.current = true;
      setRows(list);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);  // grid.unmask()
    }
  }, [stdDate, searchText]);

  // [E0] 화면 열림 (생성자 L39-68) → setting(), retrieve()
  useEffect(() => { void retrieve(); }, []);   // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', padding: 10, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <SearchBar onSearch={retrieve} loading={loading}>
          <SearchBar.Field label="기준일">
            <DatePicker style={{ width: 120 }} allowClear={false} value={stdDate} onChange={d => d && setStdDate(d)} />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 200 }} placeholder="펀드코드/펀드명" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<AstBookFundFeeMonth>
            rowData={rows}
            loading={loading}
            columnDefs={columnDefs}
            getRowId={p => p.data.fundCode}
            onRowDataUpdated={e => {
              if (selectFirst.current) {
                selectFirst.current = false;
                e.api.getDisplayedRowAtIndex(0)?.setSelected(true, true);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};
