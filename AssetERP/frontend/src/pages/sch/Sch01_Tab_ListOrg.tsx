/**
 * [1357] 스케줄 > 01. 업무일정 > 부서별 업무일정 조회 (O03)
 * AS-IS: myApp/client/vi/sch/Sch01_Tab_ListOrg.java (266줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 생성자 L67-103: center=세로 테두리 박스(툴바 + 그리드). 툴바 = 마감일(시작 ~ 종료, 기본 오늘) · 부서(200, 조회창 트리거, 기본 내 부서) · [하위부서 포함](기본 켬) ·
 *   주기(80, CycleCode005, 전체 %) · 검색(250, "분류/스케줄명/상세내용/등록자") · [데일리 체크리스트만 보기] · [조회]. 그리드는 단일 선택, 아이콘 열 1(상세보기)
 * 연결: Org00_Lookup_SelectMulti(부서) · Sch01_Lookup_InfoView(업무일정 보기 + 첨부 Bbs02_Lookup_File) · Sch10_Lookup_Ipo(분류가 공모주인 행)
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 박스 안 여백 = 11 §5(padding 10·gap 8). 초기화(UX-02)는 조건 6개라 줄바꿈 위험이 있어 넣지 않는다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, DatePicker, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { schApi } from '@/api/sch';
import { empApi } from '@/api/emp';
import { errorMessage } from '@/api/client';
import { useLoginUser } from '@/hooks/useLoginUser';
import { Sch01Org, Sch10Ipo } from '@/types/sch';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Org00_Lookup_SelectMulti } from '@/components/lookup/Org00_Lookup_SelectMulti';
import { Sch01_Lookup_InfoView, InfoViewTarget } from '@/components/lookup/Sch01_Lookup_InfoView';
import { Sch10_Lookup_Ipo } from '@/components/lookup/Sch10_Lookup_Ipo';

const gb = gbFor<Sch01Org>();
const ALL_CODE: [string, string] = ['%', '전체'];   // CommonComboBoxField("sys.Sys00_Common.selectByKindGroupCode", …, "%", "전체")
const FORMAT = 'YYYY-MM-DD';

export const Sch01_Tab_ListOrg: React.FC = () => {
  const user = useLoginUser();
  const today = useMemo(() => dayjs(), []);
  const [startDate, setStartDate] = useState<Dayjs>(today);
  const [closeDate, setCloseDate] = useState<Dayjs>(today);
  const [orgId, setOrgId] = useState<number | null>(null);
  const [orgName, setOrgName] = useState('');
  const [orgOpen, setOrgOpen] = useState(false);
  const [subOrgYn, setSubOrgYn] = useState(true);
  const [cycleCode, setCycleCode] = useState('%');
  const [searchText, setSearchText] = useState('');
  const [dailyYn, setDailyYn] = useState(false);
  const [rows, setRows] = useState<Sch01Org[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewTarget, setViewTarget] = useState<InfoViewTarget | null>(null);
  const [ipo, setIpo] = useState<Sch10Ipo | null>(null);

  // 콤보를 닫는 순간(Collapse)에는 방금 고른 값이 아직 state에 반영되지 않았을 수 있어 ref로 최신 값을 읽는다
  const latest = useRef({ startDate, closeDate, orgId, subOrgYn, cycleCode, searchText, dailyYn });
  latest.current = { startDate, closeDate, orgId, subOrgYn, cycleCode, searchText, dailyYn };

  // retrieve() L193-218: 부서가 없으면 "부서를 선택하세요". sch.Sch01_Info.selectByOrg(부서, 하위부서 포함, 마감일 시작·종료, 데일리, 주기, "%검색%")
  const retrieve = useCallback(async () => {
    const c = latest.current;
    if (c.orgId == null) {
      message.warning('부서를 선택하세요');
      return;
    }
    setLoading(true);
    try {
      setRows(await schApi.searchInfosByOrg({
        orgId: c.orgId, subOrgYn: c.subOrgYn, startDate: c.startDate.format(FORMAT), endDate: c.closeDate.format(FORMAT),
        cycleCode: c.cycleCode, dailyYn: c.dailyYn, searchText: c.searchText,
      }));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, []);

  // [E0] 화면 열림 (생성자 L67-103) → settings() L105-165: 마감일 = 오늘, 부서 = 로그인 사용자의 부서(LoginUser.getOrgCodeId·부서명), 하위부서 포함 켬,
  //   주기 "전체", 데일리 끔 — 주기 콤보가 만들어지면 곧바로 retrieve(). 회사관리자(userId < 0)는 부서가 없어 "부서를 선택하세요"
  useEffect(() => {
    const init = async () => {
      if (user.userId >= 0) {
        try {
          const trans = await empApi.getCurrentTransInfo(user.userId);
          latest.current.orgId = trans.orgCodeId ?? null;
          setOrgId(trans.orgCodeId ?? null);
          setOrgName(trans.orgKorNm ?? '');
        } catch {
          /* 부서를 못 읽으면 비워 두고 사용자가 고른다 */
        }
      }
      void retrieve();
    };
    void init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // [E1] orgLookup.TriggerClick (L116) → lookupOrg() L220-237: Org00_Lookup_SelectMulti.open(마감일 시작, 전체 버튼 없음) → 첫 조직의 orgCodeId·parentFullName
  const lookupOrg = (orgs: { orgCodeId: number; parentFullNm?: string | null; korNm?: string | null }[]) => {
    const org = orgs[0];
    latest.current.orgId = org.orgCodeId;
    setOrgId(org.orgCodeId);
    setOrgName(org.parentFullNm ?? org.korNm ?? '');
    setOrgOpen(false);
  };

  // lookupSch() L239-258: 분류가 공모주(classId 0)면 sch.Sch10_Ipo.selectById(realInfoId) → Sch10_Lookup_Ipo, 아니면 Sch01_Lookup_InfoView.open(realInfoId, deadlineId)
  const lookupSch = async (row: Sch01Org) => {
    if (row.realInfoId == null) return;
    if (row.classId != null && row.classId === 0) {
      try {
        setIpo(await schApi.getIpo(row.realInfoId));
      } catch (err) {
        message.error(errorMessage(err, '조회 실패'));
      }
    } else if (row.deadlineId != null) {
      setViewTarget({ infoId: row.realInfoId, deadlineId: row.deadlineId });
    }
  };

  // buildGrid() (단일 선택)
  const columnDefs = useMemo(() => [
    gb.date('closeDate', 90, '마감일'),
    gb.date('manageDate', 90, '처리일'),
    gb.text('className', 130, '분류'),
    gb.text('title', 300, '일정명'),
    gb.textArea('content', 400, '상세내용'),
    gb.text('deadlineName', 150, '주기'),
    iconCell<Sch01Org>('view', 'actionCell', 80, '상세보기', lookupSch),   // → lookupSch()
    gb.textCenter('statusName', 80, '처리여부'),
    gb.textCenter('personName', 80, '처리자'),
    gb.text('managerOrgInfo', 200, '등록자'),   // SQL에 없는 열 — 원본도 빈 칸
    gb.text('note', 250, '비고'),
  ], []);  // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box', padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E5] searchButton[조회].Select (L159) → retrieve() */}
        <SearchBar onSearch={retrieve} loading={loading}>
          <SearchBar.Field label="마감일">
            <DatePicker style={{ width: 120 }} allowClear={false} value={startDate} format={FORMAT}
              onChange={d => { if (d) { latest.current.startDate = d; setStartDate(d); } }} />
            <span>~</span>
            <DatePicker style={{ width: 120 }} allowClear={false} value={closeDate} format={FORMAT}
              onChange={d => { if (d) { latest.current.closeDate = d; setCloseDate(d); } }} />
          </SearchBar.Field>
          <SearchBar.Field label="부서">
            <LookupInput value={orgName} width={200} onOpen={() => setOrgOpen(true)} />
          </SearchBar.Field>
          <Checkbox checked={subOrgYn} onChange={e => { latest.current.subOrgYn = e.target.checked; setSubOrgYn(e.target.checked); }}>하위부서 포함</Checkbox>
          <SearchBar.Field label="주기">
            {/* [E2] cycleComboBox (CommonComboBoxField).callbackOnCreate (L130) → retrieve() — 화면 열림 때 조회(위 E0) · [E3] cycleComboBox.Collapse (L138) → retrieve() */}
            <SystemCodeComboBox
              kindGroupCd="CycleCode005" altCode={ALL_CODE} allowClear={false} style={{ width: 100 }}
              applyDate={startDate.format(FORMAT)}
              value={cycleCode} onChange={v => { latest.current.cycleCode = v ?? '%'; setCycleCode(v ?? '%'); }}
              onOpenChange={open => { if (!open) void retrieve(); }}
            />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            {/* [E4] searchText.KeyPress [Enter] (L147) → retrieve() — SearchBar.Input이 Enter = 조회 */}
            <SearchBar.Input style={{ width: 250 }} placeholder="분류/스케줄명/상세내용/등록자" value={searchText}
              onChange={e => { latest.current.searchText = e.target.value; setSearchText(e.target.value); }} />
          </SearchBar.Field>
          <Checkbox checked={dailyYn} onChange={e => { latest.current.dailyYn = e.target.checked; setDailyYn(e.target.checked); }}>데일리 체크리스트만 보기</Checkbox>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<Sch01Org> rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.infoId)} />
        </div>
      </div>
      {orgOpen && (
        <Org00_Lookup_SelectMulti baseDate={startDate.format(FORMAT)} onSelect={lookupOrg} onClose={() => setOrgOpen(false)} />
      )}
      <Sch01_Lookup_InfoView target={viewTarget} onClose={() => setViewTarget(null)} />
      <Sch10_Lookup_Ipo ipo={ipo} onClose={() => setIpo(null)} />
    </div>
  );
};
