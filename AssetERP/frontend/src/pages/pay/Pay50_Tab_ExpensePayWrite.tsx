/**
 * [1386] 자금관리 > 20. 사업비관리 > 자금집행결의서 (U07)
 * AS-IS: myApp/client/vi/pay/Pay50_Tab_ExpensePayWrite.java (864줄) + Pay50_Lookup_UpdateDeposit·Pay50_Lookup_NewExpenseApprList (pages/pay) + Sys15_Lookup_TelInfo (pages/sys)
 *   + Ast01_Lookup_CorpAccount (pages/ast, 출금계좌) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L115-166: Center(여백 20) = 툴바 두 줄(조회기간 100~100 · 구분 150 · 지급여부 80 · 검색 200 "지출내역/지출처" · 완료(과거)/반려건 제외 · [조회][삭제] /
 *   [상신][저장][일괄저장][엑셀다운로드] + 새로고침·안내·링크) + 자금집행결의서 그리드(체크 다중, 14열, 합계 행 "계")
 * 열 때 한 번 조회한다(구분 콤보 생성 콜백 → retrieve)
 * 1단계: [상신]이 여는 전자결재 편집창 Apr01_Edit_ApprDoc(문서분류 Dcr01_Lookup_Class 포함 apprSelect·insertLinkApproval·updateExpenseApprId)과
 *   그리드 [지출결의서]·[집행결의서] 문서보기 아이콘의 상신문서 열기는 다른 도메인(apr·dcr)이라 다음 단계 — 원본의 검사·확인창까지만 하고 안내만 띄운다
 * 스타일: SG (견본 — docs/page-style.md)
 * UX보강(10): 툴바 = SearchBar(UX-01·04), 저장(n)(UX-03). 초기화(UX-02)는 원본에 없어 넣지 않는다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, DatePicker, message, Modal } from 'antd';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import { payApi } from '@/api/pay';
import { rdApi } from '@/api/rd';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { PayExpenseNew, PayExpenseSettle } from '@/types/pay';
import { Code } from '@/types/sys';
import { useGridCrud } from '@/hooks/useGridCrud';
import { rdDownload } from '@/utils/rdDownload';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { SearchBar } from '@/components/search';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { Ast01_Lookup_CorpAccount } from '@/pages/ast/Ast01_Lookup_CorpAccount';
import { Sys15_Lookup_TelInfo } from '@/pages/sys/Sys15_Lookup_TelInfo';
import { Pay50_Lookup_NewExpenseApprList } from './Pay50_Lookup_NewExpenseApprList';
import { Pay50_Lookup_UpdateDeposit } from './Pay50_Lookup_UpdateDeposit';

const gb = gbFor<PayExpenseSettle>();
const FORMAT = 'YYYY-MM-DD';
/** 콤보 "전체"(ComboBoxField(kind, "%", "전체")) */
const ALL_CODE: [string, string] = ['%', '전체'];
const SUM_ROW = { labelField: 'dueDate', label: '계', sum: ['settleAmt'] };

const monthStart = () => dayjs().startOf('month');

/** checkApprStatus() L764-782: 집행결의서 상신 상태가 막는 경우의 안내 문구, 막지 않으면 undefined */
const apprStatusMessage = (statusCode: string | null): string | undefined => {
  if (statusCode == null) return undefined;
  if (statusCode === '99') return '임시저장 상태의 상신문서가 존재합니다. 삭제후 진행하세요';
  if (statusCode === '40' || statusCode === '30') return undefined;  // 40:반려 / 30:완료(지급되지 않은 건이면 자금집행일을 바꿔 다시 상신할 수 있다)
  return '진행중 또는 완료된 상신내역이 존재합니다';
};

/** preUpdate() L513-553·apprCheck() L629-697의 행 검사 — 첫 번째 걸리는 안내 문구 */
const checkRow = (e: PayExpenseSettle): string | undefined => {
  if (e.payMethodCode == null || e.payMethodCode === '') return '지급방법을 선택하세요';
  if (e.payMethodCode === '10' && (e.payAccountInfo == null || e.payAccountInfo === '')) return '지급요청계좌를 입력하세요';  // 10:계좌이체
  if (e.settleDate == null) return '자금집행일을 입력하세요';
  if (e.depositId == null) return '지급계좌를 선택하세요';
  if (e.payYn) return '지급완료된 내역입니다.';
  return apprStatusMessage(e.settleApprStatusCode);
};

