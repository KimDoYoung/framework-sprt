/**
 * 내부통제내역 확인(부서장) (K06) — 준법감시 > 30. 내부통제 체크리스트 > 내부통제내역 확인(부서장) #1230
 * AS-IS: myApp/client/vi/ics/Ics15_Tab_ChecklistConfirm.java (626줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L92-141: center = vlc = 툴바 2줄(기준 분기(월) · 대분류 · 중분류 · [조회][출력/다운로드][확인][확인취소][상신] / 검색 · 미제출 보기 · 미확인 보기)
 * / 체크박스 다중 그리드 + 페이징(100). 로그인 사용자가 확인자인 직원 작성 내역을 확인·확인취소한다. 열 때 자동 조회는 없다(원본 그대로).
 * [출력/다운로드]는 RD 뷰어 대신 xlsx를 받는다. [상신]은 상신 조회창(Ics16_Lookup_RelateAppr)을 연다.
 * UX보강(10): 툴바 = SearchBar(UX-01)
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Checkbox, message, Modal, Select, Space } from 'antd';
import { icsApi } from '@/api/ics';
import { errorMessage } from '@/api/client';
import { ChecklistConfirmParams, IcsChecklistClassCode, IcsChecklistConfirm } from '@/types/ics';
import { MultiGrid, PagingToolBar, gbFor, iconCell } from '@/components/grid';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { SearchBar } from '@/components/search';
import { Ics10_Edit_Checklist, ChecklistEditTarget } from './Ics10_Edit_Checklist';
import { Ics16_Lookup_RelateAppr, RelateApprTarget } from './Ics16_Lookup_RelateAppr';
import { defaultPeriod, getDate } from './icsComplyPeriod';

const gb = gbFor<IcsChecklistConfirm>();
const LIMIT = 100;  // gridToolBar.setToolBar(100)
const ALL = '%';  // 대분류·중분류 "전체"

export const Ics15_Tab_ChecklistConfirm: React.FC = () => {
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
  const [rows, setRows] = useState<IcsChecklistConfirm[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [viewTarget, setViewTarget] = useState<ChecklistEditTarget | null>(null);
  const [apprTarget, setApprTarget] = useState<RelateApprTarget | null>(null);
  const checkedRef = useRef<IcsChecklistConfirm[]>([]);
  const view = useRef({ cycleType, year, period, lClass, mClass, searchText, unCheckYn, unConfirmYn });
  view.current = { cycleType, year, period, lClass, mClass, searchText, unCheckYn, unConfirmYn };
  /** gridToolBar.addParam(…) — 페이지를 넘길 때는 마지막 조회 조건을 쓴다(GridPagingLoader) */
  const paramRef = useRef<ChecklistConfirmParams | undefined>(undefined);

  // [E0] 화면 열림 (생성자 L92-141) → settings()
  // settings() L143-358 / enable() L378-437: 체크주기를 읽어 콤보 종류와 기준 분기(월)를 정한다. 설정이 없으면 안내하고 화면을 끈다
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

  /** getDate() L511-532: 기준 분기(월)의 말일 */
  const stdDate = () => (view.current.cycleType == null ? null : getDate(view.current.year, view.current.period, view.current.cycleType)?.format('YYYY-MM-DD') ?? null);

  // [E1] yyyyText.ValueChange (L170) / [E2] periodComboBox[MonthsCode].ValueChange (L184) → getDate(): 기준이 바뀌면 그 기준일로 대분류 콤보를 다시 읽는다
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
      const res = await icsApi.searchChecklistConfirms({ ...paramRef.current, offset: (p - 1) * LIMIT, limit: LIMIT });
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
  const buildParams = (over?: { l?: string; m?: string; unCheckYn?: boolean; unConfirmYn?: boolean }): ChecklistConfirmParams | null => {
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

  // [E4] icsChecklistMComboBox[sys.Sys09_Code.selectByIcs23].Collapse (L235) · [E5] searchText.KeyPress [Enter] (L244) · [E6] unCheckYn[미제출 보기].ValueChange (L255)
  // · [E7] unConfirmYn[미확인 보기].ValueChange (L264) · [E8] retrieveButton[조회].Select (L271) → retrieve() L469-509: 조건을 만들어 1페이지부터 읽는다
  const retrieve = useCallback(async (over?: { l?: string; m?: string; unCheckYn?: boolean; unConfirmYn?: boolean }) => {
    const params = buildParams(over);
    if (!params) return;
    paramRef.current = params;
    await getPaging(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getPaging]);

  // [E3] icsChecklistLComboBox[sys.Sys09_Code.selectByIcs21].Collapse (L217) → refreshCode() L360-376:
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

  // [E9] downLoadButton[출력/다운로드].Select (L277): getDate() 뒤 sys.Sys99_Print.insertRdChecklistConfirm → RD 뷰어 (RD 대신 xlsx로 받는다)
  const download = async () => {
    const params = buildParams();
    if (!params) return;
    setLoading(true);  // grid.mask("loading")
    try {
      await icsApi.downloadChecklistConfirmExcel(params, `내부통제내역 확인(${year} ${period})`);
    } catch (err) {
      message.error(errorMessage(err, '다운로드 실패'));
    } finally {
      setLoading(false);  // grid.unmask()
    }
  };

  // [E10] confirmButton[확인].Select (L340) / [E11] cancleButton[확인취소].Select (L346) → confirmChk() L534-577:
  //   고른 행이 없으면 안내, 있으면 HtmlMessageBox "확인"(폭 320). [E13]·[E14] msgBox.DialogHide [YES] (L543·L561) → confirm()
  const confirmChk = (check: boolean) => {
    const n = checkedRef.current.length;
    if (n === 0) { message.info('대상을 먼저 선택해주세요'); return; }
    Modal.confirm({
      title: '확인',
      content: `${n}건의 항목을 ${check ? '확인' : '확인취소'}하시겠습니까?`,
      okText: '예',
      cancelText: '아니오',
      width: 320,
      onOk: () => confirm(check),
    });
  };

  // confirm() L579-626: 제출 안 된 행이 있으면 안내. 아니면 ics.Ics15_ChecklistWrite.updateConfirmYn(확인자, 기준 달, 체크주기, 확인 여부) → retrieve()
  const confirm = async (check: boolean) => {
    const selected = checkedRef.current;
    if (selected.some(m => !m.fixYn)) { message.info('제출 전 체크대상이 포함되어 있습니다'); return; }
    const yyyymm = cycleType == null ? null : getDate(view.current.year, view.current.period, cycleType)?.format('YYYY.MM');
    if (!yyyymm) { message.warning('기준년도를 4자리 숫자로 입력하세요.'); return; }
    try {
      await icsApi.updateChecklistConfirm(check, yyyymm, cycleType ?? 'M', selected.map(m => ({ checklistId: m.checklistId, personId: m.personId })));
      await retrieve();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  // [E12] apprButton[상신].Select (L352) → listPopup() L609-617: Ics16_Lookup_RelateAppr.open(기준년도, 월/분기, 체크주기)
  const listPopup = () => {
    if (cycleType == null) return;
    setApprTarget({ year: view.current.year, period: view.current.period, cycleType });
  };

  // buildGrid() L439-467 — 열 순서·폭·제목은 원본 그대로
  const columnDefs = [
    gb.text('checkLClassName', 150, '대분류'),
    gb.text('checkMClassName', 200, '중분류'),
    gb.textArea('content', 550, '체크대상'),
    // View 아이콘: Ics10_Edit_Checklist.open(selectModel.getChecklistModel(), callback) — callback은 비어 있다(조회하지 않음)
    iconCell<IcsChecklistConfirm>('view', 'viewCell', 40, ' ', row => setViewTarget({ model: row })),
    gb.textArea('reason', 250, '체크결과'),
    gb.text('orgName', 100, '담당부서'),
    gb.text('personName', 80, '담당자'),
    gb.booleanYn('fixYn', 50, '제출<br>여부'),
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
          extra={
            <>
              <Button type="download" disabled={!enabled} onClick={download}>출력/다운로드</Button>
              <Button type="save" disabled={!enabled} onClick={() => confirmChk(true)}>확인</Button>
              <Button type="cancel" disabled={!enabled} onClick={() => confirmChk(false)}>확인취소</Button>
              <Button type="register" disabled={!enabled} onClick={listPopup}>상신</Button>
            </>
          }
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
          <MultiGrid<IcsChecklistConfirm>
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => `${p.data.checklistId}-${p.data.personId}`}
            loading={loading}
            onCheckedChange={r => { checkedRef.current = r; }}
            // retrieve(): 조회가 끝나면 첫 행을 고른다(grid.getSelectionModel().select(0, false))
            onRowDataUpdated={e => { e.api.getDisplayedRowAtIndex(0)?.setSelected(true); }}
          />
        </div>
        <PagingToolBar page={page} limit={LIMIT} total={total} loading={loading} onChange={getPaging} />
      </div>
      {/* 체크리스트 보기 창(읽기 전용) */}
      <Ics10_Edit_Checklist target={viewTarget} readOnly onClose={() => setViewTarget(null)} />
      {/* 상신 조회창 */}
      <Ics16_Lookup_RelateAppr target={apprTarget} onClose={() => setApprTarget(null)} />
    </div>
  );
};
