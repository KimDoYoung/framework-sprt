/**
 * [1105] 펀드관리 > 01. 상품기획 > 상품기획일정 등록 (P03) — 아래 기획일정 탭
 * AS-IS: myApp/client/vi/fnd/Fnd20_TabPage_Plan.java (221줄) + Dcr00_Lookup_FundPlan(components/lookup) + Emp00_Lookup_SelectSingle(components/lookup)
 *   — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L46-60: 위 툴바(SearchBarBuilder — [조회][저장][등록][삭제], 입력칸 없음) + 셀 편집 그리드(체크박스 단일)
 * UX보강(10): 툴바 = SearchBar(UX-01). 저장(n)은 UX-03
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { message, Button as AntButton } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { fndApi } from '@/api/fnd';
import { Plan } from '@/types/fnd';
import { TransInfo } from '@/types/emp';
import { DcrFundPlanLookup } from '@/types/dcr';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { useGridCrud } from '@/hooks/useGridCrud';
import { useLoginUser } from '@/hooks/useLoginUser';
import { Dcr00_Lookup_FundPlan } from '@/components/lookup/Dcr00_Lookup_FundPlan';
import { Emp00_Lookup_SelectSingle } from '@/components/lookup/Emp00_Lookup_SelectSingle';

const gb = gbFor<Plan>();
/** setChecked(SINGLE) — 렌더마다 새 객체를 주면 선택이 풀리므로 한 번만 만든다 */
const SINGLE_CHECK = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;
/** deleteRow() L184-191: 이 상태의 상신 문서가 붙은 일정은 지울 수 없다 */
const UNDELETABLE = ['상신', '결재중', '완료', '반려'];

interface Props {
  /** retrieve(fundId) L126-131 — 위 그리드에서 고른 펀드. nonce가 바뀌면(행을 누를 때마다) 같은 펀드여도 다시 조회한다 */
  target: { fundId: number | null; nonce: number };
}

