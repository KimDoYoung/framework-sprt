/**
 * 회계 미처리 내역 창 (U09) — Pay50_Tab_ExpenseJournal의 "회계처리대상 확인 및 전표생성하기" 링크가 연다
 * AS-IS: myApp/client/vi/pay/Pay50_Lookup_ExpenseUnJournal.java (383줄) + Pay50_Lookup_UpdateAccount (pages/pay) + Pay52_Lookup_AccountCode (pages/pay)
 *   — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L73-81: 모달 1350×550 "회계 미처리 내역"(크기 조절·최대화, X 없음). open(callback) L83-114: 툴바(구분 150 · 검색 "구분/지출내역/지출처" ·
 *   [조회][저장][일괄저장] · 하나의 전표로 생성하기 체크 · [전표생성]) + 체크박스 다중 그리드(계정과목 열은 조회 트리거 편집), [닫기], 열자마자 조회
 * UX보강(10): 검색 줄 = SearchBar(UX-01·04), 저장(n)(UX-03), 조회창(UX-05). 초기화(UX-02)는 원본에 없어 넣지 않는다
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, message, Modal } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { payApi } from '@/api/pay';
import { errorMessage } from '@/api/client';
import { PayExpenseNew } from '@/types/pay';
import { useGridCrud } from '@/hooks/useGridCrud';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { LookupModal } from '@/components/lookup/LookupModal';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { Pay50_Lookup_UpdateAccount } from './Pay50_Lookup_UpdateAccount';
import { Pay52_Lookup_AccountCode } from './Pay52_Lookup_AccountCode';

const gb = gbFor<PayExpenseNew>();
/** 콤보 "전체"(CommonComboBoxField(…, "%", "전체")) */
const ALL_CODE: [string, string] = ['%', '전체'];
const SUM_ROW = { labelField: 'desc', label: '계', sum: ['amt', 'tax', 'settleAmt'] };

interface Props {
  open: boolean;
  /** callback.execute(): 전표를 만든 뒤 (부르는 쪽이 다시 조회한다) */
  onCreated: () => void;
  onClose: () => void;
}

