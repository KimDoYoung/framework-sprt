/**
 * [1407] 신청 > 80. 사업비 신청 > 지출결의서 (Y10)
 * AS-IS: myApp/client/vi/pay/Pay50_Tab_Expense.java (538줄) + Pay50_Edit_Expense.java (723줄, 아래 편집 폼 — U03에서 변환, isManager=false)
 *   + Pay50_Lookup_ExpenseRequestInsert (등록 = insertPass(false, …), Y08) + Dcr01_Lookup_Class·Apr01_Edit_ApprDoc (상신 A63)
 *   — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L81-119: Center(여백 20·20·0·20) = 테두리 박스(툴바 50 + 지출결의서 그리드, 합계 행) / South(350, 분할, 여백 20) = 편집 폼(Pay50_Edit_Expense)
 * 스타일: SGEF (견본 docs/page-style/SGEF/Fnd01_Tab_FundCode — yunhee page-style은 SGVF로 읽으나 아래 폼이 저장이 있는 편집형이라 U03처럼 SGEF를 따른다)
 * U03 Pay50_Tab_ExpenseManager와 같은 서버 메서드(selectExpenseAppr·initExpense·updateExpenseApprId)를 쓰고 managerYn=false로 부른다 —
 *   내가 결의자(승인자)이고 승인상태가 PASS(80)인 건만 나온다
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 원본에 없어 넣지 않는다
 * 다음 단계: 없음 (증빙자료 Com01_Lookup_RelateAppr·바로등록 창 안의 다음 단계는 Y08 기록)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, DatePicker, message, Modal, Splitter } from 'antd';
import dayjs from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { payApi } from '@/api/pay';
import { errorMessage } from '@/api/client';
import { dcrApi } from '@/api/dcr';
import { PayExpense } from '@/types/pay';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { SearchBar } from '@/components/search';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { Dcr01_Lookup_Class } from '../dcr/Dcr01_Lookup_Class';
import { Apr01_Edit_ApprDoc } from '../apr/Apr01_Edit_ApprDoc';
import { Pay50_Edit_Expense } from './Pay50_Edit_Expense';
import { Pay50_Lookup_ExpenseRequestInsert } from './Pay50_Lookup_ExpenseRequestInsert';

const gb = gbFor<PayExpense>();
const FORMAT = 'YYYY-MM-DD';
const ALL = '%';
/** 콤보 "전체"(CommonComboBoxField(…, "%", "전체")) */
const ALL_CODE: [string, string] = [ALL, '전체'];

/** 상신상태 코드별 거절 문구 (apprCheck L362-458) */
const APPR_STATUS_MESSAGE: Record<string, string> = {
  '10': '이미 상신중인 문서가 있습니다.',
  '20': '이미 결재중인 문서가 있습니다.',
  '30': '이미 완료 문서가 있습니다.',
  '40': '이미 반려된 문서가 있습니다.',
  '99': '임시저장된 문서가 있습니다. 삭제후 다시 시도해주세요.',
};

/** buildGrid() L208-238: setChecked(MULTI), 문서보기 아이콘(actionCell), 합계 행 setSumGridHeader("계", 2)·setSumGrid(7) */
const buildGrid = (viewAppr: (row: PayExpense) => void) => [
  gb.date('occDate', 90, '발생일자'),
  gb.date('dueDate', 90, '지급요청일'),
  gb.text('expenseName', 100, '구분'),
  gb.text('desc', 250, '지출내역'),
  gb.text('corpName', 150, '지출처'),
  gb.long('settleAmt', 100, '지출금액'),
  gb.text('accountName', 100, '계정과목'),
  gb.textCenter('fileCountStr', 60, '증빙자료'),
  gb.date('regDate', 90, '요청일'),
  gb.textCenter('expenseStatusName', 70, '처리상태'),
  gb.text('expenseApprTitle', 150, '상신문서명'),
  gb.textCenter('expenseApprStatusName', 70, '상신상태'),
  iconCell<PayExpense>('view', 'actionCell', 50, '문서보기', viewAppr),
  gb.text('note', 150, '비고'),
];

const monthStart = () => dayjs().startOf('month');

