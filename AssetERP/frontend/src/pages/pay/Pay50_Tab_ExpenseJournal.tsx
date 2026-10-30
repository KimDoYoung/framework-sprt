/**
 * [1387] 자금관리 > 20. 사업비관리 > 사업비 회계처리 (U09)
 * AS-IS: myApp/client/vi/pay/Pay50_Tab_ExpenseJournal.java (403줄) + Pay50_Lookup_ExpenseUnJournal·Pay50_Lookup_UpdateAccount (pages/pay)
 *   + Pay52_Lookup_AccountCode (pages/pay) + Act02_Grid_CreateJournal (pages/act) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L85-134: BorderLayout 가운데(여백 20,20,0,20) = 툴바 두 줄(조회기간 100~100 · 구분 150 · 검색 "구분/지출내역/지출처" · [조회][삭제] /
 *   새로고침 · 회계 미처리 안내 · 링크) + 전표 단위 그리드(체크 다중, 13열, 합계 행 "계"), 아래 250(여백 20, 크기 조절) = 분개 그리드 Act02_Grid_CreateJournal
 * 열 때 한 번 조회한다(구분 콤보 생성 콜백 → retrieve), 조회하면 첫 행을 고르고 그 전표의 분개를 아래에 보여 준다
 * 1단계: 그리드 [연관문서] 아이콘이 여는 Act80_Lookup_RelateAppr(viewAppr)와 [전표수정] 아이콘이 여는 Act02_Lookup_CreateJournal(modiJournal)은
 *   다른 도메인(act)의 큰 창(U10과 공유)이라 다음 단계 — 지금은 안내만 한다
 * 스타일: GG (견본 — docs/page-style.md)
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 원본에 없어 넣지 않는다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, message, Modal, Splitter } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { payApi } from '@/api/pay';
import { errorMessage } from '@/api/client';
import { PayExpenseJournal } from '@/types/pay';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { SearchBar } from '@/components/search';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { Act02_Grid_CreateJournal } from '@/pages/act/Act02_Grid_CreateJournal';
import { Pay50_Lookup_ExpenseUnJournal } from './Pay50_Lookup_ExpenseUnJournal';

const gb = gbFor<PayExpenseJournal>();
const FORMAT = 'YYYY-MM-DD';
/** 콤보 "전체"(CommonComboBoxField(…, "%", "전체")) */
const ALL_CODE: [string, string] = ['%', '전체'];
const SUM_ROW = { labelField: 'occDate', label: '계', sum: ['amt', 'tax', 'settleAmt'] };

const monthStart = () => dayjs().startOf('month');