export const Pay50_Lookup_ExpenseUnJournal: React.FC<Props> = ({ open, onCreated, onClose }) => {
  const [expenseCode, setExpenseCode] = useState('%');
  const [searchText, setSearchText] = useState('');
  const [oneJournalYn, setOneJournalYn] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [updateRows, setUpdateRows] = useState<PayExpenseNew[]>([]);
  /** 계정과목 조회 트리거를 누른 행 (lookupAccount() L215-232) */
  const [accountRow, setAccountRow] = useState<PayExpenseNew | null>(null);

  /** search()가 읽는 조건 — 콤보를 바꾸자마자 조회해도 새 값으로 간다 */
  const condRef = useRef({ expenseCode, searchText });
  condRef.current = { expenseCode, searchText };

  // retrieve() L249-264: pay.Pay50_Expense.selectNewExpenseAppr(companyId, targetType "JOURNAL", expenseCode, "%검색어%")
  // [E5] updateButton[저장].Select (L158) → updateAccount() L266-275: pay.Pay50_Expense.updateAccountCode(변경된 행) → "저장이 완료되었습니다" → retrieve()
  const crud = useGridCrud<PayExpenseNew>({
    idField: 'expenseId',
    search: () => payApi.searchNewExpenseJournals(condRef.current),
    save: async rows => {
      await payApi.updateExpenseAccountCodes(rows);
      return rows;
    },
    remove: async () => undefined,
    newRow: () => ({} as PayExpenseNew),
    reloadAfterSave: true,
  });

  // [E0] 화면 열림 (생성자 L73-81, open L83-114) → 열자마자 조회(구분 콤보 생성 콜백 [E1] → retrieve()). 열 때마다 새 창이므로 조건을 처음 값으로
  useEffect(() => {
    if (!open) return;
    setExpenseCode('%');
    setSearchText('');
    setOneJournalYn(false);
    condRef.current = { expenseCode: '%', searchText: '' };
    void crud.retrieve();
  }, [open]);  // eslint-disable-line react-hooks/exhaustive-deps

  const checkedRows = (): PayExpenseNew[] => crud.gridRef.current?.api.getSelectedRows() ?? [];

  // [E6] selectUpdateButton[일괄저장].Select (L164) → lookupAccountUpdate() L234-247: 선택이 없으면 "선택된 내역이 없습니다", Pay50_Lookup_UpdateAccount.open(callback → retrieve())
  const lookupAccountUpdate = () => {
    const list = checkedRows();
    if (list.length === 0) { message.warning('선택된 내역이 없습니다'); return; }
    setUpdateRows(list);
    setUpdateOpen(true);
  };

  // [E7] createButton[전표생성].Select (L170) → preCreateJournal() L277-343
  const preCreateJournal = () => {
    if (crud.hasChanges()) { message.warning('저장이 필요한 내역이 존재합니다'); return; }
    const list = checkedRows();
    if (list.length === 0) { message.warning('선택한 내역이 없습니다'); return; }

    let msgWidth = 350;
    let msg = `${list.length}건의 전표를 생성하시겠습니까?`;
    if (oneJournalYn) {
      msgWidth = 400;
      msg = `${list.length}건의 내역을 하나의 전표로 생성하시겠습니까?`;
    }

    let firstExpenseCode: string | null = null;
    let firstOccDate: string | null = null;
    for (const row of list) {
      if (oneJournalYn) {
        if (firstExpenseCode == null) {
          firstExpenseCode = row.expenseCode;
        } else if (firstExpenseCode !== row.expenseCode) {
          message.warning('지출구분이 다른 경우 하나의 전표로 생성할 수 없습니다');
          return;
        }
        if (firstOccDate == null) {
          firstOccDate = row.occDate;
        } else if (firstOccDate !== row.occDate) {
          message.warning('발생일자가 다른 경우 하나의 전표로 생성할 수 없습니다');
          return;
        }
      }
      if (row.accountCode == null || row.accountCode === '') {
        message.warning('계정과목이 누락된 내역이 존재합니다');
        return;
      }
    }

    // [E10] msgBox.DialogHide [YES] (L327) → createJournal() L345-372: pay.Pay50_Expense.createJournal(oneJournalYn, personId, 목록)
    Modal.confirm({
      title: '확인', content: msg, width: msgWidth, okText: '예', cancelText: '아니오',
      onOk: async () => {
        try {
          await payApi.createExpenseJournals(list, oneJournalYn);
          message.info('전표가 생성되었습니다');
          onCreated();
          await crud.retrieve();
        } catch (err) {
          message.info(errorMessage(err, '전표 생성 실패'));
        }
      },
    });
  };

  // buildGrid() L184-213: setChecked(MULTI), 합계 행 "계"(지출내역 열), 계정과목 열은 편집색(0069B4) 조회 트리거
  const columnDefs = useMemo(() => [
    gb.date('occDate', 100, '발생일자'),  // L198
    gb.text('expenseName', 100, '구분'),  // L199
    gb.textArea('desc', 400, '지출내역'),  // L200
    gb.text('corpName', 150, '지출처'),  // L201
    gb.long('amt', 100, '공급가액'),  // L202
    gb.long('tax', 100, '세액'),  // L203
    gb.long('settleAmt', 100, '합계'),  // L204
    // [E9] lookupAccount.TriggerClick (L188) → lookupAccount() L215-232
    gb.text('accountName', 150, '계정과목', {
      cellStyle: { color: '#0069B4' },
      cellRenderer: (p: { data?: PayExpenseNew; value?: string }) => (
        <>
          <SearchOutlined style={{ marginRight: 4, cursor: 'pointer' }} onClick={e => { e.stopPropagation(); if (p.data) setAccountRow(p.data); }} />
          {p.value}
        </>
      ),
    }),  // L205
  ], []);

  return (
    <>
      <LookupModal open={open} title="회계 미처리 내역" width={1350} maskClosable={false} closable={false} onCancel={onClose} destroyOnHidden
        // [E8] cancelButton[닫기].Select (L176) → hide()
        footer={<div style={{ textAlign: 'center' }}><Button type="close" onClick={onClose}>닫기</Button></div>}
      >
        <div style={{ height: 420, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* [E4] retrieveButton[조회].Select (L152) / [E3] searchText.KeyPress [Enter] (L140) → retrieve() */}
          <SearchBar
            onSearch={() => void crud.retrieve()}
            loading={crud.loading}
            extra={(
              <>
                <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
                <Button type="save" onClick={lookupAccountUpdate}>일괄저장</Button>
                <Checkbox style={{ marginLeft: 24 }} checked={oneJournalYn} onChange={e => setOneJournalYn(e.target.checked)}>하나의 전표로 생성하기</Checkbox>
                <Button type="register" onClick={preCreateJournal}>전표생성</Button>
              </>
            )}
          >
            {/* [E2] expenseComboBox[ExpenseType0002].Collapse (L131) → retrieve() */}
            <SearchBar.Field label="구분">
              <SystemCodeComboBox kindGroupCd="ExpenseType0002" altCode={ALL_CODE} style={{ width: 150 }} value={expenseCode}
                onChange={c => { const v = c ?? '%'; setExpenseCode(v); condRef.current.expenseCode = v; void crud.retrieve(); }} />
            </SearchBar.Field>
            <SearchBar.Field label="검색">
              <SearchBar.Input style={{ width: 200 }} placeholder="구분/지출내역/지출처" value={searchText} onChange={e => setSearchText(e.target.value)} />
            </SearchBar.Field>
          </SearchBar>
          <div style={{ flex: 1, minHeight: 0 }}>
            <CellEditGrid<PayExpenseNew>
              crud={crud}
              columnDefs={columnDefs}
              rowData={crud.rows}
              loading={crud.loading}
              getRowId={p => String(p.data.expenseId)}
              sumRow={SUM_ROW}
            />
          </div>
        </div>
      </LookupModal>
      <Pay50_Lookup_UpdateAccount open={updateOpen} rows={updateRows} onSaved={() => void crud.retrieve()} onClose={() => setUpdateOpen(false)} />
      {/* callback.execute(result): 고른 계정과목을 행의 변경으로 기록 (null이면 비움 — 부품은 [선택안함]이 없어 항상 값이 있다) */}
      <Pay52_Lookup_AccountCode open={accountRow != null} isManager
        onResult={row => {
          if (accountRow) crud.updateRow(accountRow.expenseId, { accountCode: row.accountCode, accountName: row.accountName });
          setAccountRow(null);
        }}
        onClose={() => setAccountRow(null)} />
    </>
  );
};
