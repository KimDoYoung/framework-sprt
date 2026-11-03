/**
 * 결재선 설정 (EE03, Apr30_Tab_ApprStepGroup의 가운데 페이지)
 * AS-IS: myApp/client/vi/apr/Apr31_Page_ApprStepGroupMember.java (420줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 생성자 L74-90: 툴바 50(결재선 설정 · [조회][등록][저장][삭제]) + 멤버 그리드(행번호, 체크박스 다중: 구분 100 콤보 · 부서명 200 · 직책 80 · 성명 80 · 위로 70 · 아래로 70 · 비고 300)
 * 부모가 고른 지정그룹 ID를 prop으로 받는다(AS-IS retrieve(apprStepGroupId)). 그룹을 안 골랐으면 페이지 전체가 꺼진다(setEnabled(false))
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Modal } from 'antd';
import dayjs from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import { aprApi } from '@/api/apr';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { AprApprStepGroupMember } from '@/types/apr';
import { Code } from '@/types/sys';
import { TransInfo } from '@/types/emp';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';
import { Emp00_Lookup_SelectMulti } from '@/components/lookup/Emp00_Lookup_SelectMulti';

const gb = gbFor<AprApprStepGroupMember>();
const BAR_STYLE: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 12, height: 50, flex: 'none' };

interface Props {
  /** 선택한 지정그룹 ID. 없으면(선택 없음·여러 건·저장 전 새 행) 꺼진다 — AS-IS memberPage.setEnabled(false)·retrieve(null) */
  apprStepGroupId: number | null;
}

