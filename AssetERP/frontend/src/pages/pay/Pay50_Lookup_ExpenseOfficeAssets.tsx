/**
 * 지출결의서 선택 (W16) — Ast13_Lookup_ExpenseOfficeAssets의 [지출결의서 선택]
 * AS-IS: myApp/client/vi/pay/Pay50_Lookup_ExpenseOfficeAssets.java (181줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L52-58: 모달 750×500 "지출결의서 선택", 툴바(발생일자 100 ~ 100 · 검색 200 "지출내역/지출처" · 조회) + 체크박스 단일 그리드 4열, [선택][닫기]. open L60-89: 열자마자 retrieve()
 * UX보강(10): 검색 줄 = SearchBar(UX-01·04), 조회창(UX-05·06). 폭: 열 합계 670 + 60 + 130 = 860 (03 원칙 21, AS-IS 750보다 크게)
 * 스타일: MG (임시 스크립트 판별 — docs/page-style.md 모달 스타일)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, message, Space } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { payApi } from '@/api/pay';
import { errorMessage } from '@/api/client';
import { PayExpenseOffice } from '@/types/pay';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';

const gb = gbFor<PayExpenseOffice>();
const FORMAT = 'YYYY-MM-DD';

/** rowSelection은 상수로 넘긴다(렌더마다 새 객체면 선택이 풀린다 — 11 §1 함정) */
const SINGLE_CHECK = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;

/** buildGrid() L140-152: setChecked(SINGLE) */
const buildGrid = () => [
  gb.date('occDate', 100, '발생일자'),       // L146
  gb.textArea('desc', 300, '지출내역'),       // L147
  gb.text('corpName', 150, '지출처'),         // L148
  gb.long('settleAmt', 120, '지출금액'),      // L149
];

interface Props {
  open: boolean;
  /** callback.execute(model): [선택]·더블클릭이면 고른 지출결의서 (닫기는 결과 없이 닫는다) */
  onResult: (row: PayExpenseOffice) => void;
  onClose: () => void;
}

export const Pay50_Lookup_ExpenseOfficeAssets: React.FC<Props> = ({ open, onResult, onClose }) => {
  const gridRef = useRef<AgGridReact<PayExpenseOffice>>(null);
  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs());
  const [closeDate, setCloseDate] = useState<Dayjs>(() => dayjs());
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<PayExpenseOffice[]>([]);
  const columnDefs = useMemo(buildGrid, []);

  // retrieve() L154-161: pay.Pay50_Expense.selectOfficeAssets(companyId, startDate, closeDate, searchText = "%검색어%")
  const retrieve = useCallback(async (s: Dayjs = startDate, c: Dayjs = closeDate, text: string = searchText) => {
    try {
      setRows(await payApi.searchExpenseOffices(s.format(FORMAT), c.format(FORMAT), text));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [startDate, closeDate, searchText]);

  // [E0] 화면 열림 (생성자 L52-58, open L60-89, setting L91-111): 시작일 = 석 달 전 달의 1일, 종료일 = 오늘 → 곧바로 retrieve()
  useEffect(() => {
    if (!open) return;
    const s = dayjs().subtract(3, 'month').startOf('month');
    const c = dayjs();
    setStartDate(s);
    setCloseDate(c);
    setSearchText('');
    setRows([]);
    void retrieve(s, c, '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // [E2] grid.RowDoubleClick (L113) / [E4] selectButton[선택].Select (L126) → selectExpense() L163-173: 고른 것이 없으면 "내역을 선택하세요" → callback(고른 행) → hide()
  const selectExpense = (picked?: PayExpenseOffice) => {
    const row = picked ?? gridRef.current?.api.getSelectedRows()[0];
    if (!row) {
      message.warning('내역을 선택하세요');
      return;
    }
    onResult(row);
    onClose();
  };

  return (
    <LookupModal open={open} title="지출결의서 선택" width={860} maskClosable={false} onCancel={onClose} destroyOnHidden
      styles={{
        header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 0 },
        footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 0 },
      }}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="select" onClick={() => selectExpense()}>선택</Button>
            {/* [E5] closeButton[닫기].Select (L132) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 380, display: 'flex', flexDirection: 'column', gap: 8, padding: '12px 2px', boxSizing: 'border-box' }}>
        {/* [E3] retrieveButton[조회].Select (L120) → retrieve(), [E1] searchText.KeyPress [Enter] (L104) → retrieve() */}
        <SearchBar onSearch={() => retrieve()}>
          <SearchBar.Field label="발생일자">
            <Space size={4}>
              <DatePicker style={{ width: 120 }} allowClear={false} value={startDate} format={FORMAT} onChange={d => d && setStartDate(d)} />
              <span>~</span>
              <DatePicker style={{ width: 120 }} allowClear={false} value={closeDate} format={FORMAT} onChange={d => d && setCloseDate(d)} />
            </Space>
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            <SearchBar.Input autoFocus style={{ width: 200 }} placeholder="지출내역/지출처" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<PayExpenseOffice>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.expenseId)}
            rowSelection={SINGLE_CHECK}
            onRowDoubleClicked={e => { if (e.data) selectExpense(e.data); }}
          />
        </div>
      </div>
    </LookupModal>
  );
};
