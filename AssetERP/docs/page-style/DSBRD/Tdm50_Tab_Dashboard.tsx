/**
 * 책무점검 현황 > 총괄 탭 (N01 Tdm50_Tab_TotalDashboard의 tapPage01)
 * AS-IS: myApp/client/vi/tdm/Tdm50_Tab_Dashboard.java (425줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L106-183: center = 툴바(점검년월 QuickMoveField · 최종승인/점검완료 · [새로고침] · 마감 문구) + 모니터 3칸(진행율·적정비율·점검결과)
 *   + 임원별 진행현황(grid01)·부서별 진행현황(grid02) 가로 2분할 300 + 미흡 조치현황(grid03)
 * [보기] 아이콘(grid03 상세보기)은 Tdm54_Lookup_ChckInsuffCmnt.view — 다음 단계(N24)
 * UX보강(10): UX-01(새로고침 버튼 로딩), UX-08(날짜 열 90)
 */
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { message } from 'antd';
import dayjs from 'dayjs';
import { errorMessage } from '@/api/client';
import { tdmApi } from '@/api/tdm';
import { TdmDashboardCheckEnd, TdmDashboardChckOrg, TdmDashboardInsuff, TdmDashboardProgress } from '@/types/tdm';
import { YearMonth } from '@/components/form/QuickMoveField';
import { SingleGrid } from '@/components/grid';
import {
  DashboardFrame, DashboardToolbar, NEXT_STEP_MESSAGE, StatusType, TitledGrid, checkYmOf, firstDayOf, gbChck, gbInsuff, progressColumns, progressSumRow,
  viewCell, ymOfCheckYm,
} from './Tdm50_Dashboard_Common';

export interface DashboardTabHandle {
  /** Tdm50_Tab_TotalDashboard.tabPanel.Selection (L33-48) — 탭을 고르면 그 탭이 다시 조회한다 */
  retrieve: () => Promise<void>;
}

const thisMonth = (): YearMonth => ({ year: dayjs().year(), month: dayjs().month() + 1 });