export const Apr31_Page_ApprStepGroupMember: React.FC<Props> = ({ apprStepGroupId }) => {
  const gridRef = useRef<AgGridReact<AprApprStepGroupMember>>(null);
  const [rows, setRows] = useState<AprApprStepGroupMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [pickOpen, setPickOpen] = useState(false);
  const [codes, setCodes] = useState<Code[]>([]);
  const tempId = useRef(0);
  const seq = useRef(0);
  const enabled = apprStepGroupId != null;

  // [E0] 화면 열림 (생성자 L74-90) → settings() — 처음에는 지정그룹이 없어 꺼진 채로 시작한다(부모가 그룹을 고르면 retrieve)
  // buildApprStepGrid() L164-169: 구분 콤보 = sys.Sys00_Common.selectByKindGroupCode(kindGroupCode "AprStepTypeCode001")
  useEffect(() => {
    sysApi.searchCodesByKindGroup('AprStepTypeCode001').then(setCodes).catch(() => setCodes([]));
  }, []);

  // retrieve(apprStepGroupId) L402-415: apr.Apr31_ApprStepGroupMember.selectByApprStepGroupId(apprStepGroupId, companyId는 서버가 세션에서)
  const retrieve = useCallback(async () => {
    const my = ++seq.current;
    if (apprStepGroupId == null) { setRows([]); return; }
    setLoading(true);  // grid.mask("Loading")
    try {
      const list = await aprApi.searchApprStepGroupMembers(apprStepGroupId);
      if (my === seq.current) setRows(list);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      if (my === seq.current) setLoading(false);
    }
  }, [apprStepGroupId]);

  useEffect(() => { void retrieve(); }, [retrieve]);

  // [E2] insertButton[등록].Select [apprStepGroupId != null] (L99) → insertRow() L127-158: 사원찾기(다중) → 고른 사원마다 한 줄(구분 "결재"(10), 비고 "신규추가")
  // (AS-IS의 "좌측 지정그룹을 먼저 선택해주세요" L108은 apprStepGroupId가 처음부터 0이라 닿지 않는다 — 이 화면은 그룹이 없으면 꺼져 있다)
  const onPick = (list: TransInfo[]) => {
    setPickOpen(false);
    if (apprStepGroupId == null) return;
    const added: AprApprStepGroupMember[] = list.map(e => ({
      apprStepGroupMemberId: --tempId.current,
      apprStepGroupId,
      orgName: e.orgKorNm, titleName: e.titleNm, empKorName: e.korNm, stepEmpId: e.personId,
      stepTypeCode: '10', stepTypeName: '결재', note: '신규추가',
    }));
    setRows(prev => [...prev, ...added]);  // 03 원칙 17: 맨 아래
    setTimeout(() => {
      const api = gridRef.current?.api;
      const last = added[added.length - 1];
      const node = last && api?.getRowNode(String(last.apprStepGroupMemberId));
      if (api && node?.rowIndex != null) api.ensureIndexVisible(node.rowIndex);
    }, 0);
  };

  // [E5] stepTypeComboBox...Collapse (L170) → 선택한 행의 구분 코드·이름을 바꾼다
  const onTypeChanged = (row: AprApprStepGroupMember, name: string | null | undefined) => {
    const code = codes.find(c => c.name === name);
    setRows(prev => prev.map(r => (r.apprStepGroupMemberId === row.apprStepGroupMemberId
      ? { ...r, stepTypeCode: code?.code ?? null, stepTypeName: code?.name ?? null } : r)));
  };
  const onNoteChanged = (row: AprApprStepGroupMember, note: string | null | undefined) => {
    setRows(prev => prev.map(r => (r.apprStepGroupMemberId === row.apprStepGroupMemberId ? { ...r, note: note ?? null } : r)));
  };

  // changeRow(actionCode) L274-305: 위로(▲)·아래로(▼). 위로는 rowIndex > 1일 때만(원본 그대로 — 둘째 줄은 맨 위로 못 올라간다), 아래로는 마지막이 아닐 때
  const changeRow = (row: AprApprStepGroupMember, action: 'up' | 'down') => {
    setRows(prev => {
      const i = prev.findIndex(r => r.apprStepGroupMemberId === row.apprStepGroupMemberId);
      const j = action === 'down' ? i + 1 : i - 1;
      if (i < 0 || (action === 'down' ? j >= prev.length : i <= 1)) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  // [E3] updateButton[저장].Select (L113) → update() L316-374: 구분 필수 → 사원 중복 → 순서대로 seq(001~) 저장 → 성공이면 retrieve()
  const update = async () => {
    if (apprStepGroupId == null) return;
    if (rows.some(r => !r.stepTypeCode || !r.stepTypeName)) { message.warning('구분값은 필수 입력항목입니다'); return; }
    if (new Set(rows.map(r => r.stepEmpId)).size !== rows.length) { message.warning('결재선에 중복된 사원이 존재합니다'); return; }
    try {
      await aprApi.saveApprStepGroupMembers(apprStepGroupId, rows);
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
      return;
    }
    await retrieve();
  };

  // [E4] deleteButton[삭제].Select (L119) → deleteChk() L376-394: "삭제"/"삭제하시겠습니까?"(폭 150) → [E6] msgBox.DialogHide [YES] (L379) → deleteRow() L396-400: apr.Apr31_ApprStepGroupMember.delete
  const deleteChk = () => {
    const checked = gridRef.current?.api?.getSelectedRows() ?? [];
    if (checked.length === 0) { message.warning('삭제할 행을 선택하세요.'); return; }  // 05 §8
    Modal.confirm({
      title: '삭제',
      content: '삭제하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      width: 150,
      onOk: async () => {
        const saved = checked.filter(r => r.apprStepGroupMemberId > 0).map(r => r.apprStepGroupMemberId);
        try {
          if (saved.length > 0) await aprApi.deleteApprStepGroupMembers(saved);
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
          return;
        }
        const gone = new Set(checked.map(r => r.apprStepGroupMemberId));
        setRows(prev => prev.filter(r => !gone.has(r.apprStepGroupMemberId)));
      },
    });
  };

  // buildApprStepGrid() L160-202
  const columnDefs = useMemo<ColDef<AprApprStepGroupMember>[]>(() => [
    gb.textCenter('stepTypeName', 100, '구분', {  // L193 addTextFixCenter(…, stepTypeComboBox)
      editable: true, cellEditor: 'agSelectCellEditor', cellEditorParams: { values: codes.map(c => c.name) },
      cellStyle: { color: '#1677ff', textAlign: 'center' },
      onCellValueChanged: p => p.data && onTypeChanged(p.data, p.newValue),
    }),
    gb.text('orgName', 200, '부서명'),  // L194
    gb.textCenter('titleName', 80, '직책'),  // L195
    gb.textCenter('empKorName', 80, '성명'),  // L196
    { colId: 'upAction', headerName: '위로', width: 70, cellRenderer: () => '▲', onCellClicked: p => p.data && changeRow(p.data, 'up'), cellStyle: { cursor: 'pointer', textAlign: 'center' } },  // L197 ImageCell("▲")
    { colId: 'downAction', headerName: '아래로', width: 70, cellRenderer: () => '▼', onCellClicked: p => p.data && changeRow(p.data, 'down'), cellStyle: { cursor: 'pointer', textAlign: 'center' } },  // L198 ImageCell("▼")
    gb.text('note', 300, '비고', { editor: 'text', onCellValueChanged: p => p.data && onNoteChanged(p.data, p.newValue) }),  // L199
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [codes]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 0, opacity: enabled ? 1 : 0.5, pointerEvents: enabled ? 'auto' : 'none' }}>
      <div style={BAR_STYLE}>
        <b>결재선 설정</b>
        {/* [E1] retrieveButton[조회].Select (L93) → retrieve(apprStepGroupId) */}
        <Button type="search" onClick={() => void retrieve()}>조회</Button>
        <Button type="register" onClick={() => setPickOpen(true)}>등록</Button>
        <Button type="save" onClick={update}>저장</Button>
        <Button type="delete" onClick={deleteChk}>삭제</Button>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <MultiGrid<AprApprStepGroupMember>
          gridRef={gridRef}
          rowData={rows}
          columnDefs={columnDefs}
          getRowId={p => String(p.data.apprStepGroupMemberId)}
          loading={loading}
        />
      </div>
      <Emp00_Lookup_SelectMulti open={pickOpen} transDate={dayjs().format('YYYY-MM-DD')} onResult={onPick} onClose={() => setPickOpen(false)} />
    </div>
  );
};
