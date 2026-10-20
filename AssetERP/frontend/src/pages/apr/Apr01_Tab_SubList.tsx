/**
 * [1011] 문서작성 > 06. 문서작성현황 > 건별명세 (G17, 1단계)
 * AS-IS: myApp/client/vi/apr/Apr01_Tab_SubList.java (305줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L52-89: center=vlc01 — 툴바(조회기간 · 담당부서 · 담당자 · 문서종류 · 처리여부 · [조회]) + 건별 명세 그리드(단일 선택, 맨 아래 건수 행)
 * 운영현황표(G16)의 건별명세 아이콘이 이 화면을 열면서 조회기간·담당자·담당부서를 넘긴다 — retrieveCall() L192-203 (TempData, utils/tempData.ts)
 * 1단계(F01~F12·G01~G04와 같은 사유): [문서조회]가 여는 전자결재 편집창 Apr01_Edit_ApprDoc은 다른 도메인이라 다음 단계에서 연결한다 — 지금은 안내만 띄운다.
 *   lookupAppr() L256-300은 권한 검사를 주석 처리했고("모든 문서를 보기위한 화면") 안내 메시지는 없다.
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 박스 안 여백 = 11 §5(padding 10·gap 8)
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, Select, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { aprApi } from '@/api/apr';
import { errorMessage } from '@/api/client';
import { AprSubList } from '@/types/apr';
import { SingleGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { SearchBar } from '@/components/search';
import { TempData } from '@/utils/tempData';

/** 운영현황표(G16)가 건별명세를 열 때 TempData에 담는 값 (AS-IS TempData.setStartDate/CloseDate/SelectPersonName/SelectOrgName) */
export const SUB_LIST_KEY = 'apr.subList';
export interface SubListRequest {
  startDate: string;
  closeDate: string;
  personName: string;
  orgName: string;
}

const gb = gbFor<AprSubList>();
const DATE_FORMAT = 'YYYY-MM-DD';
const ALL_TEXT = '전체';
/** docTypeCombo L113-: 전체/일반/내부통제, statusCombo L127-: 전체/완료/미처리 */
const DOC_TYPES = ['전체', '일반', '내부통제'].map(v => ({ value: v, label: v }));
const STATUSES = ['전체', '완료', '미처리'].map(v => ({ value: v, label: v }));

interface Conditions {
  startDate: Dayjs;
  closeDate: Dayjs;
  orgName: string;
  personName: string;
  docTypeText: string;
  statusText: string;
}

