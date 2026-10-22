/**
 * 내부통제내역 현황(준감인) (K07) — 준법감시 > 30. 내부통제 체크리스트 > 내부통제내역 현황(준감인) #1231
 * AS-IS: myApp/client/vi/ics/Ics15_Tab_ChecklistStatus.java (318줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L60-91: center = vlc = 툴바(조회년도 · 대분류 · 중분류 · 검색 · [가져오기] · 안내 글) / 그리드(체크리스트별 월(분기)별 체크·확인 현황).
 * 체크주기가 월(M)이면 1~12월 열, 분기(Q)이면 1~4분기 열만 보인다(setColumnHidden L249-272). 열 때 자동 조회는 없다(원본 그대로).
 * '월'·'분기' 칸을 더블클릭하면 그 달(분기)의 상세 조회창(Ics15_Lookup_ChecklistStatusDetail)이 열린다.
 * UX보강(10): 툴바 = SearchBar(UX-01)
 */
import React, { useEffect, useRef, useState } from 'react';
import { message, Select, Space, Typography } from 'antd';
import type { CellDoubleClickedEvent } from 'ag-grid-community';
import { icsApi } from '@/api/ics';
import { errorMessage } from '@/api/client';
import { IcsChecklistClassCode, IcsChecklistStatus } from '@/types/ics';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { Ics15_Lookup_ChecklistStatusDetail, ChecklistStatusDetailTarget } from './Ics15_Lookup_ChecklistStatusDetail';

const gb = gbFor<IcsChecklistStatus>();
const ALL = '%';  // 대분류·중분류 "전체"
const QUARTER_MONTH = [3, 6, 9, 12];  // 1~4분기 칸 = 3·6·9·12번째 월 칸 (원본 string13·16·19·22)

