/**
 * [1456] 책무 > 04. 책무이행점검 > 업무점검자 지정 및 승인요청 (N21)
 * AS-IS: myApp/client/vi/tdm/Tdm51_Tab_CheckOrg.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L90-134: north(높이 200, 나눔선) = 툴바(점검년월 · 부서 [250] · [조회] · "※ 점검마감일 : …", 높이 50) + 부서 점검현황 그리드(묶음 "항목수"·"당월 이행점검결과"),
 * center = 점검항목 목록(Tdm51_TabPage_CheckOrg). 책무담당자·책무관리자(checkIsManager)만 부서를 바꿔 대신 작업할 수 있다.
 * 다음 단계(N22): 점검항목 [상세]가 여는 점검 창(Tdm52_Edit_ChckManl)은 N22에서 연결한다 — TabPage 참고
 * 생략: [부서책무담당자 관리] managerButton(L81) — 툴바에 넣는 줄이 주석 처리(L109)되어 도달 불가, 승인요청·요청취소 아이콘 열(L229-282, L315-316)도 주석 처리
 * UX보강(10): 툴바 = Button(UX-01), 부서 칸 = LookupInput, 조회창(UX-05·06)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Splitter, message } from 'antd';
import type { ICellRendererParams } from 'ag-grid-community';
import type { AgGridReact } from 'ag-grid-react';
import dayjs from 'dayjs';
import { errorMessage } from '@/api/client';
import { tdmApi } from '@/api/tdm';
import { TdmCheckOrg } from '@/types/tdm';
import { OrgTdm } from '@/types/emp';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { QuickMoveField, YearMonth } from '@/components/form/QuickMoveField';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Org00_Lookup_SelectTdm } from '@/components/lookup/Org00_Lookup_SelectTdm';
import { checkYmOf, firstDayOf, ymOfCheckYm } from './Tdm50_Dashboard_Common';
import { CheckOrgTarget, Tdm51_TabPage_CheckOrg } from './Tdm51_TabPage_CheckOrg';
import { Tdm55_Lookup_ChckRecord } from './Tdm55_Lookup_ChckRecord';

const gb = gbFor<TdmCheckOrg>();
const GRAY = '#404040';
const BLUE = '#456EA6';

/** addLongCnt(…, [headerColor,] color) L1546·L1588 — 굵은 "N건", null·0은 #404040의 "0건", 오른쪽 정렬. 4개 인자 꼴의 color는 `#` 없는 "404040"이라 CSS로는 무효(기본 글자색) */
const cnt = (field: keyof TdmCheckOrg & string, w: number, header: string, headerColor?: string, valueColor?: string) => {
  const Cell = (p: ICellRendererParams) => {
    const v = p.value as number | null | undefined;
    return <b style={v == null || v === 0 ? { color: GRAY } : { color: valueColor }}>{v == null ? 0 : v}건</b>;
  };
  return gb.long(field, w, header, { cellRenderer: Cell, valueFormatter: undefined, ...(headerColor ? { headerStyle: { color: headerColor } } : {}) });
};

