/**
 * [1457] 책무 > 04. 책무이행점검 > 책무이행점검 (N22)
 * AS-IS: myApp/client/vi/tdm/Tdm52_Tab_CheckManl.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L103-154: north(높이 200, 나눔선) = 툴바(점검년월 · 점검자 [230, 책무담당자·관리자만] · 검색 [230 "점검항목"] · 진행&반려건만 · [조회] · "※ 점검마감일 : …" | 오른쪽 [일괄점검][일괄점검취소])
 *   + 부서 점검현황 그리드(묶음 "점검결과"), center = 점검자의 점검항목 목록(Tdm52_TabPage_CheckManl)
 * 점검 창(Tdm52_Edit_ChckManl)·일괄점검 창·조치계획 창은 목록에서 연다. 다음 단계: 증빙자료 창(Tdm00_Lookup_RelateAppr)·[AI] 점검의견 — 목록/창 쪽 주석 참고
 * UX보강(10): 툴바 = Button(UX-01), 점검자 칸 = LookupInput, 조회창(UX-05·06)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, Input, Modal, Splitter, message } from 'antd';
import type { ICellRendererParams } from 'ag-grid-community';
import type { AgGridReact } from 'ag-grid-react';
import dayjs from 'dayjs';
import { errorMessage } from '@/api/client';
import { tdmApi } from '@/api/tdm';
import { TdmCheckOrg } from '@/types/tdm';
import { TransTdm } from '@/types/emp';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { QuickMoveField, YearMonth } from '@/components/form/QuickMoveField';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Emp00_Lookup_SelectSingleTdm } from '@/components/lookup/Emp00_Lookup_SelectSingleTdm';
import { useLoginUser } from '@/hooks/useLoginUser';
import { checkYmOf, firstDayOf, ymOfCheckYm } from './Tdm50_Dashboard_Common';
import { CheckManlTarget, Tdm52_TabPage_CheckManl, Tdm52_TabPage_CheckManlHandle } from './Tdm52_TabPage_CheckManl';
import { Tdm55_Lookup_ChckRecord } from './Tdm55_Lookup_ChckRecord';

const gb = gbFor<TdmCheckOrg>();
const GRAY = '#404040';
const BLUE = '#456EA6';

/** addLongCnt(…) L1546·L1588 — 굵은 "N건", null·0은 #404040의 "0건", 오른쪽 정렬 (Tdm51_Tab_CheckOrg와 같다) */
const cnt = (field: keyof TdmCheckOrg & string, w: number, header: string, headerColor?: string, valueColor?: string) => {
  const Cell = (p: ICellRendererParams) => {
    const v = p.value as number | null | undefined;
    return <b style={v == null || v === 0 ? { color: GRAY } : { color: valueColor }}>{v == null ? 0 : v}건</b>;
  };
  return gb.long(field, w, header, { cellRenderer: Cell, valueFormatter: undefined, ...(headerColor ? { headerStyle: { color: headerColor } } : {}) });
};

/** buildGrid() L273-317 — 묶음 "점검결과"는 5번 열부터 3칸(적정·미흡·해당없음, 행번호가 0번), 점검건수는 묶음 밖 */
const buildGrid = (startCheck: (row: TdmCheckOrg) => void, cancelCheck: (row: TdmCheckOrg) => void, openRecord: (row: TdmCheckOrg) => void) => [
  gb.text('roleName', 200, '직책'),  // L295
  gb.textCenter('exctName', 80, '임원'),  // L296
  cnt('monthManlCnt', 80, '당월대상'),  // L297
  cnt('monthCheckCnt', 80, '점검건수', BLUE, GRAY),  // L298
  {
    ...gb.group('점검결과', [  // L294 HeaderGroupMap(0, 5, HeaderGroupConfig(…, 1, 3))
      cnt('monthCheck1Cnt', 80, '적정', BLUE, GRAY),  // L299
      cnt('monthCheck2Cnt', 80, '미흡', BLUE, GRAY),  // L300
      cnt('monthCheck9Cnt', 80, '해당없음', BLUE, GRAY),  // L301
    ]),
    headerStyle: { color: BLUE, fontWeight: 'bold' },
  },
  gb.textStatus('checkStatusName', 100, '점검상태'),  // L302
  iconCell<TdmCheckOrg>('edit', 'startCell', 70, '점검시작', startCheck),  // L303 → checkPreStart("P")
  iconCell<TdmCheckOrg>('delete', 'cancelCell', 70, '시작취소', cancelCheck),  // L304 → checkPreStart("C")
  gb.textStatus('orgStatusName', 100, '승인상태'),  // L305
  iconCell<TdmCheckOrg>('view', 'recordCell', 70, '승인이력', openRecord),  // L306 → Tdm55_Lookup_ChckRecord.open(chckOrgId, "TDM51")
];