export const Pay50_Tab_ExpenseJournal: React.FC = () => {
  // [E0] 화면 열림 (생성자 L85-134) → settings() L136-217: 조회기간 = 이번 달 1일 ~ 말일, 구분 "전체", 검색칸 "구분/지출내역/지출처"
  const [startDate, setStartDate] = useState<Dayjs>(monthStart());
  const [closeDate, setCloseDate] = useState<Dayjs>(monthStart().add(1, 'month').subtract(1, 'day'));
  const [expenseCode, setExpenseCode] = useState('%');
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<PayExpenseJournal[]>([]);
  const [loading, setLoading] = useState(false);
  const [newCount, setNewCount] = useState(0);
  const [unJournalOpen, setUnJournalOpen] = useState(false);
  const [journalId, setJournalId] = useState<number | null>(null);
  const [nonce, setNonce] = useState(0);
  const gridRef = useRef<AgGridReact<PayExpenseJournal>>(null);

  /** retrieve()가 읽는 조건 — 콤보를 바꾸자마자 조회해도 새 값으로 간다 */
  const condRef = useRef({ startDate, closeDate, expenseCode, searchText });
  condRef.current = { startDate, closeDate, expenseCode, searchText };

  // setAnchorText() L259-287: pay.Pay50_Expense.selectNewExpenseAppr(companyId, targetType "JOURNAL", "%", "%") → 건수 > 0이면 안내와 링크를 보인다
  const setAnchorText = useCallback(async () => {
    try {
      setNewCount((await payApi.searchNewExpenseJournals({ expenseCode: '%', searchText: '' })).length);
    } catch {
      setNewCount(0);
    }
  }, []);

  // retrieve() L335-357: pay.Pay50_Expense.selectExpenseJournal(companyId, startDate, closeDate, expenseCode, "%검색어%") → 첫 행 선택(없으면 분개 그리드 init()) → setAnchorText()
  const retrieve = useCallback(async () => {
    const c = condRef.current;
    setLoading(true);
    try {
      const list = await payApi.searchExpenseJournals({
        startDate: c.startDate.format(FORMAT), closeDate: c.closeDate.format(FORMAT), expenseCode: c.expenseCode, searchText: c.searchText,
      });
      setRows(list);
      if (list[0]) {
        setTimeout(() => gridRef.current?.api?.getRowNode(String(list[0].expenseId))?.setSelected(true), 0);
      } else {
        setJournalId(null);
      }
      void setAnchorText();
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [setAnchorText]);

  // [E3] expenseComboBox.callbackOnCreate (L169) → retrieve() — 열 때 한 번
  useEffect(() => { void retrieve(); }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // [E8] grid.SelectionChanged [선택>0] (L209) → retrieveJournal() L359-364: 고른(마지막) 행의 journalId로 분개 그리드를 읽는다
  const retrieveJournal = (row: PayExpenseJournal) => { setJournalId(row.journalId); setNonce(n => n + 1); };

  // [E7] deleteButton[삭제].Select (L202) → delete() L366-398: "n건의 회계처리 내역을 삭제하시겠습니까?"(350) → [E9] YES → pay.Pay50_Expense.deleteJournal → 성공이면 retrieve(), 아니면 서버 메시지
  const deleteJournals = () => {
    const list = gridRef.current?.api.getSelectedRows() ?? [];
    Modal.confirm({
      title: '확인', content: `${list.length}건의 회계처리 내역을 삭제하시겠습니까?`, width: 350, okText: '예', cancelText: '아니오',
      onOk: async () => {
        try {
          await payApi.deleteExpenseJournals(list.map(r => r.journalId));
          await retrieve();
        } catch (err) {
          message.info(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  // buildGrid() L219-257: setChecked(MULTI), 합계 행 "계"(발생일자 열)
  const columnDefs = useMemo(() => [
    gb.date('occDate', 90, '발생일자'),  // L237
    gb.text('expenseName', 120, '구분'),  // L238
    gb.text('desc', 350, '지출내역'),  // L239
    gb.text('corpName', 150, '지출처'),  // L240
    gb.long('amt', 120, '공급가액'),  // L241
    gb.long('tax', 100, '세액'),  // L242
    gb.long('settleAmt', 120, '합계'),  // L243
    gb.textCenter('payMethodName', 100, '지급구분'),  // L244
    gb.textCenter('fileCountStr', 60, '연관문서'),  // L245
    // viewAppr() L299-312: Act80_Lookup_RelateAppr.open(지출내역, "journalId", journalId) — 다음 단계
    iconCell<PayExpenseJournal>('view', 'viewAction', 40, '', () => message.info('연관문서 창(Act80_Lookup_RelateAppr)은 다음 단계에서 연결합니다.')),  // L246
    gb.textCenter('journalNo', 100, '전표번호'),  // L247
    // modiJournal() L314-333: act.Act02_Journal.selectById(journalId) → Act02_Lookup_CreateJournal.open(전표, "MODI", 닫으면 retrieve()) — 다음 단계
    iconCell<PayExpenseJournal>('edit', 'editAction', 60, '전표수정', () => message.info('전표 수정 창(Act02_Lookup_CreateJournal)은 다음 단계에서 연결합니다.')),  // L248
    gb.booleanYn2('journalFixYn', 70, '전표승인'),  // L249
  ], []);

  return (
    <div style={{ height: '100%', background: '#fff' }}>
      <Splitter layout="vertical" style={{ height: '100%' }}>
        <Splitter.Panel defaultSize="50%" min={120}>
          <div style={{ height: '100%', padding: '20px 20px 0 20px', boxSizing: 'border-box' }}>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {/* [E6] retrieveButton[조회].Select (L196) / [E5] searchText.KeyPress [Enter] (L187) → retrieve() */}
              <SearchBar onSearch={retrieve} loading={loading} extra={<Button type="delete" onClick={deleteJournals}>삭제</Button>}>
                <SearchBar.Field label="조회기간">
                  <DatePicker style={{ width: 130 }} allowClear={false} value={startDate} format={FORMAT} onChange={d => d && setStartDate(d)} />
                  <span style={{ margin: '0 4px' }}>~</span>
                  <DatePicker style={{ width: 130 }} allowClear={false} value={closeDate} format={FORMAT} onChange={d => d && setCloseDate(d)} />
                </SearchBar.Field>
                {/* [E4] expenseComboBox[ExpenseType0002].Collapse (L178) → retrieve() */}
                <SearchBar.Field label="구분">
                  <SystemCodeComboBox kindGroupCd="ExpenseType0002" altCode={ALL_CODE} style={{ width: 150 }} value={expenseCode}
                    onChange={c => { const v = c ?? '%'; setExpenseCode(v); condRef.current.expenseCode = v; void retrieve(); }} />
                </SearchBar.Field>
                <SearchBar.Field label="검색">
                  <SearchBar.Input style={{ width: 200 }} placeholder="구분/지출내역/지출처" value={searchText} onChange={e => setSearchText(e.target.value)} />
                </SearchBar.Field>
              </SearchBar>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {/* [E1] refresh.MouseDown (L151) → setAnchorText() */}
                <ReloadOutlined style={{ cursor: 'pointer' }} onClick={() => void setAnchorText()} />
                <b style={{ fontSize: 13 }}>
                  {newCount > 0
                    ? <>회계 미처리 내역이 <span style={{ color: 'red' }}>{newCount}건</span> 존재합니다.</>
                    : '미처리 내역이 없습니다.'}
                </b>
                {/* [E2] hiperLink[회계처리대상 확인 및 전표생성하기].MouseDown (L158) → lookupUnJournal() L289-297 */}
                {newCount > 0 && (
                  <b style={{ fontSize: 13, color: '#0078D7', textDecoration: 'underline', cursor: 'pointer' }} onClick={() => setUnJournalOpen(true)}>회계처리대상 확인 및 전표생성하기</b>
                )}
              </div>
              <div style={{ flex: 1, minHeight: 0 }}>
                <MultiGrid<PayExpenseJournal>
                  gridRef={gridRef}
                  rowData={rows}
                  columnDefs={columnDefs}
                  getRowId={p => String(p.data.expenseId)}
                  sumRow={SUM_ROW}
                  onRowSelected={e => { if (e.node.isSelected() && e.data) retrieveJournal(e.data); }}
                />
              </div>
            </div>
          </div>
        </Splitter.Panel>
        <Splitter.Panel defaultSize="50%" min={200}>
          <div style={{ height: '100%', padding: 20, boxSizing: 'border-box' }}>
            <Act02_Grid_CreateJournal journalId={journalId} nonce={nonce} />
          </div>
        </Splitter.Panel>
      </Splitter>
      {/* callback.execute(): 전표를 만든 뒤 retrieve() */}
      <Pay50_Lookup_ExpenseUnJournal open={unJournalOpen} onCreated={() => void retrieve()} onClose={() => setUnJournalOpen(false)} />
    </div>
  );
};