export const Tdm50_Tab_Dashboard = forwardRef<DashboardTabHandle>((_props, ref) => {
  const [ym, setYm] = useState<YearMonth>(thisMonth);
  const [statusType, setStatusType] = useState<StatusType>('1');   // settings() L207: 최종승인
  const [progress, setProgress] = useState<TdmDashboardProgress | null>(null);
  const [checkEnd, setCheckEnd] = useState<TdmDashboardCheckEnd | null>(null);
  const [rows1, setRows1] = useState<TdmDashboardChckOrg[]>([]);
  const [rows2, setRows2] = useState<TdmDashboardChckOrg[]>([]);
  const [rows3, setRows3] = useState<TdmDashboardInsuff[]>([]);
  const [loading, setLoading] = useState(false);
  const seq = useRef(0);

  // init() L405-415: 마감 문구·모니터·그리드 비우기
  const init = () => {
    setCheckEnd(null);
    setProgress(null);
    setRows1([]);
    setRows2([]);
    setRows3([]);
  };

  // retrieve() L292-314: tdm.Tdm51_ChckOrg.selectDashboardProgress (companyId, checkYm, stdDate, statusType) → 모니터 3칸 → retrieveAll()
  const retrieve = async (o: { ym?: YearMonth; statusType?: StatusType } = {}) => {
    const v = o.ym ?? ym;
    const st = o.statusType ?? statusType;
    const checkYm = checkYmOf(v);
    const stdDate = firstDayOf(v);
    const my = ++seq.current;
    init();
    setLoading(true);
    try {
      const p = await tdmApi.getDashboardProgress({ checkYm, stdDate, statusType: st });
      if (my !== seq.current) return;
      setProgress(p);
      // retrieveAll() L316-321: setCheckEndInfo() + retrieve01~03()
      const [end, list1, list2, list3] = await Promise.all([
        tdmApi.getDashboardCheckEnd(checkYm),
        tdmApi.searchDashboardExctProgress({ checkYm, statusType: st }),   // retrieve01 L350-364 selectDashboardExct
        tdmApi.searchDashboardOrgProgress({ checkYm, statusType: st }),    // retrieve02 L366-380 selectDashboardOrg
        tdmApi.searchDashboardInsuff({ checkYm }),                          // retrieve03 L382-395 selectDashboardInsuff
      ]);
      if (my !== seq.current) return;
      setCheckEnd(end);
      setRows1(list1);
      setRows2(list2);
      setRows3(list3);
    } catch (err) {
      if (my === seq.current) message.error(errorMessage(err, '조회 실패'));
    } finally {
      if (my === seq.current) setLoading(false);
    }
  };

  // [E0] 화면 열림 (생성자 L106-183) → setDefault() L185-204: 진행 중인 점검년월로 SET, 없으면 현재월 → 조회
  useEffect(() => {
    let alive = true;
    (async () => {
      let v = thisMonth();
      try {
        const recent = await tdmApi.getDashboardRecentCheckYm();
        if (recent) v = ymOfCheckYm(recent);
      } catch { /* 진행 중인 점검년월을 못 읽어도 현재월로 계속한다 */ }
      if (!alive) return;
      setYm(v);
      void retrieve({ ym: v });   // QuickMoveField 생성 콜백 → retrieve()
    })();
    return () => { alive = false; };
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  useImperativeHandle(ref, () => ({ retrieve: () => retrieve() }));

  // buildGrid01() L239-253: getSumGrid("계", 2, 4, 8) · 묶음 "점검"
  const columns1 = useMemo(() => progressColumns([
    gbChck.textCenter('exctName', 100, '임원'),  // L242
    gbChck.text('roleName', 160, '직책'),  // L243
  ], 70, 70), []);
  // buildGrid02() L255-268: getSumGrid("계", 1, 3, 7)
  const columns2 = useMemo(() => progressColumns([
    gbChck.text('orgName', 240, '점검부서'),  // L258
  ], 70, 70), []);
  // buildGrid03() L270-290
  const columns3 = useMemo(() => [
    gbInsuff.textCenter('checkYm', 100, '발생년월'),  // L280
    gbInsuff.date('dueDate', 90, '조치예정일'),  // L281 (UX-08: 읽기 전용 날짜 90)
    gbInsuff.date('actionDate', 90, '조치완료일'),  // L282
    gbInsuff.textCenter('statusName', 100, '조치상태'),  // L283
    gbInsuff.text('orgName', 200, '조치부서'),  // L284
    gbInsuff.text('actionEmpName', 100, '조치(예정)자'),  // L285
    gbInsuff.text('actionName', 650, '조치명'),  // L286
    viewCell<TdmDashboardInsuff>('actionCell', 80, '상세보기', () => message.info(NEXT_STEP_MESSAGE)),  // L287 → Tdm54_Lookup_ChckInsuffCmnt.view (다음 단계 N24)
  ], []);

  return (
    <DashboardFrame
      progress={progress}
      toolbar={
        <DashboardToolbar
          ym={ym}
          onYmChange={setYm}
          onYmCommit={v => retrieve({ ym: v })}                                   // QuickMoveField monthComboBox collapse → retrieve()
          statusType={statusType}
          onStatusChange={st => { setStatusType(st); void retrieve({ statusType: st }); }}   // [E1] toggleGroup.ValueChange (L211) → retrieve()
          onRefresh={() => retrieve()}                                            // [E2] retrieveButton[새로고침].Select (L231) → retrieve()
          checkEnd={checkEnd}
        />
      }
    >
      {/* hlc01 L165-167: 가로 2분할(0.5/0.5), 높이 300, 여백 (10,5,10,10) / (10,10,10,5) */}
      <div style={{ flex: 'none', height: 300, display: 'flex' }}>
        <TitledGrid title="임원별 진행현황" style={{ flex: 0.5, margin: '10px 5px 10px 10px' }}>
          <SingleGrid<TdmDashboardChckOrg> rowData={rows1} columnDefs={columns1} getRowId={p => String(p.data.chckOrgId)} loading={loading} sumRow={progressSumRow('roleName')} />
        </TitledGrid>
        <TitledGrid title="부서별 진행현황" style={{ flex: 0.5, margin: '10px 10px 10px 5px' }}>
          <SingleGrid<TdmDashboardChckOrg> rowData={rows2} columnDefs={columns2} getRowId={p => String(p.data.chckOrgId)} loading={loading} sumRow={progressSumRow('orgName')} />
        </TitledGrid>
      </div>
      {/* vlc03 L161-163: 미흡 조치현황, 나머지 높이, 여백 10 */}
      <TitledGrid title="미흡 조치현황" style={{ flex: 1, margin: 10 }}>
        <SingleGrid<TdmDashboardInsuff> rowData={rows3} columnDefs={columns3} getRowId={p => String(p.data.chckInsuffId)} loading={loading} />
      </TitledGrid>
    </DashboardFrame>
  );
});
Tdm50_Tab_Dashboard.displayName = 'Tdm50_Tab_Dashboard';