export const Pay50_Tab_Expense: React.FC = () => {
  // new Pay50_Edit_Expense(grid, false): 이 화면은 관리자 모드가 아니다(승인자 칸·계정코드 편집 없음)
  const gridRef = useRef<AgGridReact<PayExpense>>(null);
  // [E0] 화면 열림 (생성자 L81-119) → settings() L121-206: 조회기간 = 이번 달 1일 ~ 두 달 뒤 말일(100), 구분 "전체"(150, 지출유형 ExpenseType0004), 검색칸 200 "지출내역/지출처/비고", "완료/반려건 제외" 체크
  const [startDate, setStartDate] = useState(monthStart());
  const [closeDate, setCloseDate] = useState(monthStart().add(2, 'month').subtract(1, 'day'));
  const [expenseCode, setExpenseCode] = useState<string>(ALL);
  const [searchText, setSearchText] = useState('');
  const [statusCheckYn, setStatusCheckYn] = useState(true);
  const [rows, setRows] = useState<PayExpense[]>([]);
  const [loading, setLoading] = useState(false);
  /** 체크한 행 (grid.getSelectionModel().getSelectedItems()) */
  const [checked, setChecked] = useState<PayExpense[]>([]);
  /** 아래 편집 폼에 보여 줄 행 (retrieveEditForm: getSelectedItem()) */
  const [editRow, setEditRow] = useState<PayExpense | null>(null);
  const [insertOpen, setInsertOpen] = useState(false);
  const retrieveSeq = useRef(0);
  /** 상신(apprSelect → insertLinkApproval): 문서분류를 고르는 중인 건(prefill = 문서분류 지정이 있으면 그 분류) → 고른 뒤 결재창을 연다 */
  const [classPick, setClassPick] = useState<{ prefillId: number | null; ids: number[]; firstId: number } | null>(null);
  const [linkDoc, setLinkDoc] = useState<{ classTreeId: number; ids: number[]; firstId: number } | null>(null);
  /** viewAppr: 이미 상신한 문서 열기 */
  const [viewApprId, setViewApprId] = useState<number | null>(null);

  // retrieve() L291-316: pay.Pay50_Expense.selectExpenseAppr(companyId, personId, 기간, statusCheckYn, expenseCode, "%검색어%", managerYn=false)
  //   → 조회가 끝나면 첫 행을 고르고 폼을 켠다, 행이 없으면 폼을 끈다
  const retrieve = useCallback(async (over: Partial<{ expenseCode: string }> = {}) => {
    const my = ++retrieveSeq.current;
    setLoading(true);  // grid.mask("Loading")
    try {
      const list = await payApi.searchExpenses({
        startDate: startDate.format(FORMAT), closeDate: closeDate.format(FORMAT), statusCheckYn,
        expenseCode: over.expenseCode ?? expenseCode, searchText, managerYn: false,  // payMethodCode는 보내지 않는다(원본 service.addParam에 없음 → 지급방법 조건 없음)
      });
      if (my !== retrieveSeq.current) return;
      setRows(list);
      if (list.length === 0) { setChecked([]); setEditRow(null); }
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      if (my === retrieveSeq.current) setLoading(false);  // grid.unmask()
    }
  }, [startDate, closeDate, statusCheckYn, expenseCode, searchText]);

  // [E1] expenseComboBox (CommonComboBoxField).callbackOnCreate (L140) → retrieve() — 열 때 한 번
  useEffect(() => { void retrieve(); }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // [E2] expenseComboBox[sys.Sys00_Common.selectByKindGroupCode].Collapse (L149) → retrieve() (콤보 onChange)
  // [E3] searchText.KeyPress [Enter] (L158) / [E4] retrieveButton[조회].Select (L170) → retrieve() (SearchBar)

  // viewAppr() L240-274: 상신문서가 없으면 "상신문서가 존재하지 않습니다", 있으면 apr.Apr01_Appr.selectById → Apr01_Edit_ApprDoc.retrieveApproval
  const viewAppr = useCallback((row: PayExpense) => {
    if (row.expenseApprId == null) { message.warning('상신문서가 존재하지 않습니다'); return; }
    setViewApprId(row.expenseApprId);
  }, []);
  const columnDefs = useMemo(() => buildGrid(viewAppr), [viewAppr]);

  // [E5] deleteButton[삭제].Select (L176) → delete() L318-350: "n건의 내역을 삭제하시겠습니까?"(350) → [E9] YES → pay.Pay50_Expense.initExpense → 성공이면 retrieve(), 아니면 서버 메시지
  const deleteRows = () => {
    const list = checked;
    Modal.confirm({
      title: '확인', content: `${list.length}건의 내역을 삭제하시겠습니까?`, width: 350, okText: '예', cancelText: '아니오',
      onOk: async () => {
        try {
          await payApi.initExpenses(list.map(r => r.expenseId));
          await retrieve();
        } catch (err) {
          message.info(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  // [E6] insertButton[등록].Select (L182) → insert() L352-360: Pay50_Lookup_ExpenseRequestInsert.insertPass(false, callback → retrieve())
  const insert = () => setInsertOpen(true);

  // [E7] apprButton[상신].Select (L188) → apprCheck() L362-458: 발생일자 순으로 훑으며 계정과목·발생부서·계정과목 일치를 검사한다(지급요청일 일치 검사는 원본에서 주석 처리됨)
  const apprCheck = () => {
    if (checked.length < 1) { message.warning('상신할 내용을 선택해주세요'); return; }
    const sorted = [...checked].sort((a, b) => (a.occDate ?? '').localeCompare(b.occDate ?? ''));
    let orgName: string | null = null;
    let accountCode: string | null = null;
    for (const e of sorted) {
      if (e.accountCode == null) { message.warning('계정과목이 없는 건이 존재합니다.'); return; }
      if (e.accountCode != null || e.orgName != null || e.dueDate != null) {
        if (orgName == null) orgName = e.orgName;
        else if (orgName !== e.orgName) { message.warning('발생부서가 다릅니다. 확인해주세요.'); return; }
        if (accountCode == null) accountCode = e.accountCode;
        else if (accountCode !== e.accountCode) { message.warning('계정과목이 다릅니다. 확인해주세요.'); return; }
      }
      if (e.rejectReason != null) { message.warning('이미 반려처리된 건이 있습니다.'); return; }
      const msg = e.expenseApprStatusCode != null ? APPR_STATUS_MESSAGE[e.expenseApprStatusCode] : undefined;
      if (msg) { message.warning(msg); return; }
    }
    // [E10] msgBox.DialogHide [YES] (L442) → apprSelect() L460-490
    //   expenseList = 발생일자 순으로 정렬한 고른 행(selectedItems.sort), 시행일자·계정과목·발생부서는 고른 첫 행(grid.getSelectionModel().getSelectedItems().get(0))
    const ids = sorted.map(r => r.expenseId);
    const firstId = checked[0].expenseId;
    Modal.confirm({
      title: '확인', content: `${checked.length}건의 상신을 진행하시겠습니까?`, width: 380, okText: '예', cancelText: '아니오',
      onOk: () => { void apprSelect(ids, firstId); },
    });
  };

  // apprSelect() L460-490: dcr.Dcr30_Link.selectByLinkCode("A63") → 항상 Dcr01_Lookup_Class를 연다(문서분류가 지정돼 있으면 그 분류로 채워서) → 고르면 insertLinkApproval()
  const apprSelect = async (ids: number[], firstId: number) => {
    try {
      const list = await dcrApi.searchClassTreeByLinkCode('A63');
      setClassPick({ prefillId: list.length === 0 ? null : list[0].classTreeId, ids, firstId });
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // updateExpenseApprId() L518-530: pay.Pay50_Expense.updateExpenseApprId(expenseApprId, expenseList) → retrieve()
  //   (TOBE: 같은 호출이 지출요청의 첨부파일을 결재문서에 연결하는 insertPay50FileList도 한다)
  const updateExpenseApprId = async (apprId: number) => {
    if (!linkDoc) return;
    try {
      await payApi.updateExpenseApprId(linkDoc.ids, apprId);
      await retrieve();
    } catch (err) {
      message.error(errorMessage(err, '결재문서 ID를 기록하지 못했습니다'));
    }
  };

  // [E8] grid.SelectionChanged [선택>0] (L195) → retrieveEditForm() L276-289: 고른 행을 아래 폼에, 고른 게 없으면 폼을 끈다
  const syncEditRow = (api: NonNullable<AgGridReact<PayExpense>['api']>) => {
    const sel = api.getSelectedRows();
    setChecked(sel);
    if (sel.length === 0) setEditRow(null);
    else setEditRow(prev => (prev && sel.some(r => r.expenseId === prev.expenseId) ? prev : sel[0]));
  };

  // 저장·내역상세 저장 뒤 그 행만 바꾼다(refreshOne: pay.Pay50_Expense.selectById → grid.store.update)
  const replaceRow = (row: PayExpense) => {
    setRows(prev => prev.map(r => (r.expenseId === row.expenseId ? row : r)));
    setChecked(prev => prev.map(r => (r.expenseId === row.expenseId ? row : r)));
    setEditRow(row);
  };

  return (
    <div style={{ height: '100%', background: '#fff' }}>
      <Splitter layout="vertical" style={{ height: '100%' }}>
        <Splitter.Panel min={120} max={1000}>
          <div style={{ height: '100%', padding: '20px 20px 0 20px', boxSizing: 'border-box' }}>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <SearchBar
                onSearch={() => void retrieve()}
                loading={loading}
                extra={(
                  <>
                    <Button type="delete" onClick={deleteRows}>삭제</Button>
                    <Button type="register" onClick={insert}>등록</Button>
                    <Button type="register" onClick={apprCheck}>상신</Button>
                  </>
                )}
              >
                <SearchBar.Field label="조회기간">
                  <DatePicker style={{ width: 130 }} allowClear={false} value={startDate} format={FORMAT} onChange={d => d && setStartDate(d)} />
                  <span style={{ margin: '0 4px' }}>~</span>
                  <DatePicker style={{ width: 130 }} allowClear={false} value={closeDate} format={FORMAT} onChange={d => d && setCloseDate(d)} />
                </SearchBar.Field>
                <SearchBar.Field label="구분">
                  <SystemCodeComboBox kindGroupCd="ExpenseType0004" altCode={ALL_CODE} style={{ width: 150 }} value={expenseCode}
                    onChange={c => { const v = c ?? ALL; setExpenseCode(v); void retrieve({ expenseCode: v }); }} />
                </SearchBar.Field>
                <SearchBar.Field label="검색">
                  <SearchBar.Input style={{ width: 200 }} placeholder="지출내역/지출처/비고" value={searchText} onChange={e => setSearchText(e.target.value)} />
                </SearchBar.Field>
                <Checkbox checked={statusCheckYn} onChange={e => setStatusCheckYn(e.target.checked)}>완료/반려건 제외</Checkbox>
              </SearchBar>
              <div style={{ flex: 1, minHeight: 0, marginTop: 8 }}>
                <MultiGrid<PayExpense>
                  gridRef={gridRef}
                  rowData={rows}
                  columnDefs={columnDefs}
                  getRowId={p => String(p.data.expenseId)}
                  loading={loading}
                  sumRow={{ labelField: 'occDate', label: '계', sum: ['settleAmt'] }}
                  onRowDataUpdated={e => { if (e.api.getSelectedRows().length === 0) e.api.getDisplayedRowAtIndex(0)?.setSelected(true); }}
                  onSelectionChanged={e => syncEditRow(e.api)}
                  onRowClicked={e => { if (e.data && e.node.isSelected()) { setEditRow(e.data); } }}
                />
              </div>
            </div>
          </div>
        </Splitter.Panel>
        <Splitter.Panel defaultSize={360} min={360} max={900}>
          <div style={{ height: '100%', padding: 20, boxSizing: 'border-box' }}>
            <Pay50_Edit_Expense model={editRow} isManager={false} onSaved={replaceRow} onChanged={replaceRow} />
          </div>
        </Splitter.Panel>
      </Splitter>
      <Pay50_Lookup_ExpenseRequestInsert open={insertOpen} mode="pass" isManager={false}
        onSaved={() => void retrieve()} onClose={() => setInsertOpen(false)} />
      {/* apprSelect(): Dcr01_Lookup_Class.open(classTreeId, classTreeModel, callback → insertLinkApproval) */}
      <Dcr01_Lookup_Class
        open={classPick != null}
        classTreeId={classPick?.prefillId ?? null}
        onResult={r => { if (classPick) setLinkDoc({ classTreeId: r.classTreeId, ids: classPick.ids, firstId: classPick.firstId }); setClassPick(null); }}
        onClose={() => setClassPick(null)}
      />
      {/* insertLinkApproval() L492-515: Apr01_Edit_ApprDoc.insertLinkApprovals(classTreeModel, "A63", {expenseList, gridCnt, desc, orgName, accountName, dueDate, occDate, isManager: false}, false, callback → updateExpenseApprId) / viewAppr() retrieveApproval */}
      <Apr01_Edit_ApprDoc
        apprId={viewApprId}
        link={linkDoc ? { classTreeId: linkDoc.classTreeId, linkCode: 'A63', refId: linkDoc.firstId, args: { ids: linkDoc.ids.join(','), isManager: 'false' } } : null}
        onLinkSaved={id => void updateExpenseApprId(id)}
        onClosed={() => void retrieve()}
        onClose={() => { setViewApprId(null); setLinkDoc(null); }}
      />
    </div>
  );
};