export const Apr01_Tab_SubList: React.FC = () => {
  // setInitData() L180-190: 조회기간 = 이번 달 1일 ~ 말일
  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs().startOf('month'));
  const [closeDate, setCloseDate] = useState<Dayjs>(() => dayjs().endOf('month'));
  const [orgName, setOrgName] = useState('');
  const [personName, setPersonName] = useState('');
  const [docTypeText, setDocTypeText] = useState(ALL_TEXT);
  const [statusText, setStatusText] = useState(ALL_TEXT);
  const [rows, setRows] = useState<AprSubList[]>([]);
  const [loading, setLoading] = useState(false);
  const seq = useRef(0);
  const current = useRef<Conditions | undefined>(undefined);
  current.current = { startDate, closeDate, orgName, personName, docTypeText, statusText };

  // [E5] searchButton[조회].Select (L141) → retrieve() L205-254: apr.Apr01_Appr.selectBySubList
  // 담당자·담당부서는 서버가 %…%, 문서종류 일반/내부통제(그 밖은 전체), 처리여부 완료=true·미처리=false(그 밖은 전체)
  const retrieve = async (cond: Conditions = current.current!) => {
    const my = ++seq.current;
    setLoading(true);  // grid.mask("Loading")
    setRows([]);       // grid.getStore().clear()
    try {
      const list = await aprApi.searchSubList({
        startDate: cond.startDate.format(DATE_FORMAT),
        closeDate: cond.closeDate.format(DATE_FORMAT),
        orgName: cond.orgName,
        personName: cond.personName,
        docType: cond.docTypeText === '일반' || cond.docTypeText === '내부통제' ? cond.docTypeText : undefined,
        statusCode: cond.statusText === '완료' ? 'true' : cond.statusText === '미처리' ? 'false' : undefined,
      });
      if (my !== seq.current) return;
      setRows(list);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      if (my === seq.current) setLoading(false);
    }
  };

  // retrieveCall() L192-203 — 운영현황표에서 넘어온 값으로 조건을 채우고(문서종류·처리여부는 "전체") 바로 조회
  const retrieveCall = (req: SubListRequest) => {
    const cond: Conditions = {
      startDate: dayjs(req.startDate),
      closeDate: dayjs(req.closeDate),
      orgName: req.orgName,
      personName: req.personName,
      docTypeText: ALL_TEXT,
      statusText: ALL_TEXT,
    };
    setStartDate(cond.startDate);
    setCloseDate(cond.closeDate);
    setOrgName(cond.orgName);
    setPersonName(cond.personName);
    setDocTypeText(ALL_TEXT);
    setStatusText(ALL_TEXT);
    void retrieve(cond);
  };

  // [E0] 화면 열림 (생성자 L52-89) → setInitData(), setting(), retrieve() — 운영현황표가 연 것이면 넘어온 값으로 한 번만 조회한다
  useEffect(() => {
    let handled = false;
    const unsubscribe = TempData.subscribe<SubListRequest>(SUB_LIST_KEY, req => { handled = true; retrieveCall(req); });
    if (!handled) void retrieve();
    return unsubscribe;
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // [E3] docTypeCombo[전체].Collapse (L120)·[E4] statusCombo[전체].Collapse (L134) → retrieve() — 목록을 닫을 때마다(고른 값이 같아도) 조회한다.
  // 고른 값이 상태에 반영된 다음 렌더에서 읽도록 한 틱 미룬다
  const retrieveOnCollapse = (open: boolean) => { if (!open) setTimeout(() => void retrieve(), 0); };

  // lookupAppr() L256-300 — [문서조회] 아이콘. 전자결재 편집창은 다음 단계
  // [생략] Apr01_Edit_ApprDoc.retrieveApproval(model, false, …)
  const lookupAppr = () => message.info('전자결재 문서 보기 창은 다음 단계에서 연결됩니다');

  // buildGrid() L149-178 (단일 선택, 맨 아래 건수 행 getAggregationGrid("건수", 2, 3))
  const columnDefs = useMemo(() => [
    gb.date('effectDate', 120, '일자'),  // L168 시행일
    gb.text('docTypeName', 100, '문서종류'),  // L169
    gb.text('classTreeNameAllPath', 350, '문서분류'),  // L170
    gb.text('title', 500, '업무명'),  // L171
    gb.text('aprOrgName', 150, '담당부서'),  // L172
    gb.text('aprPersonName', 100, '업무담당자'),  // L173
    gb.text('statusName', 100, '처리현황'),  // L174
    {
      ...iconCell<AprSubList>('view', 'actionCell', 100, '문서조회', lookupAppr),  // L175 addCell(View)
      cellRendererSelector: (p: { node: { rowPinned?: string | null } }) => (p.node.rowPinned ? { component: () => null } : undefined),  // 건수 행에는 아이콘 없음
    },
  ], []);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box', padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <SearchBar onSearch={() => void retrieve()} searchText="조회" loading={loading}>
          <SearchBar.Field label="조회기간">
            <DatePicker style={{ width: 140 }} allowClear={false} value={startDate} onChange={d => d && setStartDate(d)} />
            <span>~</span>
            <DatePicker style={{ width: 140 }} allowClear={false} value={closeDate} onChange={d => d && setCloseDate(d)} />
          </SearchBar.Field>
          <SearchBar.Field label="담당부서">
            {/* [E1] orgName.KeyPress [Enter] (L95) → retrieve() — SearchBar.Input의 Enter */}
            <SearchBar.Input style={{ width: 160 }} value={orgName} onChange={e => setOrgName(e.target.value)} />
          </SearchBar.Field>
          <SearchBar.Field label="담당자">
            {/* [E2] personName.KeyPress [Enter] (L104) → retrieve() */}
            <SearchBar.Input style={{ width: 120 }} value={personName} onChange={e => setPersonName(e.target.value)} />
          </SearchBar.Field>
          <SearchBar.Field label="문서종류">
            <Select style={{ width: 100 }} options={DOC_TYPES} value={docTypeText} onChange={setDocTypeText} onOpenChange={retrieveOnCollapse} />
          </SearchBar.Field>
          <SearchBar.Field label="처리여부">
            <Select style={{ width: 100 }} options={STATUSES} value={statusText} onChange={setStatusText} onOpenChange={retrieveOnCollapse} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<AprSubList>
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.apprId)}
            loading={loading}
            rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: true }}
            sumRow={{ labelField: 'docTypeName', label: '건수', count: ['classTreeNameAllPath'] }}
          />
        </div>
      </div>
    </div>
  );
};
