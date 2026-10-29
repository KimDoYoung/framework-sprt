/**
 * 요청내역 창 (U03) — Pay50_Tab_ExpenseManager의 "지출요청내역 가져오기"가 연다
 * AS-IS: myApp/client/vi/pay/Pay50_Lookup_ExpenseRequestList.java (176줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L47-55: 모달 1300×450 "요청내역"(크기 조절·최대화, X 없음). open(callback) L57-79: 툴바(검색 [조회]) + 체크박스 다중 그리드, [선택][닫기], 열자마자 조회
 * UX보강(10): 검색 줄 = SearchBar(UX-01·04), 조회창(UX-05·06)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Space } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { payApi } from '@/api/pay';
import { errorMessage } from '@/api/client';
import { PayExpenseRequest } from '@/types/pay';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';
import { MultiGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';

const gb = gbFor<PayExpenseRequest>();

/** buildGrid() L121-140: setChecked(MULTI) */
const buildGrid = () => [
  gb.date('occDate', 100, '발생일자'),
  gb.date('dueDate', 100, '지급요청일'),
  gb.text('expenseName', 100, '구분'),
  gb.textArea('desc', 300, '지출내역'),
  gb.text('corpName', 150, '지출처'),
  gb.long('settleAmt', 120, '지출금액'),
  gb.date('regDate', 100, '요청일'),
  gb.text('regEmpOrgName', 200, '요청자'),
];

interface Props {
  open: boolean;
  /** callback.execute(selectList): [선택]·더블클릭이면 체크한 요청내역들 */
  onResult: (rows: PayExpenseRequest[]) => void;
  onClose: () => void;
}

export const Pay50_Lookup_ExpenseRequestList: React.FC<Props> = ({ open, onResult, onClose }) => {
  const gridRef = useRef<AgGridReact<PayExpenseRequest>>(null);
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<PayExpenseRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const columnDefs = useMemo(buildGrid, []);

  // retrieve() L142-155: pay.Pay50_Expense.selectExpenseRequest(companyId, searchText "%검색어%")
  const retrieve = useCallback(async (text: string) => {
    setLoading(true);
    try {
      setRows(await payApi.searchExpenseRequests(text));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, []);

  // [E0] 화면 열림 (생성자 L47-55, open L57-79) → settings(), show(), retrieve()
  useEffect(() => {
    if (!open) return;
    setSearchText('');
    setRows([]);
    void retrieve('');
  }, [open, retrieve]);

  // [E3] selectButton[선택].Select (L100) / [E5] grid.CellDoubleClick (L113) → confirm() L157-168: 선택이 없으면 "선택된 내역이 없습니다"
  const confirm = () => {
    const picked = gridRef.current?.api.getSelectedRows() ?? [];
    if (picked.length === 0) {
      message.warning('선택된 내역이 없습니다');
      return;
    }
    onResult(picked);
  };

  return (
    <LookupModal open={open} title="요청내역" width={1300} maskClosable={false} closable={false} onCancel={onClose} destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="select" onClick={confirm}>선택</Button>
            {/* [E4] cancelButton[닫기].Select (L106) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 300, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E2] retrieveButton[조회].Select (L94) / [E1] searchText.KeyPress [Enter] (L85) → retrieve() */}
        <SearchBar onSearch={() => retrieve(searchText)} loading={loading}>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 250 }} placeholder="요청자/구분/지출내역/지출처" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <MultiGrid<PayExpenseRequest>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => `${p.data.expenseCode}-${p.data.floralId ?? p.data.expenseId}`}
            loading={loading}
            rowClick
            onRowDoubleClicked={confirm}
          />
        </div>
      </div>
    </LookupModal>
  );
};
