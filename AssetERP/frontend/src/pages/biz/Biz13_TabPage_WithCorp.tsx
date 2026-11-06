/**
 * 계약사 관리 > 운영정보 탭 (EE20) — Biz10_Tab_ContCorp 아래 첫 번째 탭("운영정보")
 * AS-IS: myApp/client/vi/biz/Biz13_TabPage_WithCorp.java (291줄) + Sys15_Lookup_Corp(components/lookup) + Sys15_Lookup_Corp_OnlyKFS(components/lookup)
 *   — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L65-81: 위 툴바(ButtonBar — [등록][삭제][저장][운용사코드 등록], 입력칸 없음) + 셀 편집 그리드(체크박스 다중)
 * UX보강(10): 저장(n)은 UX-03
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button as AntButton, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { bizContCorpApi } from '@/api/bizCont';
import { sysApi } from '@/api/sys';
import { BizContCorp, BizContWithCorp } from '@/types/bizCont';
import { Code, Corp } from '@/types/sys';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';
import { Sys15_Lookup_Corp } from '@/components/lookup/Sys15_Lookup_Corp';
import { Sys15_Lookup_Corp_OnlyKFS } from '@/components/lookup/Sys15_Lookup_Corp_OnlyKFS';

const gb = gbFor<BizContWithCorp>();
/** setChecked(MULTI) — 렌더마다 새 객체를 주면 선택이 풀리므로 한 번만 만든다. 행 클릭이 삭제 대상을 바꾸지 않게 enableClickSelection은 쓰지 않는다 */
const MULTI_CHECK = { mode: 'multiRow', checkboxes: true } as const;

interface Props {
  /** 위 그리드에서 고른 계약사 — retrieve(null) 가 읽는 contCorpGrid.getSelectionModel().getSelectedItem() */
  corp: BizContCorp | null;
  /** 행을 누르거나 탭을 열 때마다 올라간다(같은 계약사를 다시 눌러도 다시 조회) */
  nonce: number;
  /** updateTransInfoGrid() L203-232: 위 그리드의 이 계약사 행을 다시 읽는다 */
  onCorpChanged: () => void;
}

