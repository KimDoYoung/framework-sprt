/**
 * [1458] 책무 > 04. 책무이행점검 > 책무이행점검 승인 (N23)
 * AS-IS: myApp/client/vi/tdm/Tdm59_Tab_CheckAppr.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L95-137: north(0.3, 나눔선) = 툴바(점검년월 · 직책 [250] · [조회] · [제출][제출취소]) + 안내 줄("※ 의견등록상태를 더블클릭하여…" · "※ 점검마감일 : …") + 승인 현황 그리드(묶음 "이행점검결과"·"미흡/개선 내역"·"의견등록상태"),
 *   center = 고른 승인 행의 점검상세 · 미흡/개선 내역(Tdm59_TabPage_CheckAppr)
 * 승인(반려) 의견·보고의견·승인이력 창은 그리드 아이콘이, 하위·상위 부서 의견은 의견등록상태 칸 더블클릭이 연다. 다음 단계: 증빙자료 창(Tdm00_Lookup_RelateAppr)은 승인 창 안에서 안내만
 * UX보강(10): 툴바 = Button(UX-01), 직책 칸 = LookupInput, 조회창(UX-05·06)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Modal, Splitter, message } from 'antd';
import type { ICellRendererParams } from 'ag-grid-community';
import { errorMessage } from '@/api/client';
import { tdmApi } from '@/api/tdm';
import { TdmCheckApprCmnt, TdmRole } from '@/types/tdm';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { dynamicIconCell, iconCell } from '@/components/grid/iconCell';
import { QuickMoveField, YearMonth } from '@/components/form/QuickMoveField';
import { AreaMessage } from '@/components/lookup/AreaMessage';
import { LookupInput } from '@/components/lookup/LookupInput';
import { checkYmOf, firstDayOf, ymOfCheckYm } from './Tdm50_Dashboard_Common';
import { Tdm20_Lookup_SelectRole } from './Tdm20_Lookup_SelectRole';
import { CmntEditTarget, Tdm59_Edit_Cmnt } from './Tdm59_Edit_Cmnt';
import { Tdm59_Edit_ReportCmnt } from './Tdm59_Edit_ReportCmnt';
import { CheckApprTabPageTarget, Tdm59_TabPage_CheckAppr } from './Tdm59_TabPage_CheckAppr';
import { Tdm55_Lookup_ChckRecord2 } from './Tdm55_Lookup_ChckRecord2';

const gb = gbFor<TdmCheckApprCmnt>();
const GRAY = '#404040';
const BLUE = '#456EA6';

/** addLongCntNull L1567-1586 — 값이 없으면 빈 칸, 있으면 굵은 "N건", 오른쪽 정렬 */
const cnt = (field: keyof TdmCheckApprCmnt & string, w: number, header: string, headerColor: string, valueColor: string) => {
  const Cell = (p: ICellRendererParams) => {
    const v = p.value as number | null | undefined;
    return v == null ? <></> : <b style={{ color: valueColor }}>{v}건</b>;
  };
  return gb.long(field, w, header, { cellRenderer: Cell, valueFormatter: undefined, headerStyle: { color: headerColor } });
};

/** 읽기 전용 판정 — lookupApprCmnt() L489-521 · lookupReportCmnt() L523-555 (마감 · 제출됨 · 승인상태 없음 · 점검상태가 20 이하) */
const isReadOnlyRow = (row: TdmCheckApprCmnt, endYn: boolean): boolean => {
  let ro = false;
  if (endYn) ro = true;
  if (row.submitYn) ro = true;
  else if (row.apprStatusCode == null) ro = true;
  else if (row.checkStatusCode != null && row.checkStatusCode <= '20') ro = true;   // compareTo("20") < 1
  return ro;
};

