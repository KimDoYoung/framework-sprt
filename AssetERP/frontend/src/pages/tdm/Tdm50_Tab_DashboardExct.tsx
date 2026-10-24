/**
 * 책무점검 현황 > 임원별 탭 (N01 Tdm50_Tab_TotalDashboard의 tapPage02)
 * AS-IS: myApp/client/vi/tdm/Tdm50_Tab_DashboardExct.java (565줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L122-212: center = 툴바(점검년월 · 임원 150 · 최종승인/점검완료 · [새로고침] · 마감 문구) + 모니터 3칸
 *   + 직책별 진행현황(grid01)·부서별 진행현황(grid02) 가로 2분할 250 + 미흡 조치현황(grid03)·미점검 현황(grid04) 가로 2분할
 * [보기] 아이콘: grid03 → Tdm54_Lookup_ChckInsuffCmnt.view (다음 단계 N24), grid04 → Tdm52_Edit_ChckManl.view (다음 단계 N22)
 * UX보강(10): UX-01(새로고침 버튼 로딩), UX-08(날짜 열 90 — '조치완료(예정)일'은 제목이 잘려 110 유지)
 */
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { message } from 'antd';
import dayjs from 'dayjs';
import { errorMessage } from '@/api/client';
import { tdmApi } from '@/api/tdm';
import { TdmDashboardCheckEnd, TdmDashboardChckOrg, TdmDashboardInsuff, TdmDashboardProgress, TdmDashboardUndone, TdmHrLookup } from '@/types/tdm';
import { YearMonth } from '@/components/form/QuickMoveField';
import { SingleGrid } from '@/components/grid';
import { LookupInput } from '@/components/lookup/LookupInput';
import { useLoginUser } from '@/hooks/useLoginUser';
import {
  DashboardFrame, DashboardToolbar, NEXT_STEP_MESSAGE, StatusType, TitledGrid, ToolbarField, checkYmOf, firstDayOf, gbChck, gbInsuff, gbUndone,
  progressColumns, progressSumRow, viewCell, ymOfCheckYm,
} from './Tdm50_Dashboard_Common';
import { DashboardTabHandle } from './Tdm50_Tab_Dashboard';
import { Tdm01_Lookup_SelectSingle } from './Tdm01_Lookup_SelectSingle';

const thisMonth = (): YearMonth => ({ year: dayjs().year(), month: dayjs().month() + 1 });

