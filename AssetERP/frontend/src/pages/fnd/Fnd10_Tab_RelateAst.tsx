/**
 * [1123] 펀드관리 > 02. 펀드관리 > 펀드별 자산 조회(ICAM) (P09)
 * AS-IS: myApp/client/vi/fnd/Fnd10_Tab_RelateAst.java (203줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L59-90: 여백 20 안의 테두리 박스 = 툴바(50) + 왼쪽 펀드 그리드 40% / 오른쪽 자산 그리드 60%
 * 열 때 기준일을 전 영업일로 채우고 곧바로 조회한다(settings → Sys12_Calendar.selectBizDate). 조회가 끝나면 첫 행을 고른다
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 원본에 없어 넣지 않는다
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { fndApi } from '@/api/fnd';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { BookRelateAst, FundRelate } from '@/types/fnd';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';

const gb = gbFor<FundRelate>();
const gbBook = gbFor<BookRelateAst>();
const DATE_FORMAT = 'YYYY-MM-DD';
/** ComboBoxField("FundType", null, "전체") — 전체의 코드는 null이라 서버에는 보내지 않는다. 화면 값은 빈 글자 */
const ALL_CODE: [string, string] = ['', '전체'];
/** setChecked 없음 → 단일 선택. 렌더마다 새 객체를 주면 선택이 풀리므로 한 번만 만든다 */
const SINGLE_ROW = { mode: 'singleRow', checkboxes: false, enableClickSelection: true } as const;

export const Fnd10_Tab_RelateAst: React.FC = () => {
  // [E0] 화면 열림 (생성자 L59-90) → settings() L92-148: 기준일 100·펀드구분 100("전체")·검색칸 150(빈칸 글자 "펀드코드/명")
  const [baseDate, setBaseDate] = useState<Dayjs>(() => dayjs());
  const [fundType, setFundType] = useState('');
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<FundRelate[]>([]);
  const [bookRows, setBookRows] = useState<BookRelateAst[]>([]);
  const [loading, setLoading] = useState(false);
  const retrieveSeq = useRef(0);
  const bookSeq = useRef(0);
  /** 마지막 조회에 쓴 기준일 — 자산 조회는 baseDate.getValue()를 읽는 시점의 값 */
  const baseDateRef = useRef(baseDate);
  baseDateRef.current = baseDate;

  // retrieve() L172-190: fnd.Fnd01_FundCode.selectByCompanyId (내 조직·기준일·펀드구분·검색어)
  const retrieve = async (date: Dayjs = baseDate, type: string = fundType) => {
    const my = ++retrieveSeq.current;
    setLoading(true);  // fndGrid.mask("Loading")
    try {
      const list = await fndApi.searchFundRelate({ stdDate: date.format(DATE_FORMAT), fundType: type || undefined, searchText });
      if (my !== retrieveSeq.current) return;
      setRows(list);  // 조회가 끝나면 첫 행을 고른다(onRowDataUpdated). 목록이 비어도 자산 그리드는 그대로 둔다(원본)
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      if (my === retrieveSeq.current) setLoading(false);
    }
  };

  // [E4] fndGrid.SelectionChanged [선택>0] (L132) → retrieve(selectModel) L192-198: fnd.Fnd10_Book.selectByRelateAst (회사·펀드·기준일)
  const retrieveBook = async (row: FundRelate) => {
    const my = ++bookSeq.current;
    try {
      const list = await fndApi.searchBookRelateAst({ fundCodeId: row.fundCodeId, stdDate: baseDateRef.current.format(DATE_FORMAT) });
      if (my === bookSeq.current) setBookRows(list);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // settings() L92-148: sys.Sys12_Calendar.selectBizDate(오늘, "-1") → 기준일 = 전 영업일 → retrieve()
  useEffect(() => {
    let alive = true;
    (async () => {
      let date = dayjs();
      try {
        date = dayjs(await sysApi.getBizDate(date.format(DATE_FORMAT), '-1'));
      } catch (err) {
        message.error(errorMessage(err, '기준일 조회 실패'));
        return;
      }
      if (!alive) return;
      setBaseDate(date);
      void retrieve(date);
    })();
    return () => { alive = false; };
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // buildFndGrid() L150-157 (행번호, 단일 선택)
  const columnDefs = useMemo(() => [
    gb.textCenter('fundCode', 150, '펀드코드'),  // L153
    gb.text('fundName', 400, '펀드명'),  // L154
  ], []);

  // buildBookGrid() L159-170 (행번호, 단일 선택)
  const bookColumnDefs = useMemo(() => [
    gbBook.text('itemCode', 150, '종목코드'),  // L163
    gbBook.text('note', 550, '종목명'),  // L165
    gbBook.long('evalAmt', 120, '평가금액'),  // L166
  ], []);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
        {/* [E5] retrieveButton[조회].Select (L142) · [E3] searchText.KeyPress [Enter] (L123) → retrieve() */}
        <SearchBar onSearch={() => void retrieve()} loading={loading}>
          <SearchBar.Field label="기준일">
            <DatePicker style={{ width: 100 }} allowClear={false} value={baseDate} onChange={d => d && setBaseDate(d)} />
          </SearchBar.Field>
          <SearchBar.Field label="펀드구분">
            {/* [E1] fundTypeComboBox (ComboBoxField).callbackOnCreate (L52) → "전체" 선택 · [E2] fundTypeComboBox[FundType].Collapse (L114) → retrieve() */}
            <SystemCodeComboBox
              kindCd="FundType"
              altCode={ALL_CODE}
              style={{ width: 100 }}
              value={fundType}
              onChange={c => { const v = c ?? ''; setFundType(v); void retrieve(baseDate, v); }}
            />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 150 }} placeholder="펀드코드/명" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0, display: 'flex', marginTop: 8}}>
          <div style={{ width: '40%', height: '100%' }}>
            <SingleGrid<FundRelate>
              rowData={rows}
              columnDefs={columnDefs}
              getRowId={p => String(p.data.fundCodeId)}
              loading={loading}
              rowSelection={SINGLE_ROW}
              onRowDataUpdated={e => { e.api.deselectAll(); e.api.getDisplayedRowAtIndex(0)?.setSelected(true); }}
              onSelectionChanged={e => {
                const sel = e.api.getSelectedRows();
                if (sel.length > 0) void retrieveBook(sel[0]);
              }}
            />
          </div>
          <div style={{ width: '60%', height: '100%', borderLeft: '1px solid #d9d9d9', boxSizing: 'border-box' }}>
            <SingleGrid<BookRelateAst>
              rowData={bookRows}
              columnDefs={bookColumnDefs}
              getRowId={p => String(p.data.bookId)}
              rowSelection={SINGLE_ROW}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
