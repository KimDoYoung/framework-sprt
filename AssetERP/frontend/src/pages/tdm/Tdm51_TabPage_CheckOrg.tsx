/**
 * 업무점검자 지정 및 승인요청의 아래 점검항목 목록 (N21)
 * AS-IS: myApp/client/vi/tdm/Tdm51_TabPage_CheckOrg.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L85-115: 툴바(검색 [280 "검색어(관리의무/점검항목/점검자) 입력후 엔터"] · 점검자 미지정만 조회 · [전체선택][전체해제][점검자일괄지정] · [승인선][확정][확정취소] | [승인요청][요청취소], 높이 50, 테두리)
 * + GridGroupBuilder 그리드(관리의무별 그룹 머리글, 선택·[직책] 관리의무 / 점검항목 1000·점검자 100·점검결과 100·진행상태 100·상세 50·점검이력 70)
 * 다음 단계(N22): [상세] 아이콘이 여는 점검 창 `Tdm52_Edit_ChckManl.view`는 N22(Tdm52_Tab_CheckManl)에서 연결한다 — 지금은 안내만
 * UX보강(10): 툴바 = Button(UX-01), 조회창(UX-05·06)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, Input, Modal, Space, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { ICellRendererParams } from 'ag-grid-community';
import { errorMessage } from '@/api/client';
import { tdmApi } from '@/api/tdm';
import { TdmCheckManl, TdmCheckOrg } from '@/types/tdm';
import { TransTdm } from '@/types/emp';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { Emp00_Lookup_SelectSingleTdm } from '@/components/lookup/Emp00_Lookup_SelectSingleTdm';
import { ChckApprStepTarget, Tdm58_Lookup_ChckApprStep } from './Tdm58_Lookup_ChckApprStep';
import { Tdm55_Lookup_ChckRecord } from './Tdm55_Lookup_ChckRecord';

/** 화면 행 — 서버 행 + 체크(selectYn, 화면에서만 쓴다) */
type Row = TdmCheckManl & { selectYn: boolean };
/** 표시용 행 — 관리의무(title)가 바뀔 때 끼우는 그룹 머리글 행(AS-IS GroupSummaryView.groupBy(title)) */
type DisplayRow = Row & { __group?: boolean; groupTitle?: string };
const gb = gbFor<DisplayRow>();

const GroupHeader: React.FC<ICellRendererParams<DisplayRow>> = ({ data }) => (
  <div style={{ display: 'flex', alignItems: 'flex-end', height: '100%', paddingBottom: 4, borderBottom: '1px solid #8fb4e3', color: '#15428b', fontWeight: 'bold', fontSize: 11 }}>
    {data?.groupTitle}
  </div>
);

export interface CheckOrgTarget {
  /** 위 그리드에서 고른 부서 점검현황. 없으면 목록을 비운다 (AS-IS tabPage.clear()) */
  org: TdmCheckOrg | null;
  /** 점검년월의 첫날 'yyyy-MM-dd' (retrieve(orgModel, stdDate, endYn)의 stdDate) */
  stdDate: string;
  endYn: boolean;
  /** 같은 부서를 다시 눌러도 다시 읽게 하는 번호 (AS-IS retrieve(orgModel, …) 호출마다 +1) */
  nonce: number;
}

interface Props {
  target: CheckOrgTarget;
  /** 확정·승인요청이 끝나면 부르는 쪽이 다시 조회한다 (AS-IS callback.execute()) */
  onChanged: () => void;
}