export const Tdm50_Tab_DashboardExct = forwardRef<DashboardTabHandle>((_props, ref) => {
  const user = useLoginUser();
  const [ym, setYm] = useState<YearMonth>(thisMonth);
  const [statusType, setStatusType] = useState<StatusType>('1');   // settings() L236: 최종승인
  const [exctId, setExctId] = useState<number | null>(null);
  const [exctName, setExctName] = useState('');
  const [isTdmManager, setIsTdmManager] = useState(true);          // exctField.setEnabled(isTdmManager) — 응답이 오기 전에는 켜져 있다
  const [lookupOpen, setLookupOpen] = useState(false);
  const [progress, setProgress] = useState<TdmDashboardProgress | null>(null);
  const [checkEnd, setCheckEnd] = useState<TdmDashboardCheckEnd | null>(null);
  const [rows1, setRows1] = useState<TdmDashboardChckOrg[]>([]);
  const [rows2, setRows2] = useState<TdmDashboardChckOrg[]>([]);
  const [rows3, setRows3] = useState<TdmDashboardInsuff[]>([]);
  const [rows4, setRows4] = useState<TdmDashboardUndone[]>([]);
  const [loading, setLoading] = useState(false);
  const seq = useRef(0);

  // init() L496-507
  const init = () => {
    setCheckEnd(null);
    setProgress(null);
    setRows1([]);
    setRows2([]);
    setRows3([]);
    setRows4([]);
  };

  // retrieve() L364-392: 임원을 안 골랐으면 안내. selectDashboardProgress(+exctId) → 모니터 3칸 → retrieveAll()
  const retrieve = async (o: { ym?: YearMonth; statusType?: StatusType; exctId?: number | null } = {}) => {
    const v = o.ym ?? ym;
    const st = o.statusType ?? statusType;
    const exct = o.exctId !== undefined ? o.exctId : exctId;
    if (exct == null) {
      message.warning('임원을 선택하세요');   // new SimpleMessage("임원을 선택하세요")
      return;
    }
    const checkYm = checkYmOf(v);
    const stdDate = firstDayOf(v);
    const my = ++seq.current;
    init();
    setLoading(true);
    try {
      const p = await tdmApi.getDashboardProgress({ checkYm, stdDate, statusType: st, exctId: exct });
      if (my !== seq.current) return;
      setProgress(p);
      // retrieveAll() L394-400: setCheckEndInfo() + retrieve01~04()
      const [end, list1, list2, list3, list4] = await Promise.all([
        tdmApi.getDashboardCheckEnd(checkYm),
        tdmApi.searchDashboardExctProgress({ checkYm, statusType: st, exctId: exct }),   // retrieve01 L429-444 selectDashboardExct
        tdmApi.searchDashboardOrgProgress({ checkYm, statusType: st, exctId: exct }),    // retrieve02 L446-461 selectDashboardOrg
        tdmApi.searchDashboardInsuff({ checkYm, exctId: exct }),                          // retrieve03 L463-477 selectDashboardInsuff
        tdmApi.searchDashboardUndone({ checkYm, statusType: st, exctId: exct }),         // retrieve04 L479-494 selectDashboardUndone
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

  // [E0] 화면 열림 (생성자 L122-212) → setDefault() L214-233: 진행 중인 점검년월로 SET, 없으면 현재월.
  //   QuickMoveField 생성 콜백 → initExctField() L509-526: 내가 임원(직책 배정 있음)이면 임원 = 나, 곧바로 조회
  //   settings() L235-291 → setIsManager() L528-547: 책무담당자·책무관리자만 임원을 바꿀 수 있다 (exctField.setEnabled)
  useEffect(() => {
    let alive = true;
    (async () => {
      let v = thisMonth();
      try {
        const recent = await tdmApi.getDashboardRecentCheckYm();
        if (recent) v = ymOfCheckYm(recent);
      } catch { /* 현재월로 계속 */ }
      if (!alive) return;
      setYm(v);
      try {
        if (await tdmApi.hasDashboardRoleAllc(firstDayOf(v)) && alive) {
          setExctId(user.userId);
          setExctName(user.name);
          void retrieve({ ym: v, exctId: user.userId });
        }
      } catch { /* 임원이 아니거나 읽지 못하면 임원 칸을 비워 둔다 */ }
    })();
    tdmApi.isDashboardManager(dayjs().format('YYYY-MM-DD'))
      .then(b => { if (alive) setIsTdmManager(b); })
      .catch(() => { if (alive) setIsTdmManager(false); });
    return () => { alive = false; };
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  useImperativeHandle(ref, () => ({ retrieve: () => retrieve() }));

  // [E2] exctField.TriggerClick [result != null] (L263) → Tdm01_Lookup_SelectSingle.open(): 고른 임원으로 바꾸고 곧바로 조회
  //   (result == null 갈래 — 임원을 비움 — 는 이 조회창이 확인 없이 닫을 때 callback을 부르지 않아 닿지 않는다)
  const onExctSelected = (hr: TdmHrLookup) => {
    setExctId(hr.personId);
    setExctName(hr.personName ?? '');
    void retrieve({ exctId: hr.personId });
  };

  // buildGrid01() L293-306: getSumGrid("계", 1, 3, 7) · 묶음 "점검"
  const columns1 = useMemo(() => progressColumns([
    gbChck.text('roleName', 200, '직책'),  // L296
  ], 80, 80), []);
  // buildGrid02() L308-321
  const columns2 = useMemo(() => progressColumns([
    gbChck.text('orgName', 240, '점검부서'),  // L311
  ], 80, 80), []);
  // buildGrid03() L323-342 → [보기] Tdm54_Lookup_ChckInsuffCmnt.view (다음 단계 N24)
  const columns3 = useMemo(() => [
    gbInsuff.textCenter('checkYm', 75, '발생년월'),  // L333
    gbInsuff.date('actionDueDate', 110, '조치완료(예정)일'),  // L334 (제목이 길어 UX-08의 90 대신 원본 110 유지)
    gbInsuff.textCenter('statusName', 70, '조치상태'),  // L335
    gbInsuff.text('orgName', 130, '조치부서'),  // L336
    gbInsuff.text('actionEmpName', 90, '조치(예정)자'),  // L337
    gbInsuff.text('actionName', 200, '조치명'),  // L338
    viewCell<TdmDashboardInsuff>('actionCell', 45, '보기', () => message.info(NEXT_STEP_MESSAGE)),  // L339
  ], []);
  // buildGrid04() L344-362 → [보기] Tdm52_Edit_ChckManl.view (다음 단계 N22)
  const columns4 = useMemo(() => [
    gbUndone.text('orgName', 150, '점검부서'),  // L354
    gbUndone.text('checkerName', 80, '점검자'),  // L355
    gbUndone.text('checkItem', 280, '점검항목'),  // L356
    gbUndone.textCenter('checkCycleName', 70, '점검주기'),  // L357
    gbUndone.textCenter('checkStatusName', 80, '진행상태'),  // L358
    viewCell<TdmDashboardUndone>('actionCell', 45, '보기', () => message.info(NEXT_STEP_MESSAGE)),  // L359
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
              <ToolbarField label="임원">
                <LookupInput value={exctName} placeholder="선택하세요" width={150} disabled={!isTdmManager} onOpen={() => setLookupOpen(true)} />
              </ToolbarField>
            }
            statusType={statusType}
            onStatusChange={st => { setStatusType(st); void retrieve({ statusType: st }); }}   // [E1] toggleGroup.ValueChange (L240) → retrieve()
            onRefresh={() => retrieve()}                                                         // [E3] retrieveButton[새로고침].Select (L285) → retrieve()
            checkEnd={checkEnd}
          />
        }
      >
        {/* hlc01 L190-192: 가로 2분할, 높이 250 */}
        <div style={{ flex: 'none', height: 250, display: 'flex' }}>
          <TitledGrid title="직책별 진행현황" style={{ flex: 0.5, margin: '10px 5px 10px 10px' }}>
            <SingleGrid<TdmDashboardChckOrg> rowData={rows1} columnDefs={columns1} getRowId={p => String(p.data.chckOrgId)} loading={loading} sumRow={progressSumRow('roleName')} />
          </TitledGrid>
          <TitledGrid title="부서별 진행현황" style={{ flex: 0.5, margin: '10px 10px 10px 5px' }}>
            <SingleGrid<TdmDashboardChckOrg> rowData={rows2} columnDefs={columns2} getRowId={p => String(p.data.chckOrgId)} loading={loading} sumRow={progressSumRow('orgName')} />
          </TitledGrid>
        </div>
        {/* hlc02 L194-196: 가로 2분할, 나머지 높이 */}
        <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
          <TitledGrid title="미흡 조치현황" style={{ flex: 0.5, margin: '10px 5px 10px 10px' }}>
            <SingleGrid<TdmDashboardInsuff> rowData={rows3} columnDefs={columns3} getRowId={p => String(p.data.chckInsuffId)} loading={loading} />
          </TitledGrid>
          <TitledGrid title="미점검 현황" style={{ flex: 0.5, margin: '10px 10px 10px 5px' }}>
            <SingleGrid<TdmDashboardUndone> rowData={rows4} columnDefs={columns4} getRowId={p => String(p.data.chckManlId)} loading={loading} />
          </TitledGrid>
        </div>
      </DashboardFrame>
      <Tdm01_Lookup_SelectSingle open={lookupOpen} onSelect={onExctSelected} onClose={() => setLookupOpen(false)} />
    </>
  );
});
Tdm50_Tab_DashboardExct.displayName = 'Tdm50_Tab_DashboardExct';