export const Ics15_Tab_ChecklistStatus: React.FC = () => {
  const [cycleType, setCycleType] = useState<string | null>(null);  // settings() L93-: 회사 체크주기 (설정이 없으면 null — 열을 숨기지 않는다)
  const [year, setYear] = useState(String(new Date().getFullYear()));  // yyyyText 기본값: 올해
  const [lClass, setLClass] = useState(ALL);
  const [mClass, setMClass] = useState(ALL);
  const [searchText, setSearchText] = useState('');
  const [lCodes, setLCodes] = useState<IcsChecklistClassCode[]>([]);
  const [mCodes, setMCodes] = useState<IcsChecklistClassCode[]>([]);
  const [rows, setRows] = useState<IcsChecklistStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState<ChecklistStatusDetailTarget | null>(null);
  // 조회한 때의 조건 — 더블클릭 상세는 화면에 표시된 결과의 년도·체크주기로 연다
  const loaded = useRef({ year, cycleType });
  const view = useRef({ year, cycleType, lClass, mClass, searchText });
  view.current = { year, cycleType, lClass, mClass, searchText };

  // [E0] 화면 열림 (생성자 L60-91) → settings(): 체크주기를 읽고 대분류 콤보를 채운다
  useEffect(() => {
    icsApi.getChecklistWriteCycleType().then(c => setCycleType(c === 'M' || c === 'Q' ? c : null)).catch(err => message.error(errorMessage(err, '조회 실패')));
    icsApi.searchChecklistMCodes(null).then(setMCodes).catch(() => undefined);
  }, []);

  /** getDate() L307-309: 조회년도의 1월 1일 — 콤보 목록의 기준일. 년도를 읽을 수 없으면 null (원본은 파싱 예외) */
  const comboDate = (y: string) => (/^\d{4}$/.test(y.trim()) ? `${y.trim()}-01-01` : null);

  // [E2] yyyyText.ValueChange (L118) → getDate(): 조회년도가 바뀌면 그 년도 기준으로 대분류 콤보를 다시 읽는다
  useEffect(() => {
    const d = comboDate(year);
    if (!d) return;
    icsApi.searchChecklistLCodes(d).then(setLCodes).catch(err => message.error(errorMessage(err, '조회 실패')));
  }, [year]);

  // [E1] yyyyText.KeyPress [Enter] (L110) · [E4] icsChecklistMComboBox.Collapse (L166) · [E5] searchText.KeyPress [Enter] (L175)
  // · [E6] retrieveButton[가져오기].Select (L184) → retrieve() L274-305: sys.Sys99_Print.insertIcsCheckListStatus (조회년도, 체크주기, 대분류·중분류, 검색어)
  const retrieve = async (over?: { m?: string }) => {
    const v = view.current;
    if (!/^\d{4}$/.test(v.year.trim())) { message.warning('조회년도를 4자리 숫자로 입력하세요.'); return; }
    const m = over?.m ?? v.mClass;
    setLoading(true);  // grid.mask("Loading")
    try {
      const list = await icsApi.searchChecklistStatus({
        year: v.year.trim(),
        cycleType: v.cycleType ?? '',
        checklistLClassId: v.lClass === ALL ? null : Number(v.lClass),
        checklistMClassId: m === ALL ? null : Number(m),
        searchText: v.searchText,
      });
      loaded.current = { year: v.year.trim(), cycleType: v.cycleType };
      setRows(list);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);  // grid.unmask()
    }
  };

  // [E3] icsChecklistLComboBox[sys.Sys09_Code.selectByIcs21].Collapse (L148) → refreshCode() L207-218:
  //   중분류를 "전체"로 되돌리고 고른 대분류의 중분류 콤보를 다시 읽는다(조회는 하지 않는다 — K06과 다르다)
  const refreshCode = async (l: string) => {
    setLClass(l);
    setMClass(ALL);
    const d = comboDate(view.current.year);
    try {
      setMCodes(await icsApi.searchChecklistMCodes(l === ALL ? null : Number(l), d ?? undefined));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E7] grid.CellDoubleClick [event.getCellIndex() > 3] (L191) → 인라인 L191-204: 월·분기 칸이면 그 칸의 월(분기)·체크리스트로 상세 조회창을 연다
  const onCellDoubleClicked = (e: CellDoubleClickedEvent<IcsChecklistStatus>) => {
    const colId = e.column.getColId();
    if (!e.data || !/^[mq]\d+$/.test(colId)) return;
    const n = Number(colId.slice(1));
    setDetail({
      year: loaded.current.year,
      period: colId[0] === 'm' ? String(n).padStart(2, '0') : String(n),
      cycleType: loaded.current.cycleType ?? '',
      checklistId: e.data.checklistId,
    });
  };

  // buildGrid() L220-247 + setColumnHidden() L249-272 — 열 순서·폭·제목은 원본 그대로. M이면 분기 열, Q이면 월 열을 숨기고 체크대상을 700으로 넓힌다
  const monthCols = Array.from({ length: 12 }, (_, i) =>
    gb.textCenter('months', 70, `${i + 1}월`, { colId: `m${i + 1}`, valueGetter: p => p.data?.months[i] }));
  const quarterCols = QUARTER_MONTH.map((m, i) =>
    gb.textCenter('months', 100, `${i + 1}분기`, { colId: `q${i + 1}`, valueGetter: p => p.data?.months[m - 1] }));
  const columnDefs = [
    gb.text('checkLClassName', 180, '대분류'),
    gb.text('checkMClassName', 230, '중분류'),
    gb.textArea('content', cycleType === 'Q' ? 700 : 500, '체크대상'),
    ...(cycleType === 'Q' ? [] : monthCols),
    ...(cycleType === 'M' ? [] : quarterCols),
  ];

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box' }}>
      <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box', padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <SearchBar onSearch={() => { void retrieve(); }} searchText="가져오기" loading={loading}
          extra={<Typography.Text type="secondary">※ 선택한 행의 '월' 또는 '분기' 더블클릭시 상세내역 확인이 가능합니다.</Typography.Text>}>
          <SearchBar.Field label="조회년도">
            <Space size={6}>
              <SearchBar.Input style={{ width: 60 }} maxLength={4} allowClear={false} value={year} onChange={e => setYear(e.target.value)} />
            </Space>
          </SearchBar.Field>
          <SearchBar.Field label="대분류">
            <Select style={{ width: 180 }} value={lClass} onChange={v => { void refreshCode(v); }}
              options={[{ value: ALL, label: '전체' }, ...lCodes.map(c => ({ value: c.code, label: c.name }))]} />
          </SearchBar.Field>
          <SearchBar.Field label="중분류">
            <Select style={{ width: 230 }} value={mClass} onChange={v => { setMClass(v); void retrieve({ m: v }); }}
              options={[{ value: ALL, label: '전체' }, ...mCodes.map(c => ({ value: c.code, label: c.name }))]} />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 250 }} placeholder="대분류/중분류/체크대상" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<IcsChecklistStatus>
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => `${p.data.checklistId}-${p.data.checkLClassName}-${p.data.checkMClassName}`}
            loading={loading}
            onCellDoubleClicked={onCellDoubleClicked}
          />
        </div>
      </div>
      {/* 상세 조회창 */}
      <Ics15_Lookup_ChecklistStatusDetail target={detail} onClose={() => setDetail(null)} />
    </div>
  );
};
