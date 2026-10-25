/**
 * 책무이행점검 승인의 아래 점검상세 · 미흡/개선 내역 목록 (N23)
 * AS-IS: myApp/client/vi/tdm/Tdm59_TabPage_CheckAppr.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L80-128: 위 줄(■ 점검상세 · 검색 · 미승인건만 조회 · [승인시작][승인시작취소] | [일괄승인][일괄승인취소]) + 점검상세 그리드(350) + 줄(■ 미흡/개선 내역 · 미승인건만 조회) + 미흡/개선 그리드(250), 세로 스크롤
 * 점검상세 그리드 buildGrid01() L214-244(체크박스 다중): 점검부서 200·구분 60·점검항목 650·점검자 80·점검결과 100·진행상태 100·승인상태 80·승인처리 75 아이콘·승인이력 70 아이콘
 * 미흡/개선 그리드 buildGrid02() L246-284(단일): 발생년월 80·조치예정일 100·조치완료일 100·조치(예정)자 150·조치명 550·진행상태 80·승인상태 80·승인처리 75 아이콘·승인이력 75 아이콘
 * 증빙자료 창(Tdm00_Lookup_RelateAppr)은 승인 창 안에서 안내만 (다음 단계)
 * UX보강(10): 해당 없음(체크박스 그리드는 행 클릭 선택 없음)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, Input, Modal, message } from 'antd';
import type { ICellRendererParams } from 'ag-grid-community';
import type { AgGridReact } from 'ag-grid-react';
import { errorMessage } from '@/api/client';
import { tdmApi } from '@/api/tdm';
import { TdmCheckApprCmnt, TdmCheckApprInsuff, TdmCheckApprManl } from '@/types/tdm';
import { Button } from '@/components/button';
import { MultiGrid, SingleGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { ManlCmntTarget, Tdm52_Edit_ChckManlCmnt } from './Tdm52_Edit_ChckManlCmnt';
import { InsuffCmntTarget, Tdm54_Lookup_ChckInsuffCmnt } from './Tdm54_Lookup_ChckInsuffCmnt';
import { Tdm55_Lookup_ChckRecord } from './Tdm55_Lookup_ChckRecord';

const gb1 = gbFor<TdmCheckApprManl>();
const gb2 = gbFor<TdmCheckApprInsuff>();

export interface CheckApprTabPageTarget {
  /** 위 그리드에서 고른 승인 행. 없으면 목록을 비운다 (AS-IS tabPage.clear()) */
  cmnt: TdmCheckApprCmnt | null;
  /** 점검 마감 여부 */
  endYn: boolean;
  /** 일괄승인 사용 여부 (tdm91) */
  batchApprUseYn: boolean;
  /** 같은 행을 다시 눌러도 다시 읽게 하는 번호 (AS-IS retrieve(model, …) 호출마다 +1) */
  nonce: number;
}

interface Props {
  target: CheckApprTabPageTarget;
  /** 승인시작·일괄승인 등이 끝나면 부르는 쪽이 위 그리드부터 다시 조회한다 (AS-IS callback.execute()) */
  onChanged: () => void;
}

/** addTextTdmApprStatus L861-883 — 대기는 파랑 굵게, 반려는 빨강 굵게, 나머지 굵게, 가운데 정렬 */
const ApprStatusCell = (p: ICellRendererParams) => {
  const v = p.value as string | null | undefined;
  if (!v) return <>&nbsp;</>;
  return <b style={v === '대기' ? { color: '#4472C4' } : v === '반려' ? { color: '#CE4242' } : undefined}>{v}</b>;
};

const NOTICE_START = '승인요청 상태입니다. "승인시작" 버튼을 클릭하세요';

