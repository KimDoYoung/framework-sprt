/**
 * 계약사 관리 > 이중사무관리 펀드 탭 (EE20) — Biz10_Tab_ContCorp 아래 네 번째 탭("이중사무관리 펀드")
 * AS-IS: myApp/client/vi/biz/Biz17_TabPage_DualManageFund.java (238줄) + Biz17_Lookup_HoldFee
 *   — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L58-69: 위 툴바(SearchBarBuilder — [등록][삭제][저장], 입력칸 없음) + 셀 편집 그리드(체크박스 단일)
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button as AntButton, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { bizContCorpApi } from '@/api/bizCont';
import { sysApi } from '@/api/sys';
import { BizContCorp, BizContDualFund, BizContHoldFee } from '@/types/bizCont';
import { Code } from '@/types/sys';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';
import { Biz17_Lookup_HoldFee } from './Biz17_Lookup_HoldFee';

const gb = gbFor<BizContDualFund>();
/** setChecked(SINGLE) — 렌더마다 새 객체를 주면 선택이 풀리므로 한 번만 만든다 */
const SINGLE_CHECK = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;

interface Props {
  corp: BizContCorp | null;
  nonce: number;
  /** updateTransInfoGrid() L164-195 */
  onCorpChanged: () => void;
}

export const Biz17_TabPage_DualManageFund: React.FC<Props> = ({ corp, nonce, onCorpChanged }) => {
  const [positionTypes, setPositionTypes] = useState<Code[]>([]);
  /** 펀드 조회창을 연 행 id (E4) */
  const [fundPickId, setFundPickId] = useState<number | null>(null);
  const contCorpId = corp?.contCorpId ?? null;

  useEffect(() => { sysApi.searchCodes('FundMngPositionType').then(setPositionTypes).catch(() => setPositionTypes([])); }, []);

  const crud = useGridCrud<BizContDualFund>({
    idField: 'dualFundId',
    // retrieve() L125-136: 서비스 biz.Biz17_DualManageFund.selectByContCorpId(contCorpId, stdDate = 오늘 전날)
    search: useCallback(async () => (contCorpId == null ? [] : bizContCorpApi.searchDualFunds(contCorpId)), [contCorpId]),
    // update() L139-162: GridUpdate → biz.Biz17_DualManageFund.update → updateTransInfoGrid()
    save: useCallback(async (rows: BizContDualFund[]) => { await bizContCorpApi.saveDualFunds(rows); return rows; }, []),
    reloadAfterSave: true,
    // deleteRow() L210-229: HtmlMessageBox "삭제" "선택한 정보를 삭제하시겠습니까?" [YES] → GridDeleteData biz.Biz17_DualManageFund.delete → updateTransInfoGrid()
    remove: useCallback((ids: number[]) => bizContCorpApi.deleteDualFunds(ids), []),
    deleteConfirm: '선택한 정보를 삭제하시겠습니까?',
    // insertRow() L198-207: 회사·계약사를 채운 새 행
    newRow: useCallback(() => ({ companyId: corp?.companyId, contCorpId: corp?.contCorpId }), [corp]),
    firstEditField: 'startDate',
    // update() L139-162: 모든 행에 펀드가 있어야 한다
    validate: (_changed, all) => (all.some(r => !r.fundCd) ? '펀드는 필수선택 항목입니다' : undefined),
    onChanged: onCorpChanged,
  });
  // crud 는 rows 가 바뀔 때마다 새 객체라 의존성에는 안정된 것만 꺼내 쓴다
  const { clear: crudClear, retrieve: crudRetrieve } = crud;

  // [E0] 화면 열림 (생성자 L58-69) → 초기화 — 위 그리드 행을 누르거나 탭을 열면 retrieve()
  useEffect(() => {
    if (contCorpId == null) crudClear(); else void crudRetrieve();
  }, [contCorpId, nonce, crudClear, crudRetrieve]);

  // [E1] searchBarBuilder[등록].Insert (L63) → insertRow() L198-207: GridInsertRow (맨 아래 빈 행)
  const insertRow = () => {
    if (corp == null) {
      message.warning('계약사를 먼저 선택해주세요');
      return;
    }
    crud.addRow();
  };

  // [E4] fundCode.TriggerClick (L77) → Biz17_Lookup_HoldFee.open(contCorpId, 오늘, cb) L77-92: 고른 펀드의 fundCode·fundName 을 선택 행에 넣는다 (addChange)
  const onFundResult = (fund: BizContHoldFee) => {
    const id = fundPickId;
    setFundPickId(null);
    if (id != null) crud.updateRow(id, { fundCd: fund.fundCd, fundNm: fund.fundNm });
  };

  /** 조회창 트리거 셀 (LookupTriggerField) */
  const triggerCol = (col: ReturnType<typeof gb.textCenter>, open: (row: BizContDualFund) => void) => ({
    ...col,
    cellStyle: { color: '#1677ff' },
    cellRenderer: (p: { data?: BizContDualFund; value?: string }) => (
      <>
        <AntButton type="text" size="small" icon={<SearchOutlined />} onClick={e => { e.stopPropagation(); if (p.data) open(p.data); }} />
        {p.value}
      </>
    ),
  });

  // buildGrid() L71-112
  const columnDefs = useMemo(() => [
    triggerCol(gb.textCenter('fundCd', 150, '펀드'), row => setFundPickId(row.dualFundId)),  // L104 편집:fundCode
    gb.text('fundNm', 480, '펀드명'),  // L105
    gb.date('startDate', 120, '적용시작일', { editor: 'date' }),  // L106
    gb.double('fundFee', 90, '보수율', { editor: 'number' }),  // L107
    gb.double('fundSubFee', 90, '(부)보수율', { editor: 'number' }),  // L108
    // [E5] positionComboBox[FundMngPositionType].Collapse (L95) → 선택 행의 positionType 코드를 바꾼다
    gb.textCenter('positionTypeNm', 110, '구분', {
      editor: 'select',
      values: positionTypes.map(c => c.name),
      valueSetter: p => {
        p.data.positionTypeNm = p.newValue;
        p.data.positionType = positionTypes.find(c => c.name === p.newValue)?.code ?? null;
        return true;
      },
    }),  // L109
  ], [positionTypes]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Button type="register" onClick={insertRow}>등록</Button>
        {/* [E2] searchBarBuilder[삭제].Delete (L64) → deleteRow() · [E6] msgBox.DialogHide [YES] (L213) → updateTransInfoGrid() */}
        <Button type="delete" onClick={crud.deleteChecked}>삭제</Button>
        {/* [E3] searchBarBuilder[저장].Update (L65) → update(). 저장(n)은 UX-03 */}
        <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <CellEditGrid<BizContDualFund> crud={crud} columnDefs={columnDefs} rowSelection={SINGLE_CHECK} />
      </div>
      <Biz17_Lookup_HoldFee contCorpId={fundPickId != null ? contCorpId : null} onResult={onFundResult} onClose={() => setFundPickId(null)} />
    </div>
  );
};