export const Biz13_TabPage_WithCorp: React.FC<Props> = ({ corp, nonce, onCorpChanged }) => {
  const [manageTypes, setManageTypes] = useState<Code[]>([]);
  /** 조회창이 열린 목적: 'insert' = [등록](새 행), 행 id = 그 행의 운용사 바꾸기(E5) */
  const [corpPick, setCorpPick] = useState<'insert' | number | null>(null);
  const [kfsOpen, setKfsOpen] = useState(false);
  const contCorpId = corp?.contCorpId ?? null;

  useEffect(() => { sysApi.searchCodes('ManageType').then(setManageTypes).catch(() => setManageTypes([])); }, []);

  const crud = useGridCrud<BizContWithCorp>({
    idField: 'withCorpId',
    // retrieve() L164-175: 서비스 biz.Biz13_WithCorp.selectByHistoryContCorpId(contCorpId)
    search: useCallback(async () => (contCorpId == null ? [] : bizContCorpApi.searchWithCorps(contCorpId)), [contCorpId]),
    // update() L178-201: GridUpdate → biz.Biz13_WithCorp.update → updateTransInfoGrid()
    save: useCallback(async (rows: BizContWithCorp[]) => { await bizContCorpApi.saveWithCorps(rows); return rows; }, []),
    reloadAfterSave: true,
    // deleteRow() L265-284: "n건의 정보를 삭제하시겠습니까?" [YES] → GridDeleteData biz.Biz13_WithCorp.delete → updateTransInfoGrid()
    remove: useCallback((ids: number[]) => bizContCorpApi.deleteWithCorps(ids), []),
    deleteConfirm: n => `${n}건의 정보를 삭제하시겠습니까?`,
    newRow: useCallback(() => ({}), []),
    // update() L178-201: 모든 행의 운영구분이 있어야 한다
    validate: (_changed, all) => (all.some(r => !r.manageType) ? '운영구분은 필수선택 항목입니다' : undefined),
    onChanged: onCorpChanged,
  });

  // [E0] 화면 열림 (생성자 L65-81) → setting() — 위 그리드 행을 누르거나 탭을 열면 retrieve()
  useEffect(() => {
    if (contCorpId == null) crud.clear(); else void crud.retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contCorpId, nonce]);

  // [E1] insertButton[등록].Select (L84) → insertRow() L235-262: 계약사가 없으면 "계약사를 먼저 선택해주세요", 아니면 Sys15_Lookup_Corp.open(true, cb) → 고른 운용사로 새 행 (GridInsertRow — 변경으로 치지 않는다)
  const insertRow = () => {
    if (corp == null) {
      message.warning('계약사를 먼저 선택해주세요');
      return;
    }
    setCorpPick('insert');
  };
  const onCorpResult = (c: Corp | null) => {
    const pick = corpPick;
    setCorpPick(null);
    if (!c || pick == null || corp == null) return;
    if (pick === 'insert') {
      crud.addRows([{ contCorpId: corp.contCorpId, companyId: corp.companyId, corpId: c.corpId, corpNm: c.corpName, corpCd: c.corpCode }], false);
    } else {
      // [E5] lookupCorp.TriggerClick (L113) → Sys15_Lookup_Corp.open(cb) L113-129: 선택 행의 corpId·corpName·corpCode 를 바꾼다 (addChange)
      crud.updateRow(pick, { corpId: c.corpId, corpNm: c.corpName, corpCd: c.corpCode });
    }
  };

  /** 조회창 트리거 셀 (LookupTriggerField) */
  const triggerCol = (col: ReturnType<typeof gb.text>, open: (row: BizContWithCorp) => void) => ({
    ...col,
    cellStyle: { color: '#1677ff' },
    cellRenderer: (p: { data?: BizContWithCorp; value?: string }) => (
      <>
        <AntButton type="text" size="small" icon={<SearchOutlined />} onClick={e => { e.stopPropagation(); if (p.data) open(p.data); }} />
        {p.value}
      </>
    ),
  });

  // buildGrid() L110-151
  const columnDefs = useMemo(() => [
    gb.textCenter('corpCd', 80, '운용사코드'),  // L144
    triggerCol(gb.text('corpNm', 250, '운용사명'), row => setCorpPick(row.withCorpId)),  // L145 편집:lookupCorp
    // [E6] manageTypeComboBox[ManageType].Collapse (L131) → 선택 행의 manageType 코드를 바꾼다
    gb.text('manageTypeNm', 120, '운영구분', {
      editor: 'select',
      values: manageTypes.map(c => c.name),
      valueSetter: p => {
        p.data.manageTypeNm = p.newValue;
        p.data.manageType = manageTypes.find(c => c.name === p.newValue)?.code ?? null;
        return true;
      },
    }),  // L146
    gb.date('firstStartDate', 120, '최초업무시작일', { editor: 'date' }),  // L147
    gb.date('lastCloseDate', 120, '최종업무종료일', { editor: 'date' }),  // L148
  ], [manageTypes]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Button type="register" onClick={insertRow}>등록</Button>
        {/* [E2] deleteButton[삭제].Select (L90) → deleteRow() · [E7] msgBox.DialogHide [YES] (L268) → updateTransInfoGrid() */}
        <Button type="delete" onClick={crud.deleteChecked}>삭제</Button>
        {/* [E3] updateButton[저장].Select (L96) → update(). 저장(n)은 UX-03 */}
        <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
        {/* [E4] corpButton[운용사코드 등록].Select (L102) → lookupCorp() L153-156: Sys15_Lookup_Corp_OnlyKFS.open() */}
        <Button type="group" onClick={() => setKfsOpen(true)}>운용사코드 등록</Button>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <CellEditGrid<BizContWithCorp> crud={crud} columnDefs={columnDefs} rowSelection={MULTI_CHECK} />
      </div>
      <Sys15_Lookup_Corp open={corpPick != null} regYn={corpPick === 'insert'} onResult={onCorpResult} onClose={() => setCorpPick(null)} />
      <Sys15_Lookup_Corp_OnlyKFS open={kfsOpen} onClose={() => setKfsOpen(false)} />
    </div>
  );
};
