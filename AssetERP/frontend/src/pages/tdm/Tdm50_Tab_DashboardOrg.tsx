/**
 * 책무점검 현황 > 부서별 탭 (N01 Tdm50_Tab_TotalDashboard의 tapPage03)
 * AS-IS: myApp/client/vi/tdm/Tdm50_Tab_DashboardOrg.java (541줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L120-204: center = 툴바(점검년월 · 부서 250 · 최종승인/점검완료 · [새로고침] · 마감 문구) + 모니터 3칸
 *   + 가로 2분할 350(왼쪽 미점검 grid01 / 오른쪽 위 반려 grid02 · 아래 당월발생 미흡 grid03) + 미흡 조치현황(grid04)
 * [보기] 아이콘: grid01·grid03 → Tdm52_Edit_ChckManl.view (다음 단계 N22), grid04 → Tdm54_Lookup_ChckInsuffCmnt.view (다음 단계 N24),
 *   grid02 [반려의견] 아이콘은 AS-IS 핸들러가 비어 있어 아무 일도 안 한다
 * UX보강(10): UX-01(새로고침 버튼 로딩), UX-08(날짜 열 90)
 */
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { message } from 'antd';
import dayjs from 'dayjs';
import { errorMessage } from '@/api/client';
import { tdmApi } from '@/api/tdm';
import { TdmDashboardCheckEnd, TdmDashboardInsuff, TdmDashboardProgress, TdmDashboardUndone } from '@/types/tdm';
import { OrgInfo } from '@/types/emp';
import { YearMonth } from '@/components/form/QuickMoveField';
import { SingleGrid } from '@/components/grid';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Org00_Lookup_SelectSingle } from '@/components/lookup/Org00_Lookup_SelectSingle';
import {
  DashboardFrame, DashboardToolbar, NEXT_STEP_MESSAGE, StatusType, TitledGrid, ToolbarField, checkYmOf, firstDayOf, gbInsuff, gbUndone, viewCell, ymOfCheckYm,
} from './Tdm50_Dashboard_Common';
import { DashboardTabHandle } from './Tdm50_Tab_Dashboard';

const thisMonth = (): YearMonth => ({ year: dayjs().year(), month: dayjs().month() + 1 });