export const Tdm51_TabPage_CheckOrg: React.FC<Props> = ({ target, onChanged }) => {
  const { org, stdDate, endYn } = target;
  const [searchText, setSearchText] = useState('');
  const [unspecYn, setUnspecYn] = useState(false);   // unspecCheckBox "점검자 미지정만 조회" = false (settings L129-130)
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [empLookup, setEmpLookup] = useState<{ row: Row | null } | null>(null);   // row=null이면 일괄지정, 있으면 그 행의 점검자 셀
  const [apprStep, setApprStep] = useState<ChckApprStepTarget | null>(null);
  const [recordId, setRecordId] = useState<number | null>(null);

  // setButtonEnable() L527-572
  const fixed = !endYn && (org?.fixYn ?? false);   // 확정(진행 중일 때만)
  const isReadOnly = endYn || fixed;
  const enable = {
    selectPerson: !endYn && !fixed,
    fix: !endYn && !fixed,
    fixCancel: !endYn && fixed,
    request: fixed && !!org?.checkEndYn && org?.orgStatusCode == null,
    requestCancel: fixed && org?.orgStatusCode != null,
  };

  // retrieve() L334-347: tdm.Tdm52_ChckManl.selectByChckOrgId(chckOrgId, unspecYn, searchText = "%…%")
  const latest = useRef({ searchText, unspecYn, org });
  latest.current = { searchText, unspecYn, org };
  const retrieve = useCallback(async (over: { unspecYn?: boolean } = {}) => {
    const cond = { ...latest.current, ...over };
    if (!cond.org) { setRows([]); return; }
    setLoading(true);
    try {
      const list = await tdmApi.searchCheckManls(cond.org.chckOrgId, cond.unspecYn, cond.searchText);
      setRows(list.map(r => ({ ...r, selectYn: false })));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, []);

  // [E0] 화면 열림 (생성자 L85-115) → settings() / 부모의 retrieve(orgModel, stdDate, endYn) L326-332 → setButtonEnable(), retrieve()  (clear() L349-351은 org가 없을 때)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { void retrieve(); }, [org?.chckOrgId, target.nonce]);

  const needOrg = () => {
    if (!org) { message.warning('상단의 직책을 선택하세요'); return false; }
    return true;
  };

  // [E3] selectAllButton[전체선택].Select (L138) / [E4] selectNoneButton[전체해제].Select (L144) → setGridCheck() L263-275
  const setGridCheck = (yn: boolean) => setRows(prev => prev.map(r => ({ ...r, selectYn: yn })));

  // [E13] grid.RowClick [selectModel.getSelectYn()] (L244): 고른 행의 selectYn을 뒤집는다
  const toggleRow = (row: DisplayRow | undefined) => {
    if (!row || row.__group) return;
    setRows(prev => prev.map(r => (r.chckManlId === row.chckManlId ? { ...r, selectYn: !r.selectYn } : r)));
  };

  // [E5] selectPersonButton[점검자일괄지정].Select (L150) → updateCheckerId() L353-389: 고른 항목이 없으면 안내, 있으면 사원찾기(단일)
  const updateCheckerIds = () => {
    if (rows.filter(r => r.selectYn).length === 0) { message.warning('점검항목을 선택하세요'); return; }
    setEmpLookup({ row: null });
  };

  // [E14] lookupPerson.TriggerClick (L280) → 확정·마감이면 안내, 아니면 lookupPerson() L391-412
  const onCheckerCell = (row: Row) => {
    if (row.checkStatusCode != null) { message.warning('점검자 지정이 확정되어 수정할 수 없습니다'); return; }
    if (endYn) { message.warning('해당 점검년월은 이행점검이 마감되었습니다. 수정할 수 없습니다'); return; }
    setEmpLookup({ row });
  };

  // updateCheckerId(selectList, personId, personName, callback) L414-429: tdm.Tdm52_ChckManl.updateCheckerId
  const onEmpResult = async (person: TransTdm) => {
    const ctx = empLookup;
    setEmpLookup(null);
    if (!ctx) return;
    const targets = ctx.row ? [ctx.row] : rows.filter(r => r.selectYn);
    try {
      setLoading(true);
      await tdmApi.updateCheckManlChecker(targets.map(r => r.chckManlId), person.personId);
      if (ctx.row) {
        const one = ctx.row;
        setRows(prev => prev.map(r => (r.chckManlId === one.chckManlId ? { ...r, checkerId: person.personId, checkerName: person.korNm } : r)));
      } else {
        await retrieve();
      }
    } catch (err) {
      message.error(errorMessage(err, '처리 실패'));
    } finally {
      setLoading(false);
    }
  };

  // [E6] lineEditButton[승인선].Select (L156): Tdm58_Lookup_ChckApprStep.view(마감·확정이면) / edit()
  const openApprStep = () => {
    if (!needOrg() || !org) return;
    setApprStep({ chckOrgId: org.chckOrgId, stdDate, mode: isReadOnly ? 'view' : 'edit' });
  };

  // updateFix(type) L431-457: tdm.Tdm51_ChckOrg.updateFix → 안내 → callback.execute()
  const updateFix = async (type: 'P' | 'C') => {
    if (!org) return;
    try {
      await tdmApi.updateCheckOrgFix(org.chckOrgId, type);
    } catch (err) {
      message.info(errorMessage(err, '처리 실패'));
      return;
    }
    message.info(type === 'P' ? '확정되었습니다. 이행점검을 시작하세요' : '확정이 취소되었습니다');
    onChanged();
  };

  // [E7] fixButton[확정].Select [YES] (L172) → [E8] msgBox.DialogHide [YES] (L182) → updateFix("P")
  const onFix = () => {
    if (!needOrg()) return;
    Modal.confirm({ title: '확인', content: '확정처리를 진행하시겠습니까?', width: 300, okText: '예', cancelText: '아니오', onOk: () => updateFix('P') });
  };

  // [E9] fixCancelButton[확정취소].Select [YES] (L199) → [E10] msgBox.DialogHide [YES] (L214) → updateFix("C")
  const onFixCancel = () => {
    if (!needOrg() || !org) return;
    if (!org.checkStatusAll10Yn) { message.warning("모든 항목의 진행상태가 '점검대기'중인 경우에만 취소가 가능합니다"); return; }
    Modal.confirm({ title: '확인', content: '확정내역을 취소하시겠습니까?', width: 300, okText: '예', cancelText: '아니오', onOk: () => updateFix('C') });
  };

  // [E11] requestButton[승인요청].Select (L231) / [E12] requestCancelButton[요청취소].Select (L237) → requestAppr(actionType) L459-525
  const requestAppr = (actionType: 'P' | 'C') => {
    if (!needOrg() || !org) return;
    let msg: string;
    if (actionType === 'P') {
      if (org.orgStatusCode != null) { message.warning('승인 진행(완료) 상태입니다'); return; }
      if (org.insuffUnActionYn) { message.warning('조치 완료 예정일이 도래한 미흡사항이 있으니, 확인 후 진행하세요'); return; }
      if (org.insuffRejectYn) { message.warning('반려된 미흡/개선 조치내역이 존재합니다. 처리 후 진행하세요'); return; }
      msg = '승인요청을 하시겠습니까?';
    } else {
      // 모든 점검항목의 점검상태(tdm52_check_status_cd)가 승인요청(20)인 경우에만 취소가능.
      if (org.orgStatusCode !== '20') { message.warning('승인이 진행되어 취소할 수 없습니다'); return; }
      msg = '승인요청을 취소하시겠습니까?';
    }
    // [E15] messageBox.DialogHide (L491) YES → tdm.Tdm51_ChckOrg.updateApprStatus(stdDate, personId, actionType)
    Modal.confirm({
      title: '확인', content: msg, width: 350, okText: '예', cancelText: '아니오',
      onOk: async () => {
        try {
          await tdmApi.updateCheckOrgApprStatus(org.chckOrgId, actionType);
        } catch (err) {
          message.info(errorMessage(err, '처리 실패'));
          return;
        }
        message.info(actionType === 'P' ? '승인요청이 완료되었습니다' : '승인요청이 취소되었습니다');
        onChanged();
      },
    });
  };

  // buildGrid() L277-324 (GridGroupBuilder — 첫 열 title로 그룹, title 열은 보이지 않는다)
  const columnDefs = useMemo(() => [
    gb.boolean('selectYn', 35, ' '),  // L315 addBoolean — 값은 행 클릭(E13)으로 바뀐다
    gb.textArea('checkItem', 1000, '[직책] 관리의무 / 점검항목'),  // L316
    // L317 점검자 — LookupTriggerField 칸
    gb.text('checkerName', 100, '점검자', {
      cellStyle: { color: '#1677ff' },
      cellRenderer: (p: ICellRendererParams<DisplayRow>) => (p.data?.__group ? null : (
        <>
          <SearchOutlined style={{ marginRight: 4 }} onClick={e => { e.stopPropagation(); if (p.data) onCheckerCell(p.data); }} />
          {p.value}
        </>
      )),
    }),
    gb.textCenter('checkResultName', 100, '점검결과'),  // L318
    gb.textCenter('checkStatusName', 100, '진행상태'),  // L319
    // L320 상세 — 점검 창(Tdm52_Edit_ChckManl.view)은 N22에서 연결한다
    iconCell<DisplayRow>('view', 'detail', 50, '상세', () => { message.info('상세 창(Tdm52_Edit_ChckManl)은 N22에서 연결됩니다'); }),
    // L321 점검이력 — Tdm55_Lookup_ChckRecord.open(chckManlId)
    iconCell<DisplayRow>('view', 'history', 70, '점검이력', row => setRecordId(row.chckManlId)),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [endYn]);

  // 관리의무(title)가 바뀔 때마다 그룹 머리글 행을 끼운다
  const displayRows = useMemo<DisplayRow[]>(() => {
    const out: DisplayRow[] = [];
    let prev: string | null | undefined;
    rows.forEach((r, i) => {
      if (i === 0 || r.title !== prev) {
        out.push({ ...r, chckManlId: -(i + 1), __group: true, groupTitle: r.title ?? '' });
        prev = r.title;
      }
      out.push(r);
    });
    return out;
  }, [rows]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', border: '1px solid #d9d9d9', boxSizing: 'border-box' }}>
      <div style={{ flex: 'none', height: 50, display: 'flex', alignItems: 'center', gap: 8, padding: '0 8px', boxSizing: 'border-box', borderBottom: '1px solid #d9d9d9' }}>
        {/* [E1] searchText.KeyPress [Enter] (L120) → retrieve() */}
        <Input style={{ width: 280 }} placeholder="검색어(관리의무/점검항목/점검자) 입력후 엔터" value={searchText} allowClear
          onChange={e => setSearchText(e.target.value)} onPressEnter={() => { void retrieve(); }} />
        {/* [E2] unspecCheckBox[점검자 미지정만 조회].ValueChange (L131) → retrieve() */}
        <Checkbox checked={unspecYn} onChange={e => { setUnspecYn(e.target.checked); void retrieve({ unspecYn: e.target.checked }); }}>점검자 미지정만 조회</Checkbox>
        <Space>
          <Button type="addRow" onClick={() => setGridCheck(true)}>전체선택</Button>
          <Button type="removeRow" onClick={() => setGridCheck(false)}>전체해제</Button>
          <Button type="save" disabled={!enable.selectPerson} onClick={updateCheckerIds}>점검자일괄지정</Button>
        </Space>
        <Space>
          <Button type="register" onClick={openApprStep}>승인선</Button>
          <Button type="save" disabled={!enable.fix} onClick={onFix}>확정</Button>
          <Button type="cancel" disabled={!enable.fixCancel} onClick={onFixCancel}>확정취소</Button>
        </Space>
        <b>|</b>
        <Space>
          <Button type="save" disabled={!enable.request} onClick={() => requestAppr('P')}>승인요청</Button>
          <Button type="cancel" disabled={!enable.requestCancel} onClick={() => requestAppr('C')}>요청취소</Button>
        </Space>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <SingleGrid<DisplayRow>
          rowData={displayRows}
          columnDefs={columnDefs}
          getRowId={p => String(p.data.chckManlId)}
          rowSelection={{ mode: 'singleRow', checkboxes: false, enableClickSelection: false }}
          isFullWidthRow={p => !!p.rowNode.data?.__group}
          fullWidthCellRenderer={GroupHeader}
          getRowHeight={p => (p.data?.__group ? 28 : undefined)}
          loading={loading}
          onRowClicked={e => toggleRow(e.data)}
        />
      </div>
      {/* Emp00_Lookup_SelectSingleTdm.open(stdDate, orgId, callback) */}
      <Emp00_Lookup_SelectSingleTdm
        open={empLookup != null}
        stdDate={stdDate}
        orgId={org?.orgId}
        onResult={p => { void onEmpResult(p); }}
        onClose={() => setEmpLookup(null)}
      />
      <Tdm58_Lookup_ChckApprStep target={apprStep} onClose={() => setApprStep(null)} />
      <Tdm55_Lookup_ChckRecord relateId={recordId} onClose={() => setRecordId(null)} />
    </div>
  );
};