export const Fnd20_TabPage_Plan: React.FC<Props> = ({ target }) => {
  const user = useLoginUser();
  const fundId = target.fundId;
  /** 조회창이 열린 목적: 'insert' = [등록](고른 문서구분마다 새 행), 행 id = 그 행의 문서분류 바꾸기(E5) */
  const [classPick, setClassPick] = useState<'insert' | number | null>(null);
  /** 담당자 조회창을 연 행 id (E6) */
  const [empPickId, setEmpPickId] = useState<number | null>(null);

  const crud = useGridCrud<Plan>({
    idField: 'planId',
    // retrieve() L126-131·L216-220: 서비스 fnd.Fnd20_Plan.selectByFundId(fundId)
    search: useCallback(async () => (fundId == null ? [] : fndApi.searchPlans(fundId)), [fundId]),
    // update() L158-174: GridUpdate → fnd.Fnd20_Plan.update
    save: fndApi.savePlans,
    // deleteRow() L177-213: GridDeleteData → fnd.Fnd20_Plan.delete
    remove: fndApi.deletePlans,
    // [E4] 삭제 확인 HtmlMessageBox "삭제" "선택한 문서를 삭제하시겠습니까?" (L194)
    deleteConfirm: '선택한 문서를 삭제하시겠습니까?',
    newRow: useCallback(() => ({}), []),
    // update() L158-174: 바꾼 행 중 만든 사람(managerId)이 로그인 사용자가 아닌 것이 있으면 저장하지 않는다
    validate: changed => (changed.some(r => r.managerId !== user.userId) ? '해당 내용을 생성한 자만 수정가능합니다' : undefined),
  });

  // [E0] 화면 열림 (생성자 L46-60) → 툴바 [조회][저장][등록][삭제] + 기획일정 그리드. 열 때 조회하지 않고, 위 그리드에서 펀드를 고르면 읽는다
  // [E1] searchBarBuilder[조회].Retrieve (L48) → retrieve() — 위 그리드 행을 누르면(Fnd20_Tab_Plan E3) retrieve(fundId)
  useEffect(() => {
    void crud.retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  // [E3] searchBarBuilder[등록].Insert (L50) → insertRow() L134-155: 문서구분 조회창 → 고른 문서구분마다 새 행(시작일 오늘, 관리자 = 로그인 사용자). GridInsertRow — 변경으로 치지 않는다
  const onClassResult = (list: DcrFundPlanLookup[]) => {
    const pick = classPick;
    setClassPick(null);
    if (list.length === 0 || pick == null) return;
    if (pick === 'insert') {
      const today = dayjs().format('YYYY-MM-DD');
      crud.addRows(list.map(m => ({
        classTreeId: m.classTreeId,
        classTreeFullName: m.classTreeFullName,
        approvalTypeName: m.approvalTypeName,
        fundId: fundId ?? 0,
        startDate: today,
        managerId: user.userId,
      })), false);
      return;
    }
    // [E5] lookupClassTree.TriggerClick (L65) → openLookupClassTree() L94-109: 고른 첫 문서구분을 그 행의 문서분류·최종결재로 (addChange)
    const m = list[0];
    crud.updateRow(pick, { classTreeId: m.classTreeId, classTreeFullName: m.classTreeFullName, approvalTypeName: m.approvalTypeName });
  };

  // [E6] lookupEmpInfo.TriggerClick (L73) → openLookupEmpInfo() L111-124: 사원찾기(오늘) → 그 행의 담당자·부서
  const onEmpResult = (emp: TransInfo | null) => {
    const rowId = empPickId;
    setEmpPickId(null);
    if (!emp || rowId == null) return;
    crud.updateRow(rowId, { personId: emp.personId, personName: emp.korNm, orgName: emp.orgKorNm });
  };

  // [E4] searchBarBuilder[삭제].Delete (L51) → deleteRow() L177-213: 만든 사람이 아니면 "해당 내용을 생성한 자만 삭제가능합니다",
  //   상신·결재중·완료·반려면 "해당 보고서는 삭제할 수 없습니다", 그 밖에는 확인창 → [E7] msgBox.DialogHide [YES] (L196) → fnd.Fnd20_Plan.delete
  const deleteRow = () => {
    const sel = crud.gridRef.current?.api?.getSelectedRows()[0];
    if (sel) {
      if (sel.managerId !== user.userId) {
        message.warning('해당 내용을 생성한 자만 삭제가능합니다');
        return;
      }
      if (sel.closeYn != null && UNDELETABLE.includes(sel.closeYn)) {
        message.warning('해당 보고서는 삭제할 수 없습니다');
        return;
      }
    }
    crud.deleteChecked();
  };

  /** 조회창 트리거 셀 (LookupTriggerField) */
  const triggerCol = (col: ReturnType<typeof gb.text>, open: (row: Plan) => void) => ({
    ...col,
    cellStyle: { color: '#1677ff' },
    cellRenderer: (p: { data?: Plan; value?: string }) => (
      <>
        <AntButton type="text" size="small" icon={<SearchOutlined />} onClick={e => { e.stopPropagation(); if (p.data) open(p.data); }} />
        {p.value}
      </>
    ),
  });

  // buildGrid() L62-92
  const columnDefs = useMemo(() => [
    triggerCol(gb.text('classTreeFullName', 350, '문서분류'), row => setClassPick(row.planId)),  // L82 편집:lookupClassTree
    gb.text('approvalTypeName', 100, '최종결재'),  // L83
    triggerCol(gb.text('personName', 100, '담당자'), row => setEmpPickId(row.planId)),  // L84 편집:lookupEmpInfo
    gb.text('orgName', 150, '부서'),  // L85
    gb.date('startDate', 100, '시작일', { editor: 'date' }),  // L86
    gb.date('dueDate', 100, '완료예정일', { editor: 'date' }),  // L87
    gb.text('closeYn', 100, '진행상태'),  // L88
    gb.text('note', 400, '업무내용', { editor: 'text' }),  // L89
  ], []);  // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, boxSizing: 'border-box' }}>
      <SearchBar
        onSearch={() => void crud.retrieve()}
        loading={crud.loading}
        extra={<>
          {/* [E2] searchBarBuilder[저장].Update (L49) → update(). 저장(n)은 UX-03 */}
          <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
          <Button type="register" onClick={() => setClassPick('insert')}>등록</Button>
          <Button type="delete" onClick={deleteRow}>삭제</Button>
        </>}
      />
      <div style={{ flex: 1, minHeight: 0 }}>
        <CellEditGrid<Plan> crud={crud} columnDefs={columnDefs} rowSelection={SINGLE_CHECK} />
      </div>
      <Dcr00_Lookup_FundPlan open={classPick != null} onResult={onClassResult} onClose={() => setClassPick(null)} />
      <Emp00_Lookup_SelectSingle open={empPickId != null} noneLabel={null} transDate={dayjs().format('YYYY-MM-DD')} onResult={onEmpResult} onClose={() => setEmpPickId(null)} />
    </div>
  );
};
