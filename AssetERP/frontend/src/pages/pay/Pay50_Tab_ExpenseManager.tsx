/**
 * [1385] 자금관리 > 20. 사업비관리 > 지출결의서(경영관리) (U03)
 * AS-IS: myApp/client/vi/pay/Pay50_Tab_ExpenseManager.java (875줄) + Pay50_Edit_Expense.java (723줄, 아래 편집 폼) + Pay51_Lookup_ExpenseForm·Pay50_Lookup_RejectReason·Pay50_Lookup_ExpenseRequestList·
 *   Pay52_Lookup_AccountCode·Pay50_Lookup_Content (pages/pay) + Sys17_Lookup_Account (components/lookup)
 *   — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L108-168: Center(여백 20·20·0·20) = 테두리 박스(툴바 두 줄 50 + 지출결의서 그리드) / South(350, 분할, 여백 20) = 편집 폼(Pay50_Edit_Expense)
 * 열 때 한 번 조회한다(구분 콤보 생성 콜백 → retrieve). 조회가 끝나면 첫 행을 고른다(select(0))
 * 1단계: 바로등록(Pay50_Lookup_ExpenseRequestInsert)·상신/문서보기(Apr01_Edit_ApprDoc)·반려건 일괄 알림발송(SMS·톡·메일)·증빙자료(Com01_Lookup_RelateAppr)는 다음 단계 — 안내만 띄운다
 * 스타일: SGEF (견본 — docs/page-style.md. yunhee page-style은 SGVF로 읽으나 아래 폼이 저장이 있는 편집형이라 SGEF를 따른다)
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 원본에 없어 넣지 않는다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, DatePicker, message, Modal, Splitter } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { payApi } from '@/api/pay';
import { errorMessage } from '@/api/client';
import { PayExpense, PayExpenseRequest } from '@/types/pay';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { SearchBar } from '@/components/search';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { Pay50_Edit_Expense } from './Pay50_Edit_Expense';
import { Pay50_Lookup_ExpenseRequestList } from './Pay50_Lookup_ExpenseRequestList';
import { Pay50_Lookup_RejectReason } from './Pay50_Lookup_RejectReason';
import { Pay51_Lookup_ExpenseForm } from './Pay51_Lookup_ExpenseForm';

const gb = gbFor<PayExpense>();
const FORMAT = 'YYYY-MM-DD';
const ALL = '%';
/** 콤보 "전체"(ComboBoxField(kind, "%", "전체")) */
const ALL_CODE: [string, string] = [ALL, '전체'];

/** 상신상태 코드별 거절 문구 (rejectCheck L548-568 / apprCheck L732-752). 40은 반려취소에서만 문구가 다르다 */
const APPR_STATUS_MESSAGE: Record<string, string> = {
  '10': '이미 상신중인 문서가 있습니다.',
  '20': '이미 결재중인 문서가 있습니다.',
  '30': '이미 완료 문서가 있습니다.',
  '40': '이미 반려된 문서가 있습니다.',
  '99': '임시저장된 문서가 있습니다. 삭제후 다시 시도해주세요.',
};

/** 이미 반려·상신된 건이 있으면 그 안내 문구, 없으면 undefined */
const processedMessage = (e: PayExpense): string | undefined => {
  if (e.rejectReason != null) return '이미 반려처리된 건이 있습니다.';
  return e.expenseApprStatusCode != null ? APPR_STATUS_MESSAGE[e.expenseApprStatusCode] : undefined;
};