export const Tdm52_Tab_CheckManl: React.FC = () => {
  const user = useLoginUser();
  const now = new Date();
  const gridRef = useRef<AgGridReact<TdmCheckOrg>>(null);
  const tabPageRef = useRef<Tdm52_TabPage_CheckManlHandle>(null);
  const [ym, setYm] = useState<YearMonth>({ year: now.getFullYear(), month: now.getMonth() + 1 });
  // checkEmpLookup 값 · checkEmpId · checkOrgId (settings L177-250: 로그인 사용자와 그 부서)
  const [checker, setChecker] = useState<{ id: number | null; orgId: number | null; label: string }>({ id: null, orgId: null, label: '' });
  const [isTdmManager, setIsTdmManager] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [undoneYn, setUndoneYn] = useState(false);                                  // undoneCheckBox "진행&반려건만" = false
  const [notice, setNotice] = useState('※ 점검마감일 : 0000-00-00');                // noticeEndDate
  const [batch, setBatch] = useState({ enabled: false, visible: true });            // selectCheckButton·selectCancelButton
  const [rows, setRows] = useState<TdmCheckOrg[]>([]);
  const [target, setTarget] = useState<CheckManlTarget>({ org: null, checkEmpId: null, endYn: false, undoneYn: false, stdDate: firstDayOf(ym), nonce: 0 });
  const [empLookup, setEmpLookup] = useState(false);
  const [recordOrgId, setRecordOrgId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const endYnRef = useRef(false);                                                    // endYn — 마감 정보가 없는 점검년월은 앞의 값 그대로(원본 필드)
  const nonceRef = useRef(0);
  const latest = useRef({ ym, checker, undoneYn, rows });
  latest.current = { ym, checker, undoneYn, rows };
  const selectedRef = useRef<TdmCheckOrg | undefined>(undefined);

  // retrieveTabPage() L357-370: 목록이 비어 있으면 아무것도 안 한다
  // 점검자·점검년월은 조회창·월 콤보에서 막 바꾼 값이라 상태 반영 전이므로 over로 받는다
  const retrieveTabPage = useCallback((org: TdmCheckOrg | undefined, over: { undoneYn?: boolean; checkEmpId?: number | null; ym?: YearMonth } = {}) => {
    const c = latest.current;
    if (!org) return;
    setTarget({
      org, checkEmpId: over.checkEmpId !== undefined ? over.checkEmpId : c.checker.id, endYn: endYnRef.current,
      undoneYn: over.undoneYn ?? c.undoneYn, stdDate: firstDayOf(over.ym ?? c.ym), nonce: ++nonceRef.current,
    });
  }, []);

  // retrieve() L319-355: tabPage.clear() → setCheckEndInfo() L455-499 → tdm.Tdm51_ChckOrg.selectByOrgId(checkYm, orgId, personId) → 첫 행 선택
  // 값은 호출한 자리에서 막 바꾼 것(월 콤보·점검자 조회창)이라 상태 반영 전이므로 인자로 받는다
  const retrieve = useCallback(async (v: YearMonth, c: { id: number | null; orgId: number | null }) => {
    setTarget(t => ({ ...t, org: null }));
    selectedRef.current = undefined;
    if (c.id == null || c.orgId == null) { setRows([]); return; }
    setBatch(b => ({ ...b, enabled: false }));                                      // selectCheckButton·selectCancelButton.setEnabled(false)
    setLoading(true);
    try {
      const job = await tdmApi.searchCheckJob(checkYmOf(v));
      if (job) {
        endYnRef.current = !!job.endYn;
        if (job.endYn) {
          setNotice('※ 점검이 마감되었습니다');
          setBatch({ enabled: false, visible: false });
        } else {
          setNotice(job.endDate ? `※ 점검마감일 : ${job.endDate}` : '※ 점검마감일 : ');
          setBatch({ enabled: true, visible: !!job.batchCheckUseYn });
        }
      } else {
        setNotice('');
      }
      const list = await tdmApi.searchCheckOrgStatuses(checkYmOf(v), c.orgId, c.id);
      setRows(list);
      if (list.length > 0) {
        selectedRef.current = list[0];
        setTimeout(() => gridRef.current?.api.getDisplayedRowAtIndex(0)?.setSelected(true), 0);
        retrieveTabPage(list[0], { checkEmpId: c.id, ym: v });
      }
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [retrieveTabPage]);

  // [E0] 화면 열림 (생성자 L103-154) → setDefault() L156-175: tdm.Tdm50_ChckJob.selectRcntChckJob — 진행 중인 점검년월(없으면 현재월)
  // → settings() L177-250: 점검자 = 로그인 사용자(이름(부서)), setIsManager() L252-271: tdm.Tdm08_ManagerInfo.checkIsManager(오늘) → 점검자 칸 사용 여부 → retrieve()
  useEffect(() => {
    void (async () => {
      let v = ym;
      try {
        const recent = await tdmApi.recentCheckYm();
        if (recent) { v = ymOfCheckYm(recent); setYm(v); }
      } catch (err) {
        message.error(errorMessage(err, '조회 실패'));
      }
      let c: { id: number | null; orgId: number | null; label: string } = { id: user.userId, orgId: null, label: '' };
      try {
        const my = await tdmApi.getDashboardMyOrg();
        if (my) c = { id: user.userId, orgId: my.orgCodeId, label: `${user.name}(${my.korName ?? ''})` };
        setIsTdmManager(await tdmApi.isDashboardManager(dayjs().format('YYYY-MM-DD')));
      } catch (err) {
        message.error(errorMessage(err, '조회 실패'));
      }
      setChecker(c);
      latest.current = { ...latest.current, ym: v, checker: c };
      await retrieve(v, c);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // [E1] checkEmpLookup.TriggerClick (L179) → Emp00_Lookup_SelectSingleTdm.open(점검년월 첫날, …): 고른 사원 `이름(부서)`로 바꾸고 retrieve()
  const onEmpResult = (p: TransTdm) => {
    setEmpLookup(false);
    const c = { id: p.personId, orgId: p.orgId ?? null, label: `${p.korNm ?? ''}(${p.orgNm ?? ''})` };
    setChecker(c);
    void retrieve(ym, c);
  };

  // [E7] grid.SelectionChanged [선택>0] (L242) → retrieveTabPage()
  const onSelect = (row: TdmCheckOrg | undefined) => {
    if (!row || row.chckOrgId === selectedRef.current?.chckOrgId) return;
    selectedRef.current = row;
    retrieveTabPage(row);
  };

  // checkPreStart(actionType) L372-425 → [E8] messageBox.DialogHide [YES] (L415) → updateCheckStatus() L427-453
  const checkPreStart = (row: TdmCheckOrg, actionType: 'P' | 'C') => {
    if (endYnRef.current) { message.warning('이행점검이 마감되었습니다'); return; }
    if (!row.fixYn) { message.warning('이행점검 점검자 확정처리 전 입니다'); return; }
    if (row.checkStatusCode === '10' && actionType === 'C') { message.warning('점검시작 전입니다'); return; }
    if (row.checkStatusCode === '11' && actionType === 'P') { message.warning('점검 진행중입니다'); return; }
    if (row.orgStatusCode != null) { message.warning('승인 진행중입니다'); return; }
    let msg = `${ym.year}년 ${ym.month}월 점검을 `;
    let width = 350;
    if (actionType === 'P') {
      msg += '시작하시겠습니까?';
    } else {
      msg = '취소시 점검내역(조치등록내역 포함)이 삭제됩니다. 진행하시겠습니까?';
      width = 530;
    }
    Modal.confirm({
      title: '확인', content: msg, width, okText: '예', cancelText: '아니오',
      onOk: async () => {
        try {
          await tdmApi.updateCheckStatus(row.chckOrgId, latest.current.checker.id ?? 0, actionType);
        } catch (err) {
          message.info(errorMessage(err, '처리 실패'));
          return;
        }
        message.info(actionType === 'P' ? '점검이 시작되었습니다.' : '점검시작이 취소되었습니다.');
        void retrieve(latest.current.ym, latest.current.checker);
      },
    });
  };

  const columnDefs = useMemo(
    () => buildGrid(r => checkPreStart(r, 'P'), r => checkPreStart(r, 'C'), r => setRecordOrgId(r.chckOrgId)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <>
    <Splitter layout="vertical" style={{ height: '100%', background: '#fff' }}>
      <Splitter.Panel defaultSize={220} min={120} max={600}>
        <div style={{ height: '100%', padding: '20px 20px 0', boxSizing: 'border-box' }}>
          <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 'none', height: 50, display: 'flex', alignItems: 'center', gap: 8, padding: '0 8px', boxSizing: 'border-box' }}>
              <b>점검년월</b>
              <QuickMoveField {...ym} onChange={setYm} onCommit={v => { void retrieve(v, checker); }} />
              <b style={{ marginLeft: 4 }}>점검자</b>
              <LookupInput value={checker.label} width={230} disabled={!isTdmManager} onOpen={() => setEmpLookup(true)} />
              <b style={{ marginLeft: 4 }}>검색</b>
              {/* [E2] searchText.KeyPress [Enter] (L201) → retrieve() */}
              <Input style={{ width: 230 }} placeholder="점검항목" value={searchText} allowClear
                onChange={e => setSearchText(e.target.value)} onPressEnter={() => { void retrieve(ym, checker); }} />
              {/* [E3] undoneCheckBox[진행&반려건만].ValueChange (L211) → retrieveTabPage() */}
              <Checkbox checked={undoneYn} onChange={e => { setUndoneYn(e.target.checked); retrieveTabPage(selectedRef.current, { undoneYn: e.target.checked }); }}>진행&amp;반려건만</Checkbox>
              {/* [E6] retrieveButton[조회].Select (L235) → retrieve() */}
              <Button type="search" onClick={() => retrieve(ym, checker)} disabled={loading}>조회</Button>
              <b style={{ color: '#262d3f', fontSize: 12, marginLeft: 5 }}>{notice}</b>
              <div style={{ flex: 1 }} />
              {batch.visible && (
                <>
                  {/* [E4] selectCheckButton[일괄점검].Select (L220) → tabPage.lookupBatchCheckManl("P") */}
                  <Button type="save" disabled={!batch.enabled} onClick={() => tabPageRef.current?.lookupBatchCheckManl('P')}>일괄점검</Button>
                  {/* [E5] selectCancelButton[일괄점검취소].Select (L228) → tabPage.lookupBatchCheckManl("C") */}
                  <Button type="cancel" disabled={!batch.enabled} onClick={() => tabPageRef.current?.lookupBatchCheckManl('C')}>일괄점검취소</Button>
                </>
              )}
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
          <Tdm52_TabPage_CheckManl ref={tabPageRef} target={target} searchText={searchText} onChanged={() => { void retrieve(latest.current.ym, latest.current.checker); }} />
        </div>
      </Splitter.Panel>
    </Splitter>
      <Emp00_Lookup_SelectSingleTdm open={empLookup} stdDate={firstDayOf(ym)} onResult={onEmpResult} onClose={() => setEmpLookup(false)} />
      <Tdm55_Lookup_ChckRecord chckOrgId={recordOrgId} onClose={() => setRecordOrgId(null)} />
    </>
  );
};