/** buildGrid() L227-321 — 묶음 "항목수"(3번 열부터 5칸)·"당월 이행점검결과"(8번 열부터 4칸), 승인요청·요청취소 열은 주석 처리 */
const buildGrid = (openRecord: (row: TdmCheckOrg) => void) => [
  gb.text('roleName', 200, '직책'),  // L298
  gb.textCenter('exctName', 80, '임원'),  // L299
  {
    ...gb.group('항목수', [  // L295 HeaderGroupMap(0, 3, HeaderGroupConfig(…, 1, 5))
      cnt('taskCnt', 80, '책무'),  // L301
      cnt('detailCnt', 80, '책무세부'),  // L302
      cnt('dutyCnt', 80, '괸리의무'),  // L303 (제목 오타 그대로)
      cnt('manlCnt', 80, '점검항목'),  // L304
      cnt('monthManlCnt', 80, '당월대상'),  // L305
    ]),
    headerStyle: { color: GRAY, fontWeight: 'bold' },
  },
  {
    ...gb.group('당월 이행점검결과', [  // L296 HeaderGroupMap(0, 8, HeaderGroupConfig(…, 1, 4))
      cnt('monthCheckCnt', 80, '점검건수', BLUE, GRAY),  // L307
      cnt('monthCheck1Cnt', 80, '적정', BLUE, GRAY),  // L308
      cnt('monthCheck2Cnt', 80, '미흡', BLUE, GRAY),  // L309
      cnt('monthCheck9Cnt', 80, '해당없음', BLUE, GRAY),  // L310
    ]),
    headerStyle: { color: BLUE, fontWeight: 'bold' },
  },
  cnt('insuffCnt', 80, '진행중 또는<br>완료된<br>미흡/개선'),  // L312
  gb.booleanYn2('checkEndYn', 80, '점검<br>완료'),  // L313
  gb.textStatus('orgStatusName', 100, '승인상태'),  // L317
  iconCell<TdmCheckOrg>('view', 'actionCell', 80, '승인이력', openRecord),  // L318 → Tdm55_Lookup_ChckRecord.open(chckOrgId, "TDM51")
];