/** buildGrid() L310-341: setChecked(MULTI), 문서보기 아이콘(actionCell) */
const buildGrid = (viewAppr: (row: PayExpense) => void) => [
  gb.date('occDate', 90, '발생일자'),  // L313
  gb.date('dueDate', 90, '지급요청일'),
  gb.text('expenseName', 100, '구분'),
  gb.text('desc', 250, '지출내역'),
  gb.text('corpName', 150, '지출처'),
  gb.long('settleAmt', 100, '지출금액'),
  gb.text('accountName', 100, '계정과목'),
  gb.textCenter('fileCountStr', 60, '증빙자료'),
  gb.date('regDate', 90, '요청일'),
  gb.text('regEmpOrgName', 150, '요청자'),
  gb.textCenter('expenseStatusName', 70, '처리상태'),
  gb.text('expenseApprTitle', 150, '상신문서명'),
  gb.textCenter('expenseApprStatusName', 70, '상신상태'),
  iconCell<PayExpense>('view', 'actionCell', 50, '문서보기', viewAppr),
  gb.text('note', 150, '비고'),
];

const monthStart = () => dayjs().startOf('month');

export const Pay50_Tab_ExpenseManager: React.FC = () => {
  // new Pay50_Edit_Expense(grid, true): 이 화면은 항상 관리자 모드(경영관리)
  const gridRef = useRef<AgGridReact<PayExpense>>(null);
  // [E0] 화면 열림 (생성자 L108-168) → settings() L170-308: 조회기간 = 이번 달 1일 ~ 두 달 뒤 말일, 구분·지급방법 "전체", 검색칸 200 "구분/지출내역/지출처/요청자/비고", "완료/반려건 제외" 체크
  const [startDate, setStartDate] = useState(monthStart());
  const [closeDate, setCloseDate] = useState(monthStart().add(2, 'month').subtract(1, 'day'));
  const [expenseCode, setExpenseCode] = useState<string>(ALL);
  const [payMethodCode, setPayMethodCode] = useState<string>(ALL);
  const [searchText, setSearchText] = useState('');
  const [statusCheckYn, setStatusCheckYn] = useState(true);
  const [rows, setRows] = useState<PayExpense[]>([]);
  const [loading, setLoading] = useState(false);
  /** 체크한 행 (grid.getSelectionModel().getSelectedItems()) */
  const [checked, setChecked] = useState<PayExpense[]>([]);
  /** 아래 편집 폼에 보여 줄 행 (retrieveEditForm: getSelectedItem()) */
  const [editRow, setEditRow] = useState<PayExpense | null>(null);
  const [requestCount, setRequestCount] = useState(0);
  const [requestOpen, setRequestOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectIds, setRejectIds] = useState<number[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const retrieveSeq = useRef(0);

  // setAnchorText() L343-369: pay.Pay50_Expense.selectExpenseRequest(companyId, "%") → 건수 > 0이면 안내와 링크를 보인다
  const setAnchorText = useCallback(async () => {
    try {
      setRequestCount((await payApi.searchExpenseRequests('')).length);
    } catch {
      setRequestCount(0);
    }
  }, []);

  // retrieve() L450-477: pay.Pay50_Expense.selectExpenseAppr(… managerYn true) → 조회가 끝나면 첫 행을 고르고 setAnchorText()
  const retrieve = useCallback(async (over: Partial<{ expenseCode: string; payMethodCode: string }> = {}) => {
    const my = ++retrieveSeq.current;
    setLoading(true);  // grid.mask("Loading")
    try {
      const list = await payApi.searchExpenses({
        startDate: startDate.format(FORMAT), closeDate: closeDate.format(FORMAT), statusCheckYn,
        expenseCode: over.expenseCode ?? expenseCode, payMethodCode: over.payMethodCode ?? payMethodCode, searchText, managerYn: true,
      });
      if (my !== retrieveSeq.current) return;
      setRows(list);
      if (list.length === 0) { setChecked([]); setEditRow(null); }
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      if (my === retrieveSeq.current) setLoading(false);
    }
    void setAnchorText();
  }, [startDate, closeDate, statusCheckYn, expenseCode, payMethodCode, searchText, setAnchorText]);

  // [E4] expenseComboBox.callbackOnCreate (L205) → retrieve() — 열 때 한 번
  useEffect(() => { void retrieve(); }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // [E5] expenseComboBox.Collapse (L213) / [E6] payMethodComboBox.Collapse (L221) → retrieve()
  // [E7] searchText.KeyPress [Enter] (L230) / [E8] retrieveButton[조회].Select (L242) → retrieve() (SearchBar)

  // viewAppr() L398-433: 상신문서가 없으면 "상신문서가 존재하지 않습니다", 있으면 Apr01_Edit_ApprDoc.open — 다른 도메인 컴포넌트라 다음 단계
  const viewAppr = useCallback((row: PayExpense) => {
    if (row.expenseApprId == null) { message.warning('상신문서가 존재하지 않습니다'); return; }
    message.info('전자결재 문서창(Apr01_Edit_ApprDoc)은 다음 단계에서 변환합니다.');
  }, []);
  const columnDefs = useMemo(() => buildGrid(viewAppr), [viewAppr]);

  // [E3] hiperLink[지출요청내역 가져오기].MouseDown (L194) → lookupRequest() L371-396: 고른 요청내역을 가져오고(updateApprEmpId) "n건의 지출요청내역을 가져왔습니다" → retrieve()
  const lookupRequest = async (list: PayExpenseRequest[]) => {
    setRequestOpen(false);
    try {
      await payApi.takeExpenseRequests(list);
      message.info(`${list.length}건의 지출요청내역을 가져왔습니다`);
      await retrieve();
    } catch (err) {
      message.error(errorMessage(err, '가져오기 실패'));
    }
  };

  // [E9] deleteButton[삭제].Select (L248) → delete() L495-527: "n건의 내역을 삭제하시겠습니까?"(350) → [E17] YES → pay.Pay50_Expense.initExpense → 성공이면 retrieve(), 아니면 서버 메시지
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

  // [E10] insertButton[바로등록].Select (L254) → insert() L529-537: Pay50_Lookup_ExpenseRequestInsert.insertPass — 다음 단계
  const insert = () => message.info('바로등록 창(Pay50_Lookup_ExpenseRequestInsert)은 다음 단계에서 변환합니다.');

  // [E12] rejectButton[반려].Select (L266) → rejectCheck() L539-591
  const rejectCheck = () => {
    if (checked.length < 1) { message.warning('반려할 내용을 선택해주세요'); return; }
    for (const e of checked) {
      const msg = processedMessage(e);
      if (msg) { message.warning(msg); return; }
    }
    const ids = checked.map(r => r.expenseId);
    // [E18] msgBox.DialogHide [YES] (L575) → reject() L647-660: Pay50_Lookup_RejectReason → updateReject
    Modal.confirm({ title: '확인', content: `${ids.length}건의 내역을 반려하시겠습니까?`, width: 380, okText: '예', cancelText: '아니오', onOk: () => { setRejectIds(ids); setRejectOpen(true); } });
  };

  // updateReject() L662-680: pay.Pay50_Expense.updateRejectReason → retrieve()
  const updateReject = async (reason: string | null, ids: number[]) => {
    try {
      await payApi.rejectExpenses(ids, reason);
      await retrieve();
    } catch (err) {
      message.info(errorMessage(err, '처리 실패'));
    }
  };

  // [E14] rejectCancelButton[반려취소].Select (L278) → rejectCancelCheck() L593-645
  const rejectCancelCheck = () => {
    if (checked.length < 1) { message.warning('반려 취소할 내용을 선택해주세요'); return; }
    for (const e of checked) {
      if (e.rejectReason == null && e.expenseApprStatusCode == null) { message.warning('아직 진행중인 건이 있습니다.'); return; }
      if (e.expenseApprStatusCode != null) {
        const msg = e.expenseApprStatusCode === '40' ? '반려 처리된 문서가 있습니다.' : APPR_STATUS_MESSAGE[e.expenseApprStatusCode];
        if (msg) { message.warning(msg); return; }
      }
    }
    const ids = checked.map(r => r.expenseId);
    // [E19] msgBox.DialogHide [YES] (L629) → updateReject(null, expenseList)
    Modal.confirm({ title: '확인', content: `${ids.length}건의 내역을 반려취소 하시겠습니까?`, width: 380, okText: '예', cancelText: '아니오', onOk: () => updateReject(null, ids) });
  };

  // [E11] apprButton[상신].Select (L260) → apprCheck() L682-778: 발생일자 순으로 훑으며 계정과목·발생부서·계정과목 일치를 검사한다(지급요청일 일치 검사는 원본에서 주석 처리됨)
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
      const msg = processedMessage(e);
      if (msg) { message.warning(msg); return; }
    }
    // [E20] msgBox.DialogHide [YES] (L762) → apprSelect() L780-810: dcr.Dcr30_Link.selectByLinkCode → 문서분류 선택 → insertLinkApproval() L812-835: Apr01_Edit_ApprDoc — 다음 단계
    Modal.confirm({
      title: '확인', content: `${checked.length}건의 상신을 진행하시겠습니까?`, width: 380, okText: '예', cancelText: '아니오',
      onOk: () => { message.info('전자결재 편집창(Apr01_Edit_ApprDoc)은 다음 단계에서 변환합니다.'); },
    });
  };

  // [E13] rejectSMSButton[반려건 일괄 알림발송].Select (L272) → rejectSMS() L852-867: pay.Pay50_Expense.rejectSendMessage — SMS·톡·메일 발송은 다음 단계
  const rejectSMS = () => message.info('반려건 일괄 알림발송(SMS·톡·메일)은 다음 단계에서 변환합니다.');

  // [E16] grid.SelectionChanged [선택>0] (L297) → retrieveEditForm() L435-448: 고른 행을 아래 폼에, 고른 게 없으면 폼을 끈다
  const syncEditRow = (api: NonNullable<AgGridReact<PayExpense>['api']>, preferred?: PayExpense) => {
    const sel = api.getSelectedRows();
    setChecked(sel);
    if (sel.length === 0) setEditRow(null);
    else if (preferred && sel.some(r => r.expenseId === preferred.expenseId)) setEditRow(preferred);
    else setEditRow(prev => (prev && sel.some(r => r.expenseId === prev.expenseId) ? prev : sel[0]));
  };

  // 저장·내역상세 저장 뒤 그 행만 바꾼다(refreshOne L479-493: pay.Pay50_Expense.selectById → grid.store.update)
  const replaceRow = (row: PayExpense) => {
    setRows(prev => prev.map(r => (r.expenseId === row.expenseId ? row : r)));
    setChecked(prev => prev.map(r => (r.expenseId === row.expenseId ? row : r)));
    setEditRow(row);
  };

  return (
    <div style={{ height: '100%', background: '#fff' }}>
      <Splitter layout="vertical" style={{ height: '100%' }}>
        <Splitter.Panel min={200}>
          <div style={{ height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', padding: '20px 20px 8px', gap: 8 }}>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <SearchBar
                onSearch={() => void retrieve()}
                loading={loading}
                extra={(
                  <>
                    <Button type="delete" onClick={deleteRows}>삭제</Button>
                    <Button type="register" onClick={insert}>바로등록</Button>
                    {/* [E15] updateFormButton[양식관리].Select (L284) → Pay51_Lookup_ExpenseForm.open */}
                    <Button type="register" onClick={() => setFormOpen(true)}>양식관리</Button>
                  </>
                )}
              >
                <SearchBar.Field label="조회기간">
                  <DatePicker style={{ width: 130 }} allowClear={false} value={startDate} format={FORMAT} onChange={d => d && setStartDate(d)} />
                  <span style={{ margin: '0 4px' }}>~</span>
                  <DatePicker style={{ width: 130 }} allowClear={false} value={closeDate} format={FORMAT} onChange={d => d && setCloseDate(d)} />
                </SearchBar.Field>
                <SearchBar.Field label="구분">
                  <SystemCodeComboBox kindGroupCd="ExpenseType0001" altCode={ALL_CODE} style={{ width: 120 }} value={expenseCode}
                    onChange={c => { const v = c ?? ALL; setExpenseCode(v); void retrieve({ expenseCode: v }); }} />
                </SearchBar.Field>
                {/* [E1] payMethodComboBox.callbackOnCreate (L83) → setText("전체") — altCode(전체)가 처음부터 "전체"를 보여 준다 */}
                <SearchBar.Field label="지급방법">
                  <SystemCodeComboBox kindCd="PayMethodCode" altCode={ALL_CODE} style={{ width: 100 }} value={payMethodCode}
                    onChange={c => { const v = c ?? ALL; setPayMethodCode(v); void retrieve({ payMethodCode: v }); }} />
                </SearchBar.Field>
                <SearchBar.Field label="검색">
                  <SearchBar.Input style={{ width: 200 }} placeholder="구분/지출내역/지출처/요청자/비고" value={searchText} onChange={e => setSearchText(e.target.value)} />
                </SearchBar.Field>
                <Checkbox checked={statusCheckYn} onChange={e => setStatusCheckYn(e.target.checked)}>완료/반려건 제외</Checkbox>
              </SearchBar>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Button type="register" onClick={apprCheck}>상신</Button>
                <Button type="cancel" onClick={rejectCheck}>반려</Button>
                <Button type="send" onClick={rejectSMS}>반려건 일괄 알림발송</Button>
                <Button type="cancel" onClick={rejectCancelCheck}>반려취소</Button>
                {/* [E2] refresh.MouseDown (L187) → setAnchorText() */}
                <ReloadOutlined style={{ marginLeft: 12, cursor: 'pointer' }} onClick={() => void setAnchorText()} />
                <b style={{ fontSize: 13 }}>
                  {requestCount > 0
                    ? <>신규 지출요청 내역이 <span style={{ color: 'red' }}>{requestCount}건</span> 존재합니다.</>
                    : '신규 지출요청 내역이 없습니다.'}
                </b>
                {requestCount > 0 && (
                  <b style={{ fontSize: 13, color: '#0078D7', textDecoration: 'underline', cursor: 'pointer' }} onClick={() => setRequestOpen(true)}>지출요청내역 가져오기</b>
                )}
              </div>
              <div style={{ flex: 1, minHeight: 0 }}>
                <MultiGrid<PayExpense>
                  gridRef={gridRef}
                  rowData={rows}
                  columnDefs={columnDefs}
                  getRowId={p => String(p.data.expenseId)}
                  loading={loading}
                  onRowDataUpdated={e => { if (e.api.getSelectedRows().length === 0) e.api.getDisplayedRowAtIndex(0)?.setSelected(true); }}
                  onSelectionChanged={e => syncEditRow(e.api)}
                  onRowClicked={e => { if (e.data && e.node.isSelected()) { setEditRow(e.data); } }}
                />
              </div>
            </div>
          </div>
        </Splitter.Panel>
        <Splitter.Panel defaultSize={350} min={300} max={900}>
          <div style={{ height: '100%', padding: 20, boxSizing: 'border-box' }}>
            <Pay50_Edit_Expense model={editRow} isManager onSaved={replaceRow} onChanged={replaceRow} />
          </div>
        </Splitter.Panel>
      </Splitter>
      <Pay50_Lookup_ExpenseRequestList open={requestOpen} onResult={list => void lookupRequest(list)} onClose={() => setRequestOpen(false)} />
      <Pay50_Lookup_RejectReason open={rejectOpen} mode="open"
        onResult={reason => {
          if (reason == null) { message.info('취소되었습니다.'); return; }
          void updateReject(reason, rejectIds);
        }}
        onClose={() => setRejectOpen(false)} />
      <Pay51_Lookup_ExpenseForm open={formOpen} onClose={() => setFormOpen(false)} />
    </div>
  );
};