export const Tdm50_Tab_DashboardOrg = forwardRef<DashboardTabHandle>((_props, ref) => {
  const [ym, setYm] = useState<YearMonth>(thisMonth);
  const [statusType, setStatusType] = useState<StatusType>('1');   // settings() L228: 최종승인
  const [orgId, setOrgId] = useState<number | null>(null);
  const [orgName, setOrgName] = useState('');
  const [isTdmManager, setIsTdmManager] = useState(true);          // orgField.setEnabled(isTdmManager)
  const [orgLookupDate, setOrgLookupDate] = useState<string | undefined>(undefined);   // 값이 있으면 조직찾기가 열린다
  const [progress, setProgress] = useState<TdmDashboardProgress | null>(null);
  const [checkEnd, setCheckEnd] = useState<TdmDashboardCheckEnd | null>(null);
  const [rows1, setRows1] = useState<TdmDashboardUndone[]>([]);
  const [rows2, setRows2] = useState<TdmDashboardUndone[]>([]);
  const [rows3, setRows3] = useState<TdmDashboardUndone[]>([]);
  const [rows4, setRows4] = useState<TdmDashboardInsuff[]>([]);
  const [loading, setLoading] = useState(false);
  const seq = useRef(0);

  // init() L491-502
  const init = () => {
    setCheckEnd(null);
    setProgress(null);
    setRows1([]);
    setRows2([]);
    setRows3([]);
    setRows4([]);
  };

  // retrieve() L359-387: 부서를 안 골랐으면 안내. selectDashboardProgress(+orgId) → 모니터 3칸 → retrieveAll()
  const retrieve = async (o: { ym?: YearMonth; statusType?: StatusType; orgId?: number | null } = {}) => {
    const v = o.ym ?? ym;
    const st = o.statusType ?? statusType;
    const org = o.orgId !== undefined ? o.orgId : orgId;
    if (org == null) {
      message.warning('부서를 선택하세요');   // new SimpleMessage("부서를 선택하세요")
      return;
    }
    const checkYm = checkYmOf(v);
    const stdDate = firstDayOf(v);
    const my = ++seq.current;
    init();
    setLoading(true);
    try {
      const p = await tdmApi.getDashboardProgress({ checkYm, stdDate, statusType: st, orgId: org });
      if (my !== seq.current) return;
      setProgress(p);
      // retrieveAll() L389-395: setCheckEndInfo() + retrieve01~04()
      const [end, list1, list2, list3, list4] = await Promise.all([
        tdmApi.getDashboardCheckEnd(checkYm),
        tdmApi.searchDashboardUndone({ checkYm, orgId: org, retrieveType: '1' }),   // retrieve01 L424-439 미점검
        tdmApi.searchDashboardUndone({ checkYm, orgId: org, retrieveType: '2' }),   // retrieve02 L441-456 반려
        tdmApi.searchDashboardUndone({ checkYm, orgId: org, retrieveType: '3' }),   // retrieve03 L458-473 당월발생 미흡
        tdmApi.searchDashboardInsuff({ checkYm }),                                   // retrieve04 L475-489 selectDashboardInsuff (AS-IS 서버는 orgId를 SQL에 넘기지 않는다)
      ]);
      if (my !== seq.current) return;
      setCheckEnd(end);
      setRows1(list1);
      setRows2(list2);
      setRows3(list3);
      setRows4(list4);
    } catch (err) {
      if (my === seq.current) message.error(errorMessage(err, '조회 실패'));
    } finally {
      if (my === seq.current) setLoading(false);
    }
  };

  // [E0] 화면 열림 (생성자 L120-204) → setDefault() L206-225: 진행 중인 점검년월로 SET, 없으면 현재월 (QuickMoveField 생성 콜백의 retrieve()는 주석 처리 — 열 때 조회하지 않는다)
  //   settings() L227-285: 부서 = 로그인 사용자의 조직 → setIsManager() L504-523: 책무담당자·책무관리자만 부서를 바꿀 수 있다
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const recent = await tdmApi.getDashboardRecentCheckYm();
        if (recent && alive) setYm(ymOfCheckYm(recent));
      } catch { /* 현재월로 계속 */ }
    })();
    tdmApi.getDashboardMyOrg()
      .then(org => {
        if (!alive || !org) return;
        setOrgName(org.korName ?? '');
        setOrgId(org.orgCodeId);
      })
      .catch(() => { /* 회사관리자 등 조직이 없으면 비워 둔다 */ });
    tdmApi.isDashboardManager(dayjs().format('YYYY-MM-DD'))
      .then(b => { if (alive) setIsTdmManager(b); })
      .catch(() => { if (alive) setIsTdmManager(false); });
    return () => { alive = false; };
  }, []);

  useImperativeHandle(ref, () => ({ retrieve: () => retrieve() }));

  // [E2] orgField.TriggerClick [result != null] (L255) → Org00_Lookup_SelectSingle.open(그 달 1일, false, cb): 고른 부서로 바꾸고 곧바로 조회
  const onOrgSelected = (org: OrgInfo) => {
    setOrgName(org.korNm ?? '');
    setOrgId(org.orgCodeId);
    void retrieve({ orgId: org.orgCodeId });
  };

  // buildGrid01() L287-304 → [보기] Tdm52_Edit_ChckManl.view (다음 단계 N22)
  const columns1 = useMemo(() => [
    gbUndone.text('checkItem', 400, '점검항목'),  // L297
    gbUndone.textCenter('checkCycleName', 80, '점검주기'),  // L298
    gbUndone.textCenter('checkStatusName', 80, '진행상태'),  // L299
    gbUndone.text('checkerName', 90, '점검자'),  // L300
    viewCell<TdmDashboardUndone>('actionCell', 45, '보기', () => message.info(NEXT_STEP_MESSAGE)),  // L301
  ], []);
  // buildGrid02() L306-319 — [반려의견] 아이콘은 핸들러가 비어 있다 (AS-IS 그대로 아무 일도 안 한다)
  const columns2 = useMemo(() => [
    gbUndone.text('checkItem', 450, '점검항목'),  // L314
    gbUndone.text('checkerName', 100, '점검자'),  // L315
    viewCell<TdmDashboardUndone>('actionCell', 80, '반려의견', () => { /* L309-311 비어 있음 */ }),  // L316
  ], []);
  // buildGrid03() L321-336 — 점검자 열이 두 번 들어 있다(원문 그대로)
  const columns3 = useMemo(() => [
    gbUndone.text('checkItem', 450, '점검항목'),  // L330
    gbUndone.text('checkerName', 100, '점검자'),  // L331
    { ...gbUndone.text('checkerName', 100, '점검자'), colId: 'checkerName2' },  // L332
    viewCell<TdmDashboardUndone>('actionCell', 45, '보기', () => message.info(NEXT_STEP_MESSAGE)),  // L333 → Tdm52_Edit_ChckManl.view (다음 단계 N22)
  ], []);
  // buildGrid04() L338-357 → [보기] Tdm54_Lookup_ChckInsuffCmnt.view (다음 단계 N24)
  const columns4 = useMemo(() => [
    gbInsuff.textCenter('checkYm', 100, '발생년월'),  // L347
    gbInsuff.date('dueDate', 90, '조치예정일'),  // L348 (UX-08)
    gbInsuff.date('actionDate', 90, '조치완료일'),  // L349
    gbInsuff.textCenter('statusName', 100, '조치상태'),  // L350
    gbInsuff.text('orgName', 200, '조치부서'),  // L351
    gbInsuff.text('actionEmpName', 200, '조치(예정)자'),  // L352
    gbInsuff.text('actionName', 650, '조치명'),  // L353
    viewCell<TdmDashboardInsuff>('actionCell', 45, '보기', () => message.info(NEXT_STEP_MESSAGE)),  // L354
  ], []);

  return (
    <>
      <DashboardFrame
        progress={progress}
        toolbar={
          <DashboardToolbar
            ym={ym}
            onYmChange={setYm}
            onYmCommit={v => retrieve({ ym: v })}
            lookup={
              <ToolbarField label="부서">
                <LookupInput value={orgName} placeholder="선택하세요" width={250} disabled={!isTdmManager} onOpen={() => setOrgLookupDate(firstDayOf(ym))} />
              </ToolbarField>
            }
            statusType={statusType}
            onStatusChange={st => { setStatusType(st); void retrieve({ statusType: st }); }}   // [E1] toggleGroup.ValueChange (L232) → retrieve()
            onRefresh={() => retrieve()}                                                         // [E3] retrieveButton[새로고침].Select (L279) → retrieve()
            checkEnd={checkEnd}
          />
        }
      >
        {/* hlc01 L186-188: 가로 2분할, 높이 350 */}
        <div style={{ flex: 'none', height: 350, display: 'flex' }}>
          <TitledGrid title="미점검" style={{ flex: 0.5, margin: '10px 5px 10px 10px' }}>
            <SingleGrid<TdmDashboardUndone> rowData={rows1} columnDefs={columns1} getRowId={p => String(p.data.chckManlId)} loading={loading} />
          </TitledGrid>
          <div style={{ flex: 0.5, minWidth: 0, margin: '10px 10px 10px 5px', display: 'flex', flexDirection: 'column' }}>
            <TitledGrid title="반려" style={{ flex: 0.5 }}>
              <SingleGrid<TdmDashboardUndone> rowData={rows2} columnDefs={columns2} getRowId={p => String(p.data.chckManlId)} loading={loading} />
            </TitledGrid>
            <TitledGrid title="당월발생 미흡" style={{ flex: 0.5 }} titleStyle={{ height: 45, margin: '20px 3px 3px 3px', alignItems: 'center' }}>
              <SingleGrid<TdmDashboardUndone> rowData={rows3} columnDefs={columns3} getRowId={p => String(p.data.chckManlId)} loading={loading} />
            </TitledGrid>
          </div>
        </div>
        {/* vlc03 L182-184: 미흡 조치현황, 나머지 높이, 여백 10 */}
        <TitledGrid title="미흡 조치현황" style={{ flex: 1, margin: 10 }}>
          <SingleGrid<TdmDashboardInsuff> rowData={rows4} columnDefs={columns4} getRowId={p => String(p.data.chckInsuffId)} loading={loading} />
        </TitledGrid>
      </DashboardFrame>
      <Org00_Lookup_SelectSingle baseDate={orgLookupDate} fixDate={false} onSelect={onOrgSelected} onClose={() => setOrgLookupDate(undefined)} />
    </>
  );
});
Tdm50_Tab_DashboardOrg.displayName = 'Tdm50_Tab_DashboardOrg';
