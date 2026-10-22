/**
 * 내부통제내역 상세(준감인) (K08) — 준법감시 > 30. 내부통제 체크리스트 > 내부통제내역 상세(준감인) #1235
 * AS-IS: myApp/client/vi/ics/Ics15_Tab_ChecklistStatusDetail.java (524줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L79-119: center = vlc = 툴바 1줄(기준 분기(월) · 대분류 · 중분류 · 검색 · 미제출 보기 · 미확인 보기 · [조회][출력/다운로드])
 * / 단일 선택 그리드 + 페이징(100). K06(확인)과 같은 목록이지만 확인자 조건이 없어 회사 전체를 보고, [확인]·[확인취소]·[상신]이 없으며 확인자 열이 있다.
 * 열 때 자동 조회는 없다(K06과 같게). [출력/다운로드]는 RD 뷰어 대신 xlsx를 받는다.
 * UX보강(10): 툴바 = SearchBar(UX-01)
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Checkbox, message, Select, Space } from 'antd';
import { icsApi } from '@/api/ics';
import { errorMessage } from '@/api/client';
import { ChecklistConfirmParams, IcsChecklistClassCode, IcsChecklistStatusDetail } from '@/types/ics';
import { PagingToolBar, SingleGrid, gbFor, iconCell } from '@/components/grid';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { SearchBar } from '@/components/search';
import { Ics10_Edit_Checklist, ChecklistEditTarget } from './Ics10_Edit_Checklist';
import { defaultPeriod, getDate } from './icsComplyPeriod';

const gb = gbFor<IcsChecklistStatusDetail>();
const LIMIT = 100;  // gridToolBar.setToolBar(100)
const ALL = '%';  // 대분류·중분류 "전체"

type Over = { l?: string; m?: string; unCheckYn?: boolean; unConfirmYn?: boolean };

export const Ics15_Tab_ChecklistStatusDetail: React.FC = () => {
  const [cycleType, setCycleType] = useState<string | null>(null);  // enable(cycleType) — null이면 화면 비활성
  const [year, setYear] = useState('');
  const [period, setPeriod] = useState('');
  const [lClass, setLClass] = useState(ALL);
  const [mClass, setMClass] = useState(ALL);
  const [searchText, setSearchText] = useState('');
  const [unCheckYn, setUnCheckYn] = useState(false);  // "미제출 보기"
  const [unConfirmYn, setUnConfirmYn] = useState(false);  // "미확인 보기"
  const [lCodes, setLCodes] = useState<IcsChecklistClassCode[]>([]);
  const [mCodes, setMCodes] = useState<IcsChecklistClassCode[]>([]);
  const [rows, setRows] = useState<IcsChecklistStatusDetail[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [viewTarget, setViewTarget] = useState<ChecklistEditTarget | null>(null);
  const view = useRef({ cycleType, year, period, lClass, mClass, searchText, unCheckYn, unConfirmYn });
  view.current = { cycleType, year, period, lClass, mClass, searchText, unCheckYn, unConfirmYn };
  /** gridToolBar.addParam(…) — 페이지를 넘길 때는 마지막 조회 조건을 쓴다(GridPagingLoader) */
  const paramRef = useRef<ChecklistConfirmParams | undefined>(undefined);

  // [E0] 화면 열림 (생성자 L79-119) → settings()
  // settings() L121-328 / enable() L348-411: 체크주기를 읽어 콤보 종류와 기준 분기(월)를 정한다. 설정이 없으면 안내하고 화면을 끈다
  useEffect(() => {
    icsApi.getChecklistWriteCycleType().then(c => {
      if (c === 'M' || c === 'Q') {
        const d = defaultPeriod(c);
        setCycleType(c); setYear(String(d.year)); setPeriod(d.period);
      } else {
        message.warning('체크주기가 설정되어있지않습니다. 관리자에게 연락해주세요');
      }
    }).catch(err => message.error(errorMessage(err, '조회 실패')));
    icsApi.searchChecklistMCodes(null).then(setMCodes).catch(() => undefined);
  }, []);

  const enabled = cycleType != null && period !== '';

  /** getDate() L494-515: 기준 분기(월)의 말일 */
  const stdDate = () => (view.current.cycleType == null ? null : getDate(view.current.year, view.current.period, view.current.cycleType)?.format('YYYY-MM-DD') ?? null);

  // [E2] yyyyText.ValueChange (L158) / [E3] periodComboBox[MonthsCode].ValueChange (L172) → getDate(): 기준이 바뀌면 그 기준일로 대분류 콤보를 다시 읽는다(조회는 안 함)
  useEffect(() => {
    const d = cycleType == null ? null : getDate(year, period, cycleType)?.format('YYYY-MM-DD');
    if (cycleType != null && period !== '' && !d) return;
    icsApi.searchChecklistLCodes(d ?? undefined).then(setLCodes).catch(err => message.error(errorMessage(err, '조회 실패')));
  }, [cycleType, year, period]);

  // GridPagingLoader.getPaging(): 저장된 조건 + offset·limit → 목록·전체 건수
  const getPaging = useCallback(async (p: number) => {
    if (!paramRef.current) return;
    setLoading(true);  // grid.mask("Loading")
    try {
      const res = await icsApi.searchChecklistStatusDetails({ ...paramRef.current, offset: (p - 1) * LIMIT, limit: LIMIT });
      setRows(res.rows);
      setTotal(res.total);
      setPage(p);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);  // grid.unmask()
    }
  }, []);

  /** 화면의 조건으로 조회 조건을 만든다 — retrieve()·[출력/다운로드]가 같이 쓴다. over는 방금 바뀐 값(상태에 아직 반영 전) */
  const buildParams = (over?: Over): ChecklistConfirmParams | null => {
    const v = view.current;
    const std = stdDate();
    if (!std) { message.warning('기준년도를 4자리 숫자로 입력하세요.'); return null; }
    const l = over?.l ?? v.lClass;
    const m = over?.m ?? v.mClass;
    return {
      stdDate: std,
      cycleType: v.cycleType ?? 'M',
      checklistLClassId: l === ALL ? null : Number(l),
      checklistMClassId: m === ALL ? null : Number(m),
      searchText: v.searchText,
      unCheckYn: over?.unCheckYn ?? v.unCheckYn,
      unConfirmYn: over?.unConfirmYn ?? v.unConfirmYn,
    };
  };

  // [E1] yyyyText.KeyPress [Enter] (L150) · [E5] icsChecklistMComboBox[sys.Sys09_Code.selectByIcs23].Collapse (L219) · [E6] searchText.KeyPress [Enter] (L228)
  // · [E7] unCheckYn[미제출 보기].ValueChange (L239) · [E8] unConfirmYn[미확인 보기].ValueChange (L248) · [E9] retrieveButton[조회].Select (L255)
  // → retrieve() L443-492: 조건을 만들어 1페이지부터 읽는다
  const retrieve = useCallback(async (over?: Over) => {
    const params = buildParams(over);
    if (!params) return;
    paramRef.current = params;
    await getPaging(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getPaging]);

  // [E4] icsChecklistLComboBox[sys.Sys09_Code.selectByIcs21].Collapse (L201) → refreshCode() L330-346:
  //   중분류를 "전체"로 되돌리고 고른 대분류의 중분류 콤보를 다시 읽은 뒤 retrieve()
  const refreshCode = async (l: string) => {
    setLClass(l);
    setMClass(ALL);
    try {
      setMCodes(await icsApi.searchChecklistMCodes(l === ALL ? null : Number(l), stdDate() ?? undefined));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
    await retrieve({ l, m: ALL });
  };

  // [E10] downLoadButton[출력/다운로드].Select (L261): getDate() 뒤 sys.Sys99_Print.insertRdChecklistDetail → RD 뷰어 (RD 대신 xlsx로 받는다)
  const download = async () => {
    const params = buildParams();
    if (!params) return;
    setLoading(true);  // grid.mask("loading")
    try {
      await icsApi.downloadChecklistStatusDetailExcel(params, `내부통제내역 상세(${year} ${period})`);
    } catch (err) {
      message.error(errorMessage(err, '다운로드 실패'));
    } finally {
      setLoading(false);  // grid.unmask()
    }
  };

  // buildGrid() L413-441 — 열 순서·폭·제목은 원본 그대로
  const columnDefs = [
    gb.text('checkLClassName', 150, '대분류'),
    gb.text('checkMClassName', 200, '중분류'),
    gb.textArea('content', 500, '체크대상'),
    // View 아이콘: Ics10_Edit_Checklist.open(selectModel.getChecklistModel(), callback) — callback은 비어 있다(조회하지 않음)
    iconCell<IcsChecklistStatusDetail>('view', 'viewCell', 40, ' ', row => setViewTarget({ model: row })),
    gb.textArea('reason', 250, '체크결과'),
    gb.text('orgName', 100, '담당부서'),
    gb.textCenter('personName', 80, '담당자'),
    gb.booleanYn('fixYn', 50, '제출<br>여부'),
    gb.textCenter('confirmerName', 80, '확인자'),
    gb.booleanYn('confirmYn', 50, '확인<br>여부'),
  ];

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box' }}>
      <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box', padding: 10, display: 'flex', flexDirection: 'column', gap: 8,
        ...(cycleType == null ? { pointerEvents: 'none', opacity: 0.5 } : {}) }}>
        <SearchBar
          onSearch={() => retrieve()}
          disabled={!enabled}
          loading={loading}
          extra={<Button type="download" disabled={!enabled} onClick={download}>출력/다운로드</Button>}
        >
          <SearchBar.Field label="기준 분기(월)">
            <Space size={6}>
              <SearchBar.Input style={{ width: 60 }} maxLength={4} allowClear={false} value={year} onChange={e => setYear(e.target.value)} />
              {cycleType != null && (
                <SystemCodeComboBox
                  kindCd={cycleType === 'M' ? 'MonthsCode' : 'QuarterCode'}
                  style={{ width: 80 }}
                  allowClear={false}
                  value={period}
                  onChange={code => { if (code) setPeriod(code); }}
                />
              )}
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
            <SearchBar.Input style={{ width: 300 }} placeholder="대분류/중분류/체크대상/담당부서/담당자" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
          <Checkbox checked={unCheckYn} onChange={e => { setUnCheckYn(e.target.checked); void retrieve({ unCheckYn: e.target.checked }); }}>미제출 보기</Checkbox>
          <Checkbox checked={unConfirmYn} onChange={e => { setUnConfirmYn(e.target.checked); void retrieve({ unConfirmYn: e.target.checked }); }}>미확인 보기</Checkbox>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<IcsChecklistStatusDetail>
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => `${p.data.checklistId}-${p.data.personId}`}
            loading={loading}
            // retrieve(): 조회가 끝나면 첫 행을 고른다(grid.getSelectionModel().select(0, false))
            onRowDataUpdated={e => { e.api.getDisplayedRowAtIndex(0)?.setSelected(true); }}
          />
        </div>
        <PagingToolBar page={page} limit={LIMIT} total={total} loading={loading} onChange={getPaging} />
      </div>
      {/* 체크리스트 보기 창(읽기 전용) */}
      <Ics10_Edit_Checklist target={viewTarget} readOnly onClose={() => setViewTarget(null)} />
    </div>
  );
};