export const Tdm59_TabPage_CheckAppr: React.FC<Props> = ({ target, onChanged }) => {
  const { cmnt, endYn, batchApprUseYn } = target;
  const grid1Ref = useRef<AgGridReact<TdmCheckApprManl>>(null);
  const [manls, setManls] = useState<TdmCheckApprManl[]>([]);
  const [insuffs, setInsuffs] = useState<TdmCheckApprInsuff[]>([]);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [noAgree01, setNoAgree01] = useState(false);                // noAgreeBox01 "미승인건만 조회" = false
  const [noAgree02, setNoAgree02] = useState(false);                // noAgreeBox02
  const [searchText, setSearchText] = useState('');
  const [manlWin, setManlWin] = useState<ManlCmntTarget | null>(null);
  const [insuffWin, setInsuffWin] = useState<InsuffCmntTarget | null>(null);
  const [recordManlId, setRecordManlId] = useState<number | null>(null);
  const [recordInsuffId, setRecordInsuffId] = useState<number | null>(null);
  const manlCallType = useRef<'check' | 'insuff'>('check');     // lookupCheckApprCmnt를 부른 쪽 (callType)
  const insuffAfter = useRef<number | null>(null);               // 미흡/개선에서 불렀을 때 그 행의 ID
  const latest = useRef({ cmnt, noAgree01, noAgree02, searchText, manls, insuffs });
  latest.current = { cmnt, noAgree01, noAgree02, searchText, manls, insuffs };

  // retrieve01() L299-316: tdm.Tdm52_ChckManl.selectByChckApprCmntId(undoneYn, searchText = "%글자%")
  const retrieve01 = useCallback(async () => {
    const c = latest.current;
    if (!c.cmnt) { setManls([]); return; }
    setLoading1(true);
    try {
      setManls(await tdmApi.searchCheckApprManls(c.cmnt.chckApprCmntId, { undoneYn: c.noAgree01, searchText: c.searchText }));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading1(false);
    }
  }, []);

  // retrieve02() L318-334: tdm.Tdm54_ChckInsuff.selectByChckApprCmntId(undoneYn)
  const retrieve02 = useCallback(async () => {
    const c = latest.current;
    if (!c.cmnt) { setInsuffs([]); return; }
    setLoading2(true);
    try {
      setInsuffs(await tdmApi.searchCheckApprInsuffs(c.cmnt.chckApprCmntId, { undoneYn: c.noAgree02 }));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading2(false);
    }
  }, []);

  // [E0] 화면 열림 (생성자 L80-128) / 부모의 retrieve(model, endYn, stdDate, checkYm, batchApprUseYn) L286-297 → setButton() → retrieve01(), retrieve02(). clear() L764-767: 모델이 없으면 둘 다 비운다
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { void retrieve01(); void retrieve02(); }, [cmnt?.chckApprCmntId, target.nonce]);

  // setButton() L712-762
  const buttons = useMemo(() => {
    const b = { startVisible: false, startCancelVisible: false, apprVisible: false, apprCancelVisible: false, startEnabled: false, startCancelEnabled: false, apprEnabled: false, apprCancelEnabled: false };
    if (!cmnt || endYn) return b;
    b.apprVisible = true;
    b.apprCancelVisible = true;
    b.startVisible = b.startCancelVisible = cmnt.firstApprEmpYn;                       // 최초승인자만 [승인시작][승인시작취소] 보이기
    if (!cmnt.submitYn && cmnt.apprStatusCode === '10') {                              // 제출 전, 승인상태가 대기(10)
      if (cmnt.checkStatusCode === '20' || cmnt.insuffStatus20Yn) b.startEnabled = true;   // 승인요청(20) 존재시 승인시작 활성화
      if (cmnt.checkStatusAll21Yn) b.startCancelEnabled = true;                            // 모든 항목이 승인진행(21)이면 승인시작취소 활성화
      if (b.startVisible && cmnt.checkStatusCode === '20') { b.apprEnabled = false; b.apprCancelEnabled = false; }
      else { b.apprEnabled = true; b.apprCancelEnabled = true; }
    }
    if (!batchApprUseYn) { b.apprVisible = false; b.apprCancelVisible = false; }
    return b;
  }, [cmnt, endYn, batchApprUseYn]);

  // apprStart(actionType) L336-443 → tdm.Tdm52_ChckManl.updateApprStart
  const apprStart = async (actionType: 'P' | 'C') => {
    const c = latest.current;
    if (!c.cmnt) return;
    const targetStatus = actionType === 'P' ? '20' : '21';        // (20:승인요청 / 21:승인진행)
    const manlIds: number[] = [];
    const insuffIds: number[] = [];
    if (actionType === 'P') {
      // 반려된 이행점검건 재처리시 해당건만 승인요청 상태 — 전체 상태를 검사하지 않는다
      for (const m of c.manls) if (m.checkStatusCode === targetStatus) manlIds.push(m.chckManlId);
      for (const i of c.insuffs) if (i.statusCode === '20' && i.apprStatusCode === '10') insuffIds.push(i.chckInsuffId);
    } else {
      // 취소는 전체를 대상으로 검사
      for (const m of c.manls) {
        if (m.apprStatusCode !== '10') { message.warning('승인(반려)된 점검항목이 존재합니다'); return; }
        if (m.checkStatusCode === targetStatus) manlIds.push(m.chckManlId);
      }
      for (const i of c.insuffs) {
        if (!(i.apprStatusCode === '10' || i.apprStatusCode == null)) { message.warning('승인(반려)된 조치내역이 존재합니다'); return; }
        if (i.statusCode === targetStatus) insuffIds.push(i.chckInsuffId);
      }
    }
    if (manlIds.length + insuffIds.length === 0) { message.warning('승인대상 점검항목 및 미흡/개선 내역이 없습니다'); return; }
    try {
      await tdmApi.startCheckAppr(c.cmnt.chckApprCmntId, actionType, manlIds, insuffIds);
    } catch (err) {
      message.info(errorMessage(err, '처리 실패'));
      return;
    }
    message.info(actionType === 'P' ? '처리가 완료되었습니다' : '취소가 완료되었습니다');
    onChanged();                                                   // callback.execute()
  };

  // [E4] startButton[승인시작].Select (L162) → [E5] messageBox.DialogHide [YES] (L166) → apprStart("P")
  const onStart = () => {
    Modal.confirm({
      title: '확인', content: `'${cmnt?.checkOrgName ?? ''}'의 이행점검 승인을 진행하시겠습니까?`, width: 450, okText: '예', cancelText: '아니오',
      onOk: () => apprStart('P'),
    });
  };

  // [E6] startCancelButton[승인시작취소].Select (L180) → [E7] messageBox.DialogHide [YES] (L184) → apprStart("C")
  const onStartCancel = () => {
    Modal.confirm({
      title: '확인', content: `'${cmnt?.checkOrgName ?? ''}'의 이행점검 승인시작을 취소하시겠습니까? (승인(반려)의견도 초기화됩니다)`, width: 450, okText: '예', cancelText: '아니오',
      onOk: () => apprStart('C'),
    });
  };

  // updateApprStatus(actionType, updateList) L555-584 → tdm.Tdm60_ChckManlAppr.updateApprStatus2
  const updateApprStatus = async (actionType: 'P' | 'C', list: TdmCheckApprManl[]) => {
    if (!cmnt) return;
    try {
      await tdmApi.batchCheckAppr(cmnt.chckApprCmntId, actionType, list.map(m => m.chckManlId));
    } catch (err) {
      message.info(errorMessage(err, '처리 실패'));
      return;
    }
    message.info(actionType === 'P' ? '승인이 완료되었습니다' : '승인취소가 완료되었습니다');
    onChanged();
  };

  // [E8] selectApprButton[일괄승인].Select (L198) · [E9] selectCancelButton[일괄승인취소].Select (L206) → preUpdateApprStatus(type) L445-553 → [E10] messageBox.DialogHide [YES] (L543) → updateApprStatus()
  const preUpdateApprStatus = (actionType: 'P' | 'C') => {
    const selected = grid1Ref.current?.api.getSelectedRows() ?? [];
    if (selected.length === 0) { message.warning('선택한 점검항목이 없습니다'); return; }
    let i = 0;
    let rejectCnt = 0;
    let insuffCnt = 0;
    const updateList: TdmCheckApprManl[] = [];
    for (const m of selected) {
      if (actionType === 'P') {
        if (m.apprStatusCode === '10') {
          i++;
          if (m.checkResultCode === '2' || m.checkResultCode === '3') insuffCnt++;                 // (2:미흡/3:개선)
        }
      } else if (m.apprStatusCode !== '10') {
        i++;
      }
      if (m.apprStatusCode === '30') rejectCnt++;                                                    // (30:반려)
      if (actionType === 'P' && m.apprStatusCode === '10' && m.checkResultCode !== '2' && m.checkResultCode !== '3') updateList.push(m);
      if (actionType === 'C' && m.apprStatusCode !== '10') updateList.push(m);
    }

    let msg = '';
    let width = 350;
    if (actionType === 'P') {
      if (i === 0) { message.warning('이미 승인 또는 반려된 점검항목만 선택되어 있습니다'); return; }
      if (updateList.length === 0) { message.warning('선택된 점검항목은 일괄승인 대상이 아닙니다'); return; }
      if (rejectCnt > 0 && insuffCnt > 0) { msg = '반려한 점검항목과 미흡/개선 점검항목은 제외하고 승인됩니다.\n진행하시겠습니까?'; width = 470; }
      else if (rejectCnt > 0) { msg = '반려한 점검항목은 제외하고 승인됩니다.\n진행하시겠습니까?'; width = 400; }
      else if (insuffCnt > 0) { msg = '미흡/개선 점검항목은 제외하고 승인됩니다.\n진행하시겠습니까?'; width = 400; }
      else { msg = '선택한 점검항목을 승인하시겠습니까?'; }
    } else {
      if (i === 0) { message.warning('선택한 점검항목이 모두 대기상태입니다'); return; }
      if (updateList.length === 0) { message.warning('선택된 점검항목은 일괄승인취소 대상이 아닙니다'); return; }
      if (rejectCnt + insuffCnt > 0) {
        width = 450;
        if (rejectCnt > 0 && insuffCnt > 0) { msg = '반려된 점검항목, 미흡/개선 점검항목이 선택되어 있습니다. 취소진행시 승인(반려)의견도 초기화됩니다. 진행하시겠습니까?'; width = 500; }
        else if (rejectCnt > 0) { msg = '반려된 점검항목이 선택되어 있습니다. 취소진행시 반려의견도 초기화됩니다. 진행하시겠습니까?'; }
        else if (insuffCnt > 0) { msg = '미흡/개선 점검항목이 선택되어 있습니다. 취소진행시 승인의견도 초기화됩니다. 진행하시겠습니까?'; }
      } else {
        msg = '선택한 점검항목의 승인을 취소하시겠습니까?';
        width = 370;
      }
    }
    Modal.confirm({
      title: '확인', content: <span style={{ whiteSpace: 'pre-line' }}>{msg}</span>, width, okText: '예', cancelText: '아니오',
      onOk: () => updateApprStatus(actionType, updateList),
    });
  };

  // lookupCheckApprCmnt(callType, manlModel) L609-670 — 읽기 전용: 마감 · 제출됨 · 내 승인상태≠10 · (미흡/개선에서 호출하면) 당월발생건이 아님
  const lookupCheckApprCmnt = (callType: 'check' | 'insuff', manl: TdmCheckApprManl, insuff?: TdmCheckApprInsuff) => {
    if (!cmnt) return;
    let isReadOnly = false;
    if (endYn) isReadOnly = true;
    else if (cmnt.submitYn) isReadOnly = true;
    else if (cmnt.apprStatusCode !== '10') isReadOnly = true;
    else if (callType === 'insuff' && !insuff?.currMonthOccYn) isReadOnly = true;

    if (!isReadOnly && buttons.startVisible && manl.checkStatusCode === '20') { message.warning(NOTICE_START); return; }
    setManlWin({ mode: isReadOnly ? 'view' : 'edit', manl, chckApprCmntId: cmnt.chckApprCmntId });
  };

  // edit 뒤 callBack.execute(resultModel) L641-668: 점검상세 그리드의 그 행을 바꾸고, 점검상세에서 불렀고 결과가 미흡/개선이면 미흡/개선 그리드를 다시 읽고, 미흡/개선에서 불렀으면 그 행만 다시 읽는다
  const onManlChanged = (m: TdmCheckApprManl) => {
    setManls(prev => prev.map(r => (r.chckManlId === m.chckManlId ? m : r)));
    if (manlCallType.current === 'check') {
      if (m.checkResultCode === '2' || m.checkResultCode === '3') void retrieve02();
    } else if (cmnt && insuffAfter.current != null) {
      const id = insuffAfter.current;
      tdmApi.searchCheckApprInsuffs(cmnt.chckApprCmntId, { chckInsuffId: id })
        .then(list => { if (list[0]) setInsuffs(prev => prev.map(r => (r.chckInsuffId === id ? list[0] : r))); })
        .catch(err => message.error(errorMessage(err, '조회 실패')));
    }
  };
  // getCheckManl(callback) L586-607: 미흡/개선 발생 점검항목을 다시 읽는다 (tdm.Tdm52_ChckManl.selectByChckApprCmntId + chckManlId)
  const getCheckManl = async (insuff: TdmCheckApprInsuff): Promise<TdmCheckApprManl | null> => {
    if (!cmnt) return null;
    try {
      const list = await tdmApi.searchCheckApprManls(cmnt.chckApprCmntId, { chckManlId: insuff.chckManlId });
      if (list.length === 0) throw new Error('empty');
      return list[0];
    } catch {
      message.warning('미흡/개선 발생 점검항목 상세조회시 오류가 발생했습니다. 전산팀에 문의하세요');
      return null;
    }
  };

  // lookupInsuffApprCmnt() L672-710 — 읽기 전용: 마감 · 제출됨 · 내 승인상태≠10 · 그 행의 승인상태 없음
  const lookupInsuffApprCmnt = (insuff: TdmCheckApprInsuff) => {
    if (!cmnt) return;
    let isReadOnly = false;
    if (endYn) isReadOnly = true;
    else if (cmnt.submitYn) isReadOnly = true;
    else if (cmnt.apprStatusCode !== '10') isReadOnly = true;
    else if (insuff.apprStatusCode == null) isReadOnly = true;

    if (!isReadOnly && buttons.startVisible && insuff.statusCode === '20') { message.warning(NOTICE_START); return; }
    setInsuffWin(isReadOnly
      ? { mode: 'view', chckInsuffId: insuff.chckInsuffId }
      : { mode: 'edit', insuff, chckApprCmntId: cmnt.chckApprCmntId, checkYm: cmnt.checkYm });
  };

  // buildGrid01() L214-244
  const columns1 = useMemo(() => [
    gb1.text('orgName', 200, '점검부서'),  // L233
    gb1.textCenter('commonTypeName', 60, '구분'),  // L234
    gb1.text('checkItem', 650, '점검항목'),  // L235
    gb1.textCenter('checkerName', 80, '점검자'),  // L236
    gb1.textStatus('checkResultName', 100, '점검결과'),  // L237
    gb1.textStatus('checkStatusName', 100, '진행상태'),  // L238
    gb1.textCenter('apprStatusName', 80, '승인상태', { cellRenderer: ApprStatusCell }),  // L239 addTextTdmApprStatus
    iconCell<TdmCheckApprManl>('edit', 'actionCell01', 75, '승인처리', row => { manlCallType.current = 'check'; lookupCheckApprCmnt('check', row); }),  // L240 actionCell01 → lookupCheckApprCmnt("check", 선택행)
    iconCell<TdmCheckApprManl>('view', 'actionCell02', 70, '승인이력', row => setRecordManlId(row.chckManlId)),  // L241 actionCell02 → Tdm55_Lookup_ChckRecord.open(chckManlId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [cmnt, endYn, buttons.startVisible]);

  // buildGrid02() L246-284
  const columns2 = useMemo(() => [
    gb2.textCenter('checkYm', 80, '발생년월'),  // L268
    gb2.date('dueDate', 100, '조치예정일'),  // L269
    gb2.date('actionDate', 100, '조치완료일'),  // L270
    gb2.text('actionEmpInfo', 150, '조치(예정)자'),  // L271
    gb2.text('actionName', 550, '조치명'),  // L273
    gb2.textStatus('statusName', 80, '진행상태'),  // L274
    gb2.textCenter('apprStatusName', 80, '승인상태', { cellRenderer: ApprStatusCell }),  // L275 addTextTdmApprStatus
    // L276 actionCell01: 조치상태가 "발생"이면 발생 점검항목을 다시 읽어 점검 승인 창("insuff"), 아니면 조치결과 승인 창
    iconCell<TdmCheckApprInsuff>('edit', 'actionCell01', 75, '승인처리', row => {
      if (row.statusName === '발생') {
        void getCheckManl(row).then(manl => {
          if (!manl) return;
          manlCallType.current = 'insuff';
          insuffAfter.current = row.chckInsuffId;
          lookupCheckApprCmnt('insuff', manl, row);
        });
      } else {
        insuffAfter.current = row.chckInsuffId;
        lookupInsuffApprCmnt(row);
      }
    }),
    iconCell<TdmCheckApprInsuff>('view', 'actionCell02', 75, '승인이력', row => setRecordInsuffId(row.chckInsuffId)),  // L277 actionCell02 → Tdm55_Lookup_ChckRecord.open(chckInsuffId, "TDM54")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [cmnt, endYn, buttons.startVisible]);

  const barStyle: React.CSSProperties = { flex: 'none', height: 50, display: 'flex', alignItems: 'center', gap: 8, padding: '0 8px', boxSizing: 'border-box' };
  const label: React.CSSProperties = { color: '#262d3f', fontSize: 12 };

  return (
    <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box', overflowY: 'auto' }}>
      <div style={barStyle}>
        <b style={label}>■ 점검상세</b>
        {/* [E1] searchText.KeyPress [Enter] (L134) → retrieve01() */}
        <Input style={{ width: 250 }} placeholder="검색어(점검부서/점검항목) 입력후 엔터" value={searchText} allowClear
          onChange={e => setSearchText(e.target.value)} onPressEnter={() => { latest.current.searchText = searchText; void retrieve01(); }} />
        {/* [E2] noAgreeBox01[미승인건만 조회].ValueChange (L145) → retrieve01() */}
        <Checkbox checked={noAgree01} onChange={e => { latest.current.noAgree01 = e.target.checked; setNoAgree01(e.target.checked); void retrieve01(); }}>미승인건만 조회</Checkbox>
        {buttons.startVisible && <Button type="save" disabled={!buttons.startEnabled} onClick={onStart}>승인시작</Button>}
        {buttons.startCancelVisible && <Button type="cancel" disabled={!buttons.startCancelEnabled} onClick={onStartCancel}>승인시작취소</Button>}
        <div style={{ flex: 1 }} />
        {buttons.apprVisible && <Button type="save" disabled={!buttons.apprEnabled} onClick={() => preUpdateApprStatus('P')}>일괄승인</Button>}
        {buttons.apprCancelVisible && <Button type="cancel" disabled={!buttons.apprCancelEnabled} onClick={() => preUpdateApprStatus('C')}>일괄승인취소</Button>}
      </div>
      <div style={{ height: 350, flex: 'none' }}>
        <MultiGrid<TdmCheckApprManl>
          gridRef={grid1Ref}
          rowData={manls}
          columnDefs={columns1}
          getRowId={p => String(p.data.chckManlId)}
          loading={loading1}
        />
      </div>
      <div style={barStyle}>
        <b style={label}>■ 미흡/개선 내역</b>
        {/* [E3] noAgreeBox02[미승인건만 조회].ValueChange (L154) → retrieve02() */}
        <Checkbox checked={noAgree02} onChange={e => { latest.current.noAgree02 = e.target.checked; setNoAgree02(e.target.checked); void retrieve02(); }}>미승인건만 조회</Checkbox>
      </div>
      <div style={{ height: 250, flex: 'none' }}>
        <SingleGrid<TdmCheckApprInsuff>
          rowData={insuffs}
          columnDefs={columns2}
          getRowId={p => String(p.data.chckInsuffId)}
          loading={loading2}
        />
      </div>
      <Tdm52_Edit_ChckManlCmnt target={manlWin} onChanged={onManlChanged} onClose={() => setManlWin(null)} />
      <Tdm54_Lookup_ChckInsuffCmnt
        target={insuffWin}
        onChanged={i => setInsuffs(prev => prev.map(r => (r.chckInsuffId === i.chckInsuffId ? i : r)))}
        onClose={() => setInsuffWin(null)}
      />
      <Tdm55_Lookup_ChckRecord relateId={recordManlId} onClose={() => setRecordManlId(null)} />
      <Tdm55_Lookup_ChckRecord insuffId={recordInsuffId} onClose={() => setRecordInsuffId(null)} />
    </div>
  );
};

