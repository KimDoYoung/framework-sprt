/**
 * 신규 자금집행 예정내역 창 (U07) — Pay50_Tab_ExpensePayWrite의 "자금집행 예정내역 가져오기"가 연다
 * AS-IS: myApp/client/vi/pay/Pay50_Lookup_NewExpenseApprList.java (195줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L51-59: 모달 1350×450 "신규 자금집행 예정내역"(크기 조절·최대화, X 없음). open(callback) L61-86: 툴바(구분 150 · 검색 200 [조회]) + 체크박스 다중 그리드, [선택][닫기], 열자마자 조회
 * UX보강(10): 검색 줄 = SearchBar(UX-01·04), 조회창(UX-05·06)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Space } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { payApi } from '@/api/pay';
import { errorMessage } from '@/api/client';
import { PayExpenseNew } from '@/types/pay';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';
import { MultiGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';

const gb = gbFor<PayExpenseNew>();
/** 콤보 "전체"(ComboBoxField("ExpenseType", "%", "전체")) */
const ALL_CODE: [string, string] = ['%', '전체'];

/** buildGrid() L138-157: setChecked(MULTI) */
const buildGrid = () => [
  gb.date('dueDate', 100, '지급요청일'),  // L144
  gb.date('occDate', 100, '발생일'),
  gb.text('expenseName', 100, '구분'),
  gb.textArea('desc', 400, '지출내역'),
  gb.text('corpName', 150, '지출처'),
  gb.long('settleAmt', 120, '지출금액'),
  gb.textCenter('payMethodName', 100, '지급방법'),
  gb.text('payAccountInfo', 200, '지급요청계좌'),
];

interface Props {
  open: boolean;
  /** callback.execute(selectList): [선택]·더블클릭이면 체크한 예정내역들 */
  onResult: (rows: PayExpenseNew[]) => void;
  onClose: () => void;
}

export const Pay50_Lookup_NewExpenseApprList: React.FC<Props> = ({ open, onResult, onClose }) => {
  const gridRef = useRef<AgGridReact<PayExpenseNew>>(null);
  const [expenseCode, setExpenseCode] = useState('%');
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<PayExpenseNew[]>([]);
  const [loading, setLoading] = useState(false);
  const columnDefs = useMemo(buildGrid, []);

  // retrieve() L159-174: pay.Pay50_Expense.selectNewExpenseAppr(companyId, targetType "SETTLE", expenseCode, searchText "%검색어%")
  const retrieve = useCallback(async (code: string, text: string) => {
    setLoading(true);  // grid.mask("Loading")
    try {
      setRows(await payApi.searchNewExpenseSettles({ expenseCode: code, searchText: text }));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, []);

  // [E0] 화면 열림 (생성자 L51-59, open L61-86) → settings(), show(), retrieve()
  useEffect(() => {
    if (!open) return;
    setExpenseCode('%');
    setSearchText('');
    setRows([]);
    void retrieve('%', '');
  }, [open, retrieve]);

  // [E4] selectButton[선택].Select (L117) / [E6] grid.CellDoubleClick (L130) → confirm() L176-187: 선택이 없으면 "선택된 내역이 없습니다"
  const confirm = () => {
    const picked = gridRef.current?.api.getSelectedRows() ?? [];
    if (picked.length === 0) {
      message.warning('선택된 내역이 없습니다');
      return;
    }
    onResult(picked);
  };

  return (
    <LookupModal open={open} title="신규 자금집행 예정내역" width={1350} maskClosable={false} closable={false} onCancel={onClose} destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="select" onClick={confirm}>선택</Button>
            {/* [E5] cancelButton[닫기].Select (L123) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 300, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E3] retrieveButton[조회].Select (L111) / [E2] searchText.KeyPress [Enter] (L102) → retrieve() */}
        <SearchBar onSearch={() => retrieve(expenseCode, searchText)} loading={loading}>
          <SearchBar.Field label="구분">
            {/* [E1] expenseComboBox[ExpenseType].Collapse (L93) → retrieve() */}
            <SystemCodeComboBox kindCd="ExpenseType" altCode={ALL_CODE} style={{ width: 150 }} value={expenseCode}
              onChange={c => { const v = c ?? '%'; setExpenseCode(v); void retrieve(v, searchText); }} />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 200 }} placeholder="구분/지출내역/지출처" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <MultiGrid<PayExpenseNew>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => `${p.data.expenseCode}-${p.data.expenseId}`}
            loading={loading}
            rowClick
            onRowDoubleClicked={confirm}
          />
        </div>
      </div>
    </LookupModal>
  );
};
