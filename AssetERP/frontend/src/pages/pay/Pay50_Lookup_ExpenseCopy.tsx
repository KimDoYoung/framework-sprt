/**
 * 지출결의서 불러오기 창 (Y08) — Pay50_Lookup_ExpenseRequestInsert의 [불러오기](바로등록 모드)가 연다
 * AS-IS: myApp/client/vi/pay/Pay50_Lookup_ExpenseCopy.java (203줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L57-65: 모달 1200×550 "지출결의서 불러오기"(크기 조절·최대화, X 없음). open(isManager, callback) L67-99: 툴바(구분 [시작일] ~ [종료일] · 검색 · [조회] · "* 최대 50건까지 조회됩니다")
 *   + 단일 선택 그리드(발생일자 100 · 구분 100 · 지출내역 500 · 지출처 150 · 지출금액 100 · 계정과목 150), [확인][닫기], 열자마자 조회
 * UX보강(10): 검색 줄 = SearchBar(UX-01·04), 조회창(UX-05·06)
 * 스타일: MG (임시 스크립트 판별 — docs/page-style.md 모달 스타일)
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { DatePicker, message, Space } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { payApi } from '@/api/pay';
import { errorMessage } from '@/api/client';
import { PayExpense } from '@/types/pay';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';

const gb = gbFor<PayExpense>();
const FORMAT = 'YYYY-MM-DD';
/** limit = 50 (L55) */
const LIMIT = 50;
const SINGLE_SELECTION = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;

interface Props {
  open: boolean;
  /** open(isManager, …) — 관리자는 결의자가 아닌 건도 본다(managerYn) */
  isManager: boolean;
  /** callback.execute(selectModel): [확인]·더블클릭이면 고른 지출결의서 */
  onResult: (row: PayExpense) => void;
  onClose: () => void;
}

export const Pay50_Lookup_ExpenseCopy: React.FC<Props> = ({ open, isManager, onResult, onClose }) => {
  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs().subtract(1, 'month'));
  const [closeDate, setCloseDate] = useState<Dayjs>(() => dayjs());
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<PayExpense[]>([]);
  const [selected, setSelected] = useState<PayExpense | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  // buildGrid() L149-161: setChecked(SINGLE)
  const columnDefs = useMemo(() => [
    gb.date('occDate', 100, '발생일자'),  // L153
    gb.text('expenseName', 100, '구분'),  // L154
    gb.textArea('desc', 500, '지출내역'),  // L155
    gb.text('corpName', 150, '지출처'),  // L156
    gb.long('settleAmt', 100, '지출금액'),  // L157
    gb.text('accountName', 150, '계정과목'),  // L158
  ], []);

  // retrieve() L163-182: pay.Pay50_Expense.selectExpenseAppr(expenseCode "%", searchText "%검색어%", managerYn, limit 50)
  const retrieve = useCallback(async (start: Dayjs, close: Dayjs, text: string) => {
    setLoading(true);
    try {
      setRows(await payApi.searchExpenses({
        startDate: start.format(FORMAT), closeDate: close.format(FORMAT), statusCheckYn: false,
        expenseCode: '%', payMethodCode: '%', searchText: text, managerYn: isManager, limit: LIMIT,
      }));
      setSelected(undefined);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [isManager]);

  // [E0] 화면 열림 (생성자 L57-65, open L67-99) → settings() L101-147: 기간 = 한 달 전 ~ 오늘, retrieve()
  useEffect(() => {
    if (!open) return;
    const start = dayjs().subtract(1, 'month');
    const close = dayjs();
    setStartDate(start); setCloseDate(close); setSearchText(''); setRows([]); setSelected(undefined);
    void retrieve(start, close, '');
  }, [open, retrieve]);

  // [E4] selectButton[확인].Select (L135) / [E2] grid.RowDoubleClick (L122) → confirm() L184-195: 고른 행이 없으면 "선택한 내역이 없습니다"
  const confirm = (row: PayExpense | undefined = selected) => {
    if (!row) { message.warning('선택한 내역이 없습니다'); return; }
    onResult(row);
  };

  return (
    <LookupModal open={open} title="지출결의서 불러오기" width={1200} maskClosable={false} closable={false} onCancel={onClose} destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="select" onClick={() => confirm()}>확인</Button>
            {/* [E5] cancelButton[닫기].Select (L141) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 380, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E3] retrieveButton[조회].Select (L129) / [E1] searchText.KeyPress [Enter] (L113) → retrieve() */}
        <SearchBar
          onSearch={() => retrieve(startDate, closeDate, searchText)}
          loading={loading}
          extra={<span style={{ fontSize: 12, color: '#456EA6', fontWeight: 'bold' }}>* 최대 {LIMIT}건까지 조회됩니다</span>}
        >
          <SearchBar.Field label="구분">
            <DatePicker style={{ width: 130 }} allowClear={false} value={startDate} format={FORMAT} onChange={d => d && setStartDate(d)} />
            <span style={{ margin: '0 4px' }}>~</span>
            <DatePicker style={{ width: 130 }} allowClear={false} value={closeDate} format={FORMAT} onChange={d => d && setCloseDate(d)} />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 200 }} placeholder="구분/지출내역/지출처" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<PayExpense>
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.expenseId)}
            loading={loading}
            rowSelection={SINGLE_SELECTION}
            onSelect={setSelected}
            onRowDoubleClicked={e => confirm(e.data)}
          />
        </div>
      </div>
    </LookupModal>
  );
};