export const Tdm59_Tab_CheckAppr: React.FC = () => {
  const now = new Date();
  const [ym, setYm] = useState<YearMonth>({ year: now.getFullYear(), month: now.getMonth() + 1 });
  const [role, setRole] = useState<{ id: number | null; name: string }>({ id: null, name: '' });
  const [rows, setRows] = useState<TdmCheckApprCmnt[]>([]);
  const [loading, setLoading] = useState(false);
  const [noticeEnd, setNoticeEnd] = useState('※ 점검마감일 : 0000-00-00');          // noticeEndDate
  const [noticeCmntVisible, setNoticeCmntVisible] = useState(true);               // noticeCmnt
  const [submit, setSubmit] = useState({ visible: true, enabled: false });        // submitButton·submitCanleButton
  const [tabTarget, setTabTarget] = useState<CheckApprTabPageTarget>({ cmnt: null, endYn: false, batchApprUseYn: false, nonce: 0 });
  const [roleLookup, setRoleLookup] = useState(false);
  const [recordRow, setRecordRow] = useState<TdmCheckApprCmnt | null>(null);
  const [cmntWin, setCmntWin] = useState<CmntEditTarget | null>(null);
  const [reportWin, setReportWin] = useState<CmntEditTarget | null>(null);
  const [opinion, setOpinion] = useState<{ title: string; text: string } | null>(null);
  const nonceRef = useRef(0);
  const endYnRef = useRef(false);
  const batchRef = useRef(false);
  const selectedRef = useRef<number | null>(null);
  const latest = useRef({ ym, role, rows });
  latest.current = { ym, role, rows };

  // retrieveTabPage() L405-412: 목록이 비어 있으면 아무것도 안 한다 → tabPage.retrieve(model, endYn, stdDate, checkYm, batchApprUseYn)
  const retrieveTabPage = useCallback((cmnt: TdmCheckApprCmnt) => {
    setTabTarget({ cmnt, endYn: endYnRef.current, batchApprUseYn: batchRef.current, nonce: ++nonceRef.current });
  }, []);

  // setCheckEndInfo(callback) L557-620 — 직책이 없으면 아무 일도 안 한다(callback도 부르지 않는다)
  const setCheckEndInfo = useCallback(async (v: YearMonth, roleId: number | null): Promise<boolean> => {
    if (roleId == null) return false;
    setSubmit(s => ({ ...s, enabled: false }));
    const info = await tdmApi.getCheckApprEndInfo(checkYmOf(v));
    if (info) {
      endYnRef.current = info.endYn;
      batchRef.current = info.batchApprUseYn;
      if (info.endYn) {
        setSubmit({ visible: false, enabled: false });
        setNoticeEnd('※ 점검이 마감되었습니다');
      } else {
        setSubmit({ visible: true, enabled: true });
        setNoticeEnd(`※ 점검마감일 : ${info.endDate ?? ''}`);
      }
      setNoticeCmntVisible(true);
    } else {
      setNoticeEnd('');
      setNoticeCmntVisible(false);
      setSubmit({ visible: false, enabled: false });
    }
    return true;
  }, []);

  // retrieve() L364-403: tabPage.clear() → setCheckEndInfo() → tdm.Tdm59_ChckApprCmnt.selectByApprEmpId → 마지막 행 선택 (26.10.22 JSH)
  // 점검년월·직책은 월 콤보·조회창에서 막 바꾼 값이라 상태 반영 전이므로 인자로 받는다
  const retrieve = useCallback(async (v: YearMonth, roleId: number | null) => {
    setTabTarget(t => ({ ...t, cmnt: null }));
    selectedRef.current = null;
    setLoading(true);
    try {
      if (!(await setCheckEndInfo(v, roleId))) return;
      const list = await tdmApi.searchCheckApprCmnts(checkYmOf(v), roleId as number);
      setRows(list);
      if (list.length > 0) {
        const last = list[list.length - 1];
        selectedRef.current = last.chckApprCmntId;
        retrieveTabPage(last);
      }
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [setCheckEndInfo, retrieveTabPage]);

  // setInitRoleId() L273-300: tdm.Tdm20_Role.selectCheckTargetRole — 0건이면 "연결된 직책이 없습니다", 1건이면 그 직책으로 조회, 2건 이상이면 직책 조회창(lookupRole)
  const setInitRoleId = useCallback(async (v: YearMonth) => {
    try {
      const roles = await tdmApi.searchCheckTargetRoles(checkYmOf(v));
      setRole({ id: null, name: '' });
      if (roles.length === 0) return;
      if (roles.length === 1) {
        const r = { id: roles[0].roleId, name: roles[0].roleName ?? '' };
        setRole(r);
        latest.current = { ...latest.current, role: r };
        await retrieve(v, r.id);
      } else {
        setRoleLookup(true);
      }
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [retrieve]);

  // [E0] 화면 열림 (생성자 L95-137) → setDefault() L139-158: tdm.Tdm50_ChckJob.selectRcntChckJob — 진행 중인 점검년월(없으면 현재월) → settings() → setInitRoleId()
  useEffect(() => {
    void (async () => {
      let v = ym;
      try {
        const recent = await tdmApi.recentCheckYm();
        if (recent) { v = ymOfCheckYm(recent); setYm(v); }
      } catch (err) {
        message.error(errorMessage(err, '조회 실패'));
      }
      latest.current = { ...latest.current, ym: v };
      await setInitRoleId(v);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // [E4] roleLookup.TriggerClick (L162) → lookupRole() L302-315: Tdm20_Lookup_SelectRole.openTarget(점검년월 첫날, 로그인 사용자) → 직책을 바꾸고 retrieve()
  const onRoleSelect = (r: TdmRole) => {
    const next = { id: r.roleId, name: r.roleName ?? '' };
    setRole(next);
    void retrieve(latest.current.ym, next.id);
  };

  // [E8] grid.SelectionChanged [선택>0] (L214) → retrieveTabPage()
  const onSelect = (row: TdmCheckApprCmnt | undefined) => {
    if (!row || row.chckApprCmntId === selectedRef.current) return;
    selectedRef.current = row.chckApprCmntId;
    retrieveTabPage(row);
  };

  // preUpdateSubmit(actionType) L414-457 → [E10] messageBox.DialogHide [YES] (L441) → updateSubmit() L459-487
  const preUpdateSubmit = async (actionType: 'P' | 'C') => {
    const model = latest.current.rows[0];
    if (!model) { message.warning('승인내역이 존재하지 않습니다'); return; }
    try {
      await tdmApi.checkCheckApprSubmitPossible(model.checkYm, model.roleId, actionType);
    } catch (err) {
      message.info(errorMessage(err, '처리 실패'));
      return;
    }
    const base = `${latest.current.ym.year}년 ${latest.current.ym.month}월 책무이행 점검내역`;
    Modal.confirm({
      title: '확인', content: base + (actionType === 'P' ? '을 제출하시겠습니까?' : ' 제출을 취소하시겠습니까?'), width: 450, okText: '예', cancelText: '아니오',
      onOk: async () => {
        try {
          await tdmApi.submitCheckApprs(model.checkYm, model.roleId, actionType);
        } catch (err) {
          message.info(errorMessage(err, '처리 실패'));
          return;
        }
        message.info(actionType === 'P' ? '제출이 완료되었습니다' : '제출 취소가 완료되었습니다');
        void retrieve(latest.current.ym, latest.current.role.id);
      },
    });
  };

  // getCmnt(targetType, selectModel, callback) L622-635: tdm.Tdm59_ChckApprCmnt.selectPreNextOrg
  const getCmnt = async (row: TdmCheckApprCmnt, targetType: 'pre' | 'next') => {
    try {
      return await tdmApi.getCheckApprNeighbor(row.chckApprCmntId, targetType);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
      return null;
    }
  };

  // [E9] grid.CellDoubleClick [cellIndex == 10·11·12] (L223) → 의견등록상태 칸: 하위부서(10)·My부서(11)·상위부서(12)의 의견 보기 (AreaMessage.open)
  const onCellDoubleClicked = async (row: TdmCheckApprCmnt | undefined, colId: string) => {
    if (!row) return;
    if (colId === 'preApprStatusName') {
      const v = row.preApprStatusName;
      if (v != null && v !== '-' && v !== '미등록') {
        const n = await getCmnt(row, 'pre');
        if (n) setOpinion({ title: `${n.apprOrgName ?? ''}의 보고 의견`, text: n.reportCmnt ?? '' });
      }
    } else if (colId === 'apprStatusName') {
      const v = row.apprStatusName;
      if (v != null && v !== '미등록') {
        setOpinion(row.cmntType === 'SELF' ? { title: '보고 의견', text: row.reportCmnt ?? '' } : { title: '승인(반려) 의견', text: row.apprCmnt ?? '' });
      }
    } else if (colId === 'nextApprStatusName') {
      const v = row.nextApprStatusName;
      if (v != null && v !== '-' && v !== '미등록') {
        const n = await getCmnt(row, 'next');
        if (n) setOpinion({ title: `${n.apprOrgName ?? ''}의 승인(반려) 의견`, text: n.apprCmnt ?? '' });
      }
    }
  };

  // buildGrid() L317-362 — 묶음 헤더: HeaderGroupMap(0,4,"이행점검결과",1,3) · (0,7,"미흡/개선 내역(당월발생건 제외)",1,2) · (0,10,"의견등록상태",1,3)
  const columnDefs = useMemo(() => [
    gb.text('roleName', 200, '직책'),  // L329
    gb.text('checkOrgName2', 200, '검토부서'),  // L330
    cnt('monthCheckCnt', 80, '점검<br>항목', BLUE, GRAY),  // L331
    { ...gb.group('이행점검결과', [  // L322 HeaderGroupMap(0, 4, …, 1, 3)
      cnt('monthCheck1Cnt', 80, '적정', BLUE, GRAY),  // L332
      cnt('monthCheck2Cnt', 80, '미흡', BLUE, GRAY),  // L333
      cnt('monthCheck9Cnt', 80, '해당없음', BLUE, GRAY),  // L334
    ]), headerStyle: { color: BLUE, fontWeight: 'bold' } },
    { ...gb.group('미흡/개선 내역<br>(당월발생건 제외)', [  // L323 HeaderGroupMap(0, 7, …, 1, 2)
      cnt('insuffUndoneCnt', 80, '진행중', GRAY, GRAY),  // L335
      cnt('insuffDoneCnt', 80, '종료', GRAY, GRAY),  // L336
    ]), headerStyle: { color: GRAY, fontWeight: 'bold' } },
    gb.textStatus('checkStatusName', 100, '점검상태'),  // L337
    { ...gb.group('의견등록상태', [  // L324 HeaderGroupMap(0, 10, …, 1, 3)
      gb.textStatus('preApprStatusName', 80, '하위부서'),  // L338
      gb.textStatus('apprStatusName', 80, 'My부서'),  // L339
      gb.textStatus('nextApprStatusName', 80, '상위부서'),  // L340
    ]), headerStyle: { color: GRAY, fontWeight: 'bold' } },
    // L341 apprCmntCell → lookupApprCmnt() (DynamicCell: apprButtonEnable가 없으면 금지 표시)
    dynamicIconCell<TdmCheckApprCmnt>('edit', 'apprCell', 70, '승인의견', row => {
      const ro = isReadOnlyRow(row, endYnRef.current);
      setCmntWin({ mode: ro ? 'view' : 'edit', model: row });
    }, row => row.apprButtonEnable != null),
    // L342 reportCmntCell → lookupReportCmnt()
    dynamicIconCell<TdmCheckApprCmnt>('edit', 'reportCell', 70, '보고의견', row => {
      const ro = isReadOnlyRow(row, endYnRef.current);
      setReportWin({ mode: ro ? 'view' : 'edit', model: row });
    }, row => row.reportButtonEnable != null),
    iconCell<TdmCheckApprCmnt>('view', 'historyCell', 70, '승인이력', row => setRecordRow(row)),  // L343 historyCell → Tdm55_Lookup_ChckRecord2.open(선택행, 점검년월 첫날)
  ], []);

  const reload = () => { void retrieve(latest.current.ym, latest.current.role.id); };

  return (
    <>
    <Splitter layout="vertical" style={{ height: '100%', background: '#fff' }}>
      <Splitter.Panel defaultSize="30%" min={150} max={600}>
        <div style={{ height: '100%', padding: '20px 20px 0', boxSizing: 'border-box' }}>
          <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 'none', height: 40, display: 'flex', alignItems: 'center', gap: 8, padding: '0 8px', boxSizing: 'border-box' }}>
              <b>점검년월</b>
              {/* [E1 생략] quickMoveField (QuickMoveField).callbackOnCreate (L59) — 생성 완료 때 부를 setInitRoleId()는 AS-IS도 주석 처리(L63) */}
              {/* [E2] quickMoveField (QuickMoveField).callbackOnCollapse (L66) → retrieve() */}
              <QuickMoveField {...ym} onChange={setYm} onCommit={v => { void retrieve(v, role.id); }} />
              <b style={{ marginLeft: 4 }}>직책</b>
              <LookupInput value={role.name} width={250} placeholder="연결된 직책이 없습니다" onOpen={() => setRoleLookup(true)} />
              {/* [E5] retrieveButton[조회].Select (L169) → retrieve() */}
              <Button type="search" onClick={() => retrieve(ym, role.id)} disabled={loading}>조회</Button>
              {submit.visible && (
                <>
                  {/* [E6] submitButton[제출].Select (L177) → preUpdateSubmit("P") */}
                  <Button type="save" disabled={!submit.enabled} onClick={() => preUpdateSubmit('P')}>제출</Button>
                  {/* [E7] submitCanleButton[제출취소].Select (L196) → preUpdateSubmit("C") */}
                  <Button type="cancel" disabled={!submit.enabled} onClick={() => preUpdateSubmit('C')}>제출취소</Button>
                </>
              )}
            </div>
            <div style={{ flex: 'none', height: 30, display: 'flex', alignItems: 'center', gap: 5, padding: '0 8px', boxSizing: 'border-box' }}>
              {noticeCmntVisible && <b style={{ color: '#262d3f', fontSize: 12 }}>※ 의견등록상태를 더블클릭하여, 보고 의견 및 승인(반려) 의견을 확인하세요</b>}
              <b style={{ color: '#262d3f', fontSize: 12 }}>{noticeEnd}</b>
            </div>
            <div style={{ flex: 1, minHeight: 0 }}>
              <SingleGrid<TdmCheckApprCmnt>
                rowData={rows}
                columnDefs={columnDefs}
                getRowId={p => String(p.data.chckApprCmntId)}
                loading={loading}
                onSelect={onSelect}
                onCellDoubleClicked={e => { void onCellDoubleClicked(e.data, e.column.getColId()); }}
              />
            </div>
          </div>
        </div>
      </Splitter.Panel>
      <Splitter.Panel min={150}>
        <div style={{ height: '100%', padding: '0 20px 20px', boxSizing: 'border-box' }}>
          {/* [E3] tabPage (Tdm59_TabPage_CheckAppr).callbackOnCreate (L88) → retrieve() — 승인시작·일괄승인이 끝나면 위 그리드부터 다시 조회 */}
          <Tdm59_TabPage_CheckAppr target={tabTarget} onChanged={reload} />
        </div>
      </Splitter.Panel>
    </Splitter>
      <Tdm20_Lookup_SelectRole open={roleLookup} checkTarget stdDate={firstDayOf(ym)} onSelect={onRoleSelect} onClose={() => setRoleLookup(false)} />
      {/* edit 뒤 callBack.execute(result != null) L515-517·L549-551 → retrieve(): 처리할 때마다 바로 다시 조회한다(창은 상태가 대기면 열려 있다) */}
      <Tdm59_Edit_Cmnt target={cmntWin} onChanged={reload} onClose={() => setCmntWin(null)} />
      <Tdm59_Edit_ReportCmnt target={reportWin} onChanged={reload} onClose={() => setReportWin(null)} />
      <Tdm55_Lookup_ChckRecord2 cmnt={recordRow} onClose={() => setRecordRow(null)} />
      <AreaMessage open={opinion !== null} title={opinion?.title ?? ''} value={opinion?.text ?? ''} readOnly onClose={() => setOpinion(null)} />
    </>
  );
};