export const Pay50_Tab_ExpensePayWrite: React.FC = () => {
  // [E0] 화면 열림 (생성자 L115-166) → settings() L168-275: 조회기간 = 이번 달 1일 ~ 두 달 뒤 말일, 구분·지급여부 "전체", 검색칸 200 "지출내역/지출처", "완료(과거)/반려건 제외" 체크
  const [startDate, setStartDate] = useState<Dayjs>(monthStart());
  const [closeDate, setCloseDate] = useState<Dayjs>(monthStart().add(2, 'month').subtract(1, 'day'));
  const [expenseCode, setExpenseCode] = useState('%');
  const [payYnCode, setPayYnCode] = useState('%');
  const [searchText, setSearchText] = useState('');
  const [statusCheckYn, setStatusCheckYn] = useState(true);
  const [payMethods, setPayMethods] = useState<Code[]>([]);
  const [newCount, setNewCount] = useState(0);
  const [newOpen, setNewOpen] = useState(false);
  const [depositOpen, setDepositOpen] = useState(false);
  const [depositIds, setDepositIds] = useState<number[]>([]);
  const [telRow, setTelRow] = useState<PayExpenseSettle | null>(null);
  /** 출금계좌 조회창을 연 행 (lookupDeposit() L594-627) */
  const [accountRow, setAccountRow] = useState<PayExpenseSettle | null>(null);
  const [busy, setBusy] = useState(false);

  /** search()가 읽는 조건 — 콤보를 바꾸자마자 조회해도 새 값으로 간다 */
  const condRef = useRef({ startDate, closeDate, expenseCode, payYnCode, searchText, statusCheckYn });
  condRef.current = { startDate, closeDate, expenseCode, payYnCode, searchText, statusCheckYn };
  const toParams = () => {
    const c = condRef.current;
    return { startDate: c.startDate.format(FORMAT), closeDate: c.closeDate.format(FORMAT), expenseCode: c.expenseCode, payYnCode: c.payYnCode, statusCheckYn: c.statusCheckYn, searchText: c.searchText };
  };

  // setAnchorText() L307-334: pay.Pay50_Expense.selectNewExpenseAppr(companyId, targetType "SETTLE", searchText "%") → 건수 > 0이면 안내와 링크를 보인다
  const setAnchorText = useCallback(async () => {
    try {
      setNewCount((await payApi.searchNewExpenseSettles({ searchText: '' })).length);
    } catch {
      setNewCount(0);
    }
  }, []);

  // retrieve() L492-511: pay.Pay50_Expense.selectExpensePay(companyId, startDate, closeDate, expenseCode, payYnCode, statusCheckYn, searchText) → 끝나면 setAnchorText()
  // preUpdate() L513-553: 변경된 행마다 지급방법·지급요청계좌·자금집행일·지급계좌·지급완료·상신상태를 검사하고, update() L555-558: pay.Pay50_Expense.update
  const crud = useGridCrud<PayExpenseSettle>({
    idField: 'expenseId',
    search: async () => {
      const list = await payApi.searchExpenseSettles(toParams());
      void setAnchorText();
      return list;
    },
    save: async rows => {
      await payApi.saveExpenseSettles(rows.map(r => ({
        expenseId: r.expenseId, payMethodCode: r.payMethodCode, payAccountInfo: r.payAccountInfo,
        settleDate: r.settleDate, depositId: r.depositId, settleNote: r.settleNote,
      })));
      return rows;
    },
    remove: async () => undefined,  // [삭제]는 initExpenseSettle(deleteRows)로 따로 한다
    newRow: () => ({}),
    validate: changed => {
      for (const r of changed) {
        const msg = checkRow(r);
        if (msg) return msg;
      }
      return undefined;
    },
    reloadAfterSave: true,
  });

  useEffect(() => { void crud.retrieve(); }, []);  // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { void sysApi.searchCodes('PayMethodCode').then(setPayMethods).catch(() => setPayMethods([])); }, []);

  const checkedRows = (): PayExpenseSettle[] => crud.gridRef.current?.api.getSelectedRows() ?? [];

  // [E7] hiperLink[자금집행 예정내역 가져오기].MouseDown (L232) → lookupNewExpenseAppr() L336-361: 고른 예정내역을 가져오고(updateSettleEmpId) "n건의 신규 자금집행 예정내역을 가져왔습니다" → retrieve()
  const lookupNewExpenseAppr = async (list: PayExpenseNew[]) => {
    setNewOpen(false);
    try {
      await payApi.takeExpenseSettles(list);
      message.info(`${list.length}건의 신규 자금집행 예정내역을 가져왔습니다`);
      await crud.retrieve();
    } catch (err) {
      message.error(errorMessage(err, '가져오기 실패'));
    }
  };

  // [E11] deleteButton[삭제].Select (L257) → preDelete() L560-592: "n건의 내역을 삭제하시겠습니까?"(350) → [E16] YES → pay.Pay50_Expense.initExpenseSettle → 성공이면 retrieve(), 아니면 서버 메시지
  const preDelete = () => {
    const list = checkedRows();
    Modal.confirm({
      title: '확인', content: `${list.length}건의 내역을 삭제하시겠습니까?`, width: 350, okText: '예', cancelText: '아니오',
      onOk: async () => {
        try {
          await payApi.initExpenseSettles(list.map(r => r.expenseId));
          await crud.retrieve();
        } catch (err) {
          message.info(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  // [E10] selectUpdateButton[일괄저장].Select (L251) → lookupUpdateDeposit() L277-305
  const lookupUpdateDeposit = () => {
    if (crud.hasChanges()) { message.warning('저장이 필요한 내역이 존재합니다'); return; }
    const list = checkedRows();
    if (list.length === 0) { message.warning('선택한 내역이 없습니다'); return; }
    //자금집행결의서 상신상태 체크
    if (list.some(r => ['10', '20', '30'].includes(r.settleApprStatusCode ?? ''))) {
      message.warning('자금집행결의서가 진행중 또는 완료된 내역은 수정할 수 없습니다');
      return;
    }
    setDepositIds(list.map(r => r.expenseId));
    setDepositOpen(true);
  };

  // [E12] apprButton[상신].Select (L263) → apprCheck() L629-697: 행 검사 + 자금집행일이 모두 같아야 한다 → [E17] YES → apprSelect() L699-729 (다음 단계)
  const apprCheck = () => {
    const list = checkedRows();
    if (list.length < 1) { message.warning('상신할 내용을 선택해주세요'); return; }
    let settleDate: string | null = null;
    for (const e of list) {
      const msg = checkRow(e);
      if (msg) { message.warning(msg); return; }
      if (settleDate == null) settleDate = e.settleDate;
      else if (settleDate !== e.settleDate) { message.warning('자금집행일이 다릅니다. 확인해주세요.'); return; }
    }
    Modal.confirm({
      title: '확인', content: `${list.length}건의 상신을 진행하시겠습니까?`, width: 380, okText: '예', cancelText: '아니오',
      onOk: () => {
        // apprSelect: dcr.Dcr30_Link.selectByLinkCode("A64") → Dcr01_Lookup_Class → insertLinkApproval → Apr01_Edit_ApprDoc → updateExpenseApprId(updatesSttleApprId) — 다음 단계
        message.info('전자결재 편집창(Apr01_Edit_ApprDoc)은 다음 단계에서 변환합니다.');
      },
    });
  };

  // [E13] downloadButton[엑셀다운로드].Select (L269) → createRdExcel() L789-845: sys.Sys99_Print.insertRdExpensePay(companyId, personId, "Pay50_Tab_ExpensePay", 조회 조건)
  //   → 성공이면 RDUtil.download(page CommonInvokerDownload.jsp · mrd Pay50_Rd_ExpensePay · options "/rexportopt [6] /rxlsopt [100]" · 파일 "자금집행결의서(시작 ~ 끝).xlsx" · rv rdGroupId·startDate·closeDate)
  const createRdExcel = async () => {
    setBusy(true);  // grid.mask("Loading")
    try {
      const p = toParams();
      const groupId = await payApi.rdPrintExpenseSettles(p);
      const res = await rdApi.buildUrl({
        kind: 'download',
        mrd: 'Pay50_Rd_ExpensePay',
        options: '/rexportopt [6] /rxlsopt [100]',
        exportType: 'xlsx',
        fileName: `자금집행결의서(${p.startDate} ~ ${p.closeDate}).xlsx`,
        rv: { rdGroupId: groupId, startDate: p.startDate, closeDate: p.closeDate },
      });
      await rdDownload(res);
    } catch (err) {
      message.error(errorMessage(err, '다운로드 실패'));
    } finally {
      setBusy(false);
    }
  };

  // viewExpenseAppr() L420-454 / viewAppr() L456-490: 상신문서가 없으면 "상신문서가 존재하지 않습니다", 있으면 Apr01_Edit_ApprDoc.retrieveApproval — 다른 도메인 컴포넌트라 다음 단계
  const viewAppr = useCallback((apprId: number | null) => {
    if (apprId == null) { message.warning('상신문서가 존재하지 않습니다'); return; }
    message.info('전자결재 문서창(Apr01_Edit_ApprDoc)은 다음 단계에서 변환합니다.');
  }, []);

  // lookupDeposit() L594-627: 자금집행일이 없으면 "자금집행일을 선택하세요", 기준일 = 자금집행일(오늘보다 뒤면 오늘), Ast01_Lookup_CorpAccount.open(기준일, "NOT", callback)
  const lookupDeposit = useCallback((expenseId: number) => {
    const row = crud.gridRef.current?.api.getRowNode(String(expenseId))?.data;
    if (!row) return;
    if (row.settleDate == null) { message.warning('자금집행일을 선택하세요'); return; }
    setAccountRow(row);
  }, [crud.gridRef]);

  const accountStdDate = accountRow?.settleDate
    ? (dayjs(accountRow.settleDate).isAfter(dayjs(), 'day') ? dayjs() : dayjs(accountRow.settleDate))
    : dayjs();

  // buildGrid() L363-418: setChecked(MULTI), 합계 행 setSumGridHeader("계", 2)·setSumGrid(6) = 지급요청일 칸에 "계", 지급금액 합계
  const columnDefs = useMemo(() => [
    gb.date('dueDate', 90, '지급요청일'),  // L399
    gb.text('expenseName', 100, '구분'),
    gb.text('desc', 200, '지출내역'),
    gb.text('corpName', 150, '지출처'),  // [E5] grid.CellDoubleClick [cellIndex 5] (L215) → lookupOpenCorpInfo() L784-787: Sys15_Lookup_TelInfo.view
    gb.long('settleAmt', 100, '지급금액'),
    // [E14] payMethodCombo[PayMethodCode].Collapse (L365) → 고른 코드를 지급방법(payMethodCode)의 변경으로 기록
    gb.textCenter('payMethodName', 100, '지급방법', {
      editor: 'select',
      values: payMethods.map(c => c.name),
      valueSetter: p => {
        const code = payMethods.find(c => c.name === p.newValue)?.code;
        if (code == null) return false;
        p.data.payMethodName = p.newValue;
        p.data.payMethodCode = code;
        return true;
      },
    }),
    gb.text('payAccountInfo', 200, '지급요청계좌', { editor: 'text' }),
    gb.date('settleDate', 90, '자금집행일', { editor: 'date' }),
    // [E15] lookupDeposit.TriggerClick (L375) → lookupDeposit() — 조회창 트리거 열(11 §1)
    gb.text('depositName', 150, '출금계좌', {
      cellStyle: { color: '#1677ff' },
      cellRenderer: (p: { data?: PayExpenseSettle; value?: string }) => (
        <>
          <SearchOutlined style={{ marginRight: 4, cursor: 'pointer' }}
            onClick={e => { e.stopPropagation(); if (p.data) lookupDeposit(p.data.expenseId); }} />
          {p.value}
        </>
      ),
    }),
    gb.text('settleNote', 130, '비고', { editor: 'text' }),
    iconCell<PayExpenseSettle>('view', 'expenseApprView', 80, '지출결의서', row => viewAppr(row.expenseApprId)),  // L409 addCell → viewExpenseAppr()
    gb.textCenter('settleApprStatusName', 65, '집행결의서'),
    iconCell<PayExpenseSettle>('view', 'settleApprView', 30, '', row => viewAppr(row.settleApprId)),  // L411 addCell → viewAppr()
    gb.booleanYn2('payYn', 60, '지급여부'),
  ], [payMethods, lookupDeposit, viewAppr]);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', padding: 10, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E8] retrieveButton[조회].Select (L239) / [E4] searchText.KeyPress [Enter] (L201) → retrieve() */}
        <SearchBar
          onSearch={() => void crud.retrieve()}
          loading={crud.loading}
          extra={<Button type="delete" onClick={preDelete}>삭제</Button>}
        >
          <SearchBar.Field label="조회기간">
            <DatePicker style={{ width: 130 }} allowClear={false} value={startDate} format={FORMAT} onChange={d => d && setStartDate(d)} />
            <span style={{ margin: '0 4px' }}>~</span>
            <DatePicker style={{ width: 130 }} allowClear={false} value={closeDate} format={FORMAT} onChange={d => d && setCloseDate(d)} />
          </SearchBar.Field>
          {/* [E1] expenseComboBox.callbackOnCreate (L86) → retrieve() — 열 때 한 번 / [E2] expenseComboBox[ExpenseType].Collapse (L183) → retrieve() */}
          <SearchBar.Field label="구분">
            <SystemCodeComboBox kindCd="ExpenseType" altCode={ALL_CODE} style={{ width: 150 }} value={expenseCode}
              onChange={c => { const v = c ?? '%'; setExpenseCode(v); condRef.current.expenseCode = v; void crud.retrieve(); }} />
          </SearchBar.Field>
          {/* [E3] payYnComboBox[PayYnCode].Collapse (L192) → retrieve() */}
          <SearchBar.Field label="지급여부">
            <SystemCodeComboBox kindCd="PayYnCode" altCode={ALL_CODE} style={{ width: 80 }} value={payYnCode}
              onChange={c => { const v = c ?? '%'; setPayYnCode(v); condRef.current.payYnCode = v; void crud.retrieve(); }} />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 200 }} placeholder="지출내역/지출처" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
          <Checkbox checked={statusCheckYn} onChange={e => setStatusCheckYn(e.target.checked)}>완료(과거)/반려건 제외</Checkbox>
        </SearchBar>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Button type="register" onClick={apprCheck}>상신</Button>
          {/* [E9] updateButton[저장].Select (L245) → preUpdate() */}
          <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
          <Button type="save" onClick={lookupUpdateDeposit}>일괄저장</Button>
          <Button type="download" loading={busy} onClick={createRdExcel}>엑셀다운로드</Button>
          {/* [E6] refresh.MouseDown (L225) → setAnchorText() */}
          <ReloadOutlined style={{ marginLeft: 12, cursor: 'pointer' }} onClick={() => void setAnchorText()} />
          <b style={{ fontSize: 13 }}>
            {newCount > 0
              ? <>신규 자금집행 예정내역이 <span style={{ color: 'red' }}>{newCount}건</span> 존재합니다.</>
              : '신규 자금집행 예정내역이 없습니다.'}
          </b>
          {newCount > 0 && (
            <b style={{ fontSize: 13, color: '#0078D7', textDecoration: 'underline', cursor: 'pointer' }} onClick={() => setNewOpen(true)}>자금집행 예정내역 가져오기</b>
          )}
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <CellEditGrid<PayExpenseSettle>
            crud={crud}
            columnDefs={columnDefs}
            rowData={crud.rows}
            loading={crud.loading || busy}
            getRowId={p => String(p.data.expenseId)}
            sumRow={SUM_ROW}
            onCellDoubleClicked={e => { if (e.colDef.field === 'corpName' && e.data) setTelRow(e.data); }}
          />
        </div>
      </div>
      <Pay50_Lookup_NewExpenseApprList open={newOpen} onResult={list => void lookupNewExpenseAppr(list)} onClose={() => setNewOpen(false)} />
      <Pay50_Lookup_UpdateDeposit open={depositOpen} expenseIds={depositIds} onSaved={() => void crud.retrieve()} onClose={() => setDepositOpen(false)} />
      <Sys15_Lookup_TelInfo open={telRow != null} tel={telRow?.tel ?? null} addr={telRow?.addr ?? null} onClose={() => setTelRow(null)} />
      {/* callback.execute(result): null([선택안함])이면 출금계좌를 비운다 */}
      <Ast01_Lookup_CorpAccount open={accountRow != null} stdDate={accountStdDate} mode="NOT"
        onResult={row => {
          if (accountRow) crud.updateRow(accountRow.expenseId, { depositId: row?.classTreeId ?? null, depositName: row?.classTreeName ?? null });
          setAccountRow(null);
        }}
        onClose={() => setAccountRow(null)} />
    </div>
  );
};
