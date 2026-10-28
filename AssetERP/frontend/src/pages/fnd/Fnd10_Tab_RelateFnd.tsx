/**
 * [1124] 펀드관리 > 02. 펀드관리 > 자산별 펀드 조회(ICAM) (P10)
 * AS-IS: myApp/client/vi/fnd/Fnd10_Tab_RelateFnd.java (184줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L50-78: 여백 20 안의 테두리 박스 = 툴바(50) + 왼쪽 자산 그리드 60% / 오른쪽 펀드 그리드 40%
 * 열 때 기준일을 전 영업일로 채우고 곧바로 조회한다(settings → Sys12_Calendar.selectBizDate). 조회가 끝나면 첫 행을 고른다
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 원본에 없어 넣지 않는다
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { fndApi } from '@/api/fnd';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { AstAssetItem, BookRelateFnd } from '@/types/fnd';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';

const gb = gbFor<AstAssetItem>();
const gbBook = gbFor<BookRelateFnd>();
const DATE_FORMAT = 'YYYY-MM-DD';
/** setChecked 없음 → 단일 선택(체크 열 없음). 렌더마다 새 객체를 주면 선택이 풀리므로 한 번만 만든다 */
const SINGLE_ROW = { mode: 'singleRow', checkboxes: false, enableClickSelection: true } as const;

export const Fnd10_Tab_RelateFnd: React.FC = () => {
  // [E0] 화면 열림 (생성자 L50-78) → settings() L80-128: 기준일 100·검색칸 150
  const [baseDate, setBaseDate] = useState<Dayjs>(() => dayjs());
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<AstAssetItem[]>([]);
  const [bookRows, setBookRows] = useState<BookRelateFnd[]>([]);
  const [loading, setLoading] = useState(false);
  const retrieveSeq = useRef(0);
  const bookSeq = useRef(0);
  /** 펀드 조회는 baseDate.getValue()를 읽는 시점의 값 */
  const baseDateRef = useRef(baseDate);
  baseDateRef.current = baseDate;

  // [E1] searchText.KeyPress [Enter] (L103) · [E3] retrieveButton[조회].Select (L122) → retrieve() L148-165: ast.Ast01_ClassTree.selectByAssetType (assetType "2" = 운용자산)
  const retrieve = async (date: Dayjs = baseDate) => {
    const my = ++retrieveSeq.current;
    setLoading(true);  // astGrid.mask("Loading")
    try {
      const list = await fndApi.searchAstAssetItems({ stdDate: date.format(DATE_FORMAT), assetType: '2', searchText });
      if (my !== retrieveSeq.current) return;
      setRows(list);  // 조회가 끝나면 첫 행을 고른다(onRowDataUpdated). 목록이 비어도 펀드 그리드는 그대로 둔다(원본)
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      if (my === retrieveSeq.current) setLoading(false);
    }
  };

  // [E2] astGrid.SelectionChanged [선택>0] (L112) → retrieve(selectModel) L167-179: fnd.Fnd10_Book.selectByRelateFnd (회사·내 조직·종목·기준일)
  const retrieveBook = async (row: AstAssetItem) => {
    const my = ++bookSeq.current;
    try {
      const list = await fndApi.searchBookRelateFnd({ astClassTreeId: row.classTreeId, stdDate: baseDateRef.current.format(DATE_FORMAT) });
      if (my === bookSeq.current) setBookRows(list);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // settings() L80-128: sys.Sys12_Calendar.selectBizDate(오늘, "-1") → 기준일 = 전 영업일 → retrieve()
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

  // buildAstGrid() L130-137 (행번호, 단일 선택)
  const columnDefs = useMemo(() => [
    gb.text('isin', 150, '종목코드'),  // L133
    gb.text('classTreeFullName', 550, '종목명'),  // L134
  ], []);

  // buildBookGrid() L139-146 (행번호, 단일 선택)
  const bookColumnDefs = useMemo(() => [
    gbBook.textCenter('fundCode', 150, '펀드코드'),  // L143
    gbBook.text('fundName', 400, '펀드명'),  // L144
  ], []);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%',  boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
        <SearchBar onSearch={() => void retrieve()} loading={loading}>
          <SearchBar.Field label="기준일">
            <DatePicker style={{ width: 100 }} allowClear={false} value={baseDate} onChange={d => d && setBaseDate(d)} />
          </SearchBar.Field>
          <SearchBar.Field label="종목코드/명">
            <SearchBar.Input style={{ width: 150 }} value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0, display: 'flex', marginTop: 8 }}>
          <div style={{ width: '60%', height: '100%' }}>
            <SingleGrid<AstAssetItem>
              rowData={rows}
              columnDefs={columnDefs}
              getRowId={p => String(p.data.classTreeId)}
              loading={loading}
              rowSelection={SINGLE_ROW}
              onRowDataUpdated={e => { e.api.deselectAll(); e.api.getDisplayedRowAtIndex(0)?.setSelected(true); }}
              onSelectionChanged={e => {
                const sel = e.api.getSelectedRows();
                if (sel.length > 0) void retrieveBook(sel[0]);
              }}
            />
          </div>
          <div style={{ width: '40%', height: '100%', marginLeft: 5 }}>
            <SingleGrid<BookRelateFnd>
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