export const Tdm51_Tab_CheckOrg: React.FC = () => {
  const now = new Date();
  const gridRef = useRef<AgGridReact<TdmCheckOrg>>(null);
  const [ym, setYm] = useState<YearMonth>({ year: now.getFullYear(), month: now.getMonth() + 1 });
  const [org, setOrg] = useState<{ id: number | null; name: string }>({ id: null, name: '' });   // orgId · orgLookup 값
  const [isTdmManager, setIsTdmManager] = useState(false);
  const [notice, setNotice] = useState('※ 점검마감일 : 0000-00-00');                              // noticeEndDate
  const [rows, setRows] = useState<TdmCheckOrg[]>([]);
  const [target, setTarget] = useState<CheckOrgTarget>({ org: null, stdDate: firstDayOf(ym), endYn: false, nonce: 0 });
  const [orgLookup, setOrgLookup] = useState(false);
  const [recordOrgId, setRecordOrgId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const targetRef = useRef(target);
  targetRef.current = target;
  const nonceRef = useRef(0);
  const columnDefs = useMemo(() => buildGrid(row => setRecordOrgId(row.chckOrgId)), []);

  // retrieve() L323-346: tabPage.clear() → setCheckEndInfo(): tdm.Tdm50_ChckJob.selectByCheckYm → 마감 안내 글 → tdm.Tdm51_ChckOrg.selectByOrgId(checkYm, orgId) → 첫 행 선택
  // 값은 호출한 자리에서 막 바꾼 것(월 콤보·부서 조회창)이라 상태 반영 전이므로 인자로 받는다
  const retrieve = useCallback(async (v: YearMonth, orgId: number | null) => {
    setTarget(t => ({ ...t, org: null }));
    if (orgId == null) { setRows([]); return; }
    setLoading(true);
    try {
      const job = await tdmApi.searchCheckJob(checkYmOf(v));
      const endYn = !!job?.endYn;
      if (job) {
        setNotice(endYn ? '※ 점검이 마감되었습니다' : job.endDate ? `※ 점검마감일 : ${job.endDate}` : '※ 점검마감일 : ');
      } else {
        setNotice('');
      }
      const list = await tdmApi.searchCheckOrgStatuses(checkYmOf(v), orgId);
      setRows(list);
      if (list.length > 0) {
        setTarget({ org: list[0], stdDate: firstDayOf(v), endYn, nonce: ++nonceRef.current });
        setTimeout(() => gridRef.current?.api.getDisplayedRowAtIndex(0)?.setSelected(true), 0);
      }
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, []);

  // [E0] 화면 열림 (생성자 L90-134) → setDefault() L136-155: tdm.Tdm50_ChckJob.selectRcntChckJob — 진행 중인 점검년월(없으면 현재월)
  // → settings() L157-204: 부서 = 로그인 사용자 부서, setIsManager() L206-225: tdm.Tdm08_ManagerInfo.checkIsManager(오늘) → 부서 칸 사용 여부 → retrieve()
  useEffect(() => {
    void (async () => {
      let v = ym;
      try {
        const recent = await tdmApi.recentCheckYm();
        if (recent) { v = ymOfCheckYm(recent); setYm(v); }
      } catch (err) {
        message.error(errorMessage(err, '조회 실패'));
      }
      let orgId: number | null = null;
      try {
        const my = await tdmApi.getDashboardMyOrg();
        if (my) { orgId = my.orgCodeId; setOrg({ id: my.orgCodeId, name: my.korName ?? '' }); }
        setIsTdmManager(await tdmApi.isDashboardManager(dayjs().format('YYYY-MM-DD')));
      } catch (err) {
        message.error(errorMessage(err, '조회 실패'));
      }
      await retrieve(v, orgId);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // [E1] orgLookup.TriggerClick (L159) → Org00_Lookup_SelectTdm.open(점검년월 첫날, null, true, …): 고른 조직으로 바꾸고 retrieve()
  const onOrgResult = (picked: OrgTdm | null) => {
    setOrgLookup(false);
    if (!picked) return;
    setOrg({ id: picked.orgCodeId, name: picked.korNm ?? '' });
    void retrieve(ym, picked.orgCodeId);
  };

  // [E3] grid.SelectionChanged [선택>0] (L196) → retrieveTabPage() L348-354: tabPage.retrieve(고른 행, 점검년월 첫날, endYn)
  const onSelect = (row: TdmCheckOrg | undefined) => {
    if (!row || row.chckOrgId === targetRef.current.org?.chckOrgId) return;
    setTarget(t => ({ org: row, stdDate: firstDayOf(ym), endYn: t.endYn, nonce: ++nonceRef.current }));
  };

  return (
    <>
    <Splitter layout="vertical" style={{ height: '100%', background: '#fff' }}>
      <Splitter.Panel defaultSize={220} min={120} max={600}>
        <div style={{ height: '100%', padding: '20px 20px 0', boxSizing: 'border-box' }}>
          <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 'none', height: 50, display: 'flex', alignItems: 'center', gap: 8, padding: '0 8px', boxSizing: 'border-box' }}>
              <b>점검년월</b>
              <QuickMoveField {...ym} onChange={setYm} onCommit={v => { void retrieve(v, org.id); }} />
              <b>부서</b>
              <LookupInput value={org.name} width={250} disabled={!isTdmManager} onOpen={() => setOrgLookup(true)} />
              {/* [E2] retrieveButton[조회].Select (L178) → retrieve() */}
              <Button type="search" onClick={() => retrieve(ym, org.id)} disabled={loading}>조회</Button>
              <b style={{ color: '#262d3f', fontSize: 12, marginLeft: 5 }}>{notice}</b>
            </div>
            <div style={{ flex: 1, minHeight: 0 }}>
              <SingleGrid<TdmCheckOrg>
                gridRef={gridRef}
                rowData={rows}
                columnDefs={columnDefs}
                getRowId={p => String(p.data.chckOrgId)}
                loading={loading}
                onSelect={onSelect}
              />
            </div>
          </div>
        </div>
      </Splitter.Panel>
      <Splitter.Panel min={150}>
        <div style={{ height: '100%', padding: '0 20px 20px', boxSizing: 'border-box' }}>
          <Tdm51_TabPage_CheckOrg target={target} onChanged={() => { void retrieve(ym, org.id); }} />
        </div>
      </Splitter.Panel>
    </Splitter>
      <Org00_Lookup_SelectTdm stdDate={orgLookup ? firstDayOf(ym) : undefined} single onClose={() => setOrgLookup(false)} onSelect={onOrgResult} />
      <Tdm55_Lookup_ChckRecord chckOrgId={recordOrgId} onClose={() => setRecordOrgId(null)} />
    </>
  );
};
