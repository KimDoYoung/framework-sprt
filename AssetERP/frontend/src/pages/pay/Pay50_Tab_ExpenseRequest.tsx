/**
 * [1383] 신청 > 80. 사업비 신청 > 사업비 지출요청 (Y08)
 * AS-IS: myApp/client/vi/pay/Pay50_Tab_ExpenseRequest.java (436줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L64-92: 가운데(여백 20) = 툴바(조회기간 · [조회] · [등록][삭제][요청하기][요청취소]) + 지출요청 그리드(MultiGrid, 합계 행)
 * 함께: Pay50_Lookup_ExpenseRequestInsert(등록·수정·보기, 1303줄) · Pay50_Lookup_ExpenseCopy(불러오기, 바로등록 모드) · Pay50_Lookup_ConfirmReason(승인상태 칸, 반려사유 보기) · Pay50_Lookup_RejectReason(지출결의 칸, 반려사유 보기)
 *   Com01_Lookup_RelateAppr(증빙자료 아이콘)는 EE34에서 연결했다
 * 스타일: SG (견본 — docs/page-style.md)
 * UX보강(10): 툴바 = SearchBar(UX-01·04)
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, message, Modal } from 'antd';
import dayjs from 'dayjs';
import { payApi } from '@/api/pay';
import { errorMessage } from '@/api/client';
import { PayExpenseMine } from '@/types/pay';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { SearchBar } from '@/components/search';
import { Com01_Lookup_RelateAppr } from '../com/Com01_Lookup_RelateAppr';
import { Pay50_Lookup_ConfirmReason } from './Pay50_Lookup_ConfirmReason';
import { Pay50_Lookup_RejectReason } from './Pay50_Lookup_RejectReason';
import { ExpenseRequestMode, Pay50_Lookup_ExpenseRequestInsert } from './Pay50_Lookup_ExpenseRequestInsert';

const gb = gbFor<PayExpenseMine>();
const FORMAT = 'YYYY-MM-DD';
/** 승인상태 코드 (10 요청 · 20 승인 · 30 반려, 없으면 아직 요청하지 않음) */
const REQUESTED = '10';
const APPROVED = '20';
const REJECTED = '30';

/** 등록·수정·보기 창 열기 */
type InsertTarget = { mode: ExpenseRequestMode; expenseId?: number };

export const Pay50_Tab_ExpenseRequest: React.FC = () => {
  // [E0] 화면 열림 (생성자 L64-92) → settings() L94-155: 조회기간 = 올해 1월 1일 ~ 오늘, retrieve()
  const [startDate, setStartDate] = useState(dayjs().startOf('year'));
  const [closeDate, setCloseDate] = useState(dayjs());
  const [rows, setRows] = useState<PayExpenseMine[]>([]);
  const [loading, setLoading] = useState(false);
  /** 체크한 행 (grid.getSelectionModel().getSelectedItems()) */
  const [checked, setChecked] = useState<PayExpenseMine[]>([]);
  const [insertTarget, setInsertTarget] = useState<InsertTarget | null>(null);
  /** 승인상태·지출결의 칸을 눌러 여는 반려사유 보기 */
  const [confirmReason, setConfirmReason] = useState<string | null | undefined>(undefined);
  const [rejectReason, setRejectReason] = useState<string | null | undefined>(undefined);
  /** [증빙자료] 아이콘이 여는 Com01_Lookup_RelateAppr — 승인상태가 없으면 open, 있으면 view */
  const [relateTarget, setRelateTarget] = useState<{ id: number; view: boolean } | null>(null);
  const retrieveSeq = useRef(0);

  // retrieve() L237-251: pay.Pay50_Expense.selectByDate (companyId·personId는 서버)
  const retrieve = async () => {
    const my = ++retrieveSeq.current;
    setLoading(true);  // grid.mask("Loading")
    try {
      const list = await payApi.searchExpenseMine({ startDate: startDate.format(FORMAT), closeDate: closeDate.format(FORMAT) });
      if (my !== retrieveSeq.current) return;
      setRows(list);
      setChecked([]);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      if (my === retrieveSeq.current) setLoading(false);
    }
  };

  useEffect(() => { void retrieve(); }, []);   // eslint-disable-line react-hooks/exhaustive-deps

  /** 신청·승인·반려 처리된 건이 있으면 그 메시지 (deleteRow L260-275 · requestChk L317-333) */
  const processedMessage = (list: PayExpenseMine[], withRequested: boolean): string | null => {
    if (withRequested && list.some(r => r.confirmStatusCode === REQUESTED)) return '이미 신청처리된 건이 있습니다.';
    if (list.some(r => r.confirmStatusCode === APPROVED)) return '이미 승인처리된 건이 있습니다.';
    if (list.some(r => r.confirmStatusCode === REJECTED)) return '이미 반려처리된 건이 있습니다.';
    return null;
  };

  // [E3] deleteButton[삭제].Select (L120) → deleteRow() L253-307
  const deleteRow = () => {
    if (checked.length < 1) { message.warning('삭제할 내용을 선택해주세요'); return; }
    const processed = processedMessage(checked, true);
    if (processed) { message.warning(processed); return; }
    const list = checked;
    // [E11] messageBox.DialogHide [YES] (L279) → pay.Pay50_Expense.deleteRequest → 성공이면 retrieve(), 아니면 서버 메시지
    Modal.confirm({
      title: '삭제', content: `${list.length}건의 정보를 삭제하시겠습니까?`, okText: '예', cancelText: '아니오',
      onOk: async () => {
        try {
          await payApi.deleteExpenseMine(list.map(r => r.expenseId));
          await retrieve();
        } catch (err) {
          message.info(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  // [E4] requestButton[요청하기].Select (L126) / [E5] cancelButton[요청취소].Select (L132) → requestChk(true|false) L309-398
  const requestChk = (request: boolean) => {
    if (checked.length < 1) { message.warning('요청할 내용을 선택해주세요'); return; }
    if (request) {
      const processed = processedMessage(checked, true);
      if (processed) { message.warning(processed); return; }
    } else {
      // 취소건: 승인·반려된 건과 아직 요청하지 않은 건은 취소할 수 없다
      const processed = processedMessage(checked, false);
      if (processed) { message.warning(processed); return; }
      if (checked.some(r => r.confirmStatusCode == null)) { message.warning('아직 요청하지 않은 건이 있습니다.'); return; }
    }
    const list = checked;
    const msg = request ? `${list.length}건의 내역을 지출요청하시겠습니까?` : `${list.length}건의 내역을 요청취소하시겠습니까?`;
    // [E12] msgBox.DialogHide [YES] (L362) → pay.Pay50_Expense.updateConfirmStatusCode(confirmStatusCode 10 | null) → 성공이면 retrieve(), 아니면 서버 메시지
    Modal.confirm({
      title: '확인', content: msg, width: 380, okText: '예', cancelText: '아니오',
      onOk: async () => {
        try {
          await payApi.updateExpenseMineStatus(list.map(r => r.expenseId), request);
          await retrieve();
        } catch (err) {
          message.info(errorMessage(err, '처리 실패'));
        }
      },
    });
  };

  // buildGrid() L157-235: setChecked(MULTI), 합계 행(setSumGridHeader("합계", 5), setSumGrid(7)) — 인덱스 5 = 지출내역, 7 = 금액
  const columnDefs = useMemo(() => [
    // L159-182 editCell(ImageCell "Edit") → [E7]·[E8] 승인상태가 없으면 Pay50_Lookup_ExpenseRequestInsert.edit(…) , 있으면 view(…) → 닫으면 retrieve()
    iconCell<PayExpenseMine>('edit', 'editCell', 50, '수정', row => setInsertTarget({ mode: row.confirmStatusCode == null ? 'edit' : 'view', expenseId: row.expenseId })),
    gb.date('regDate', 90, '등록일자'),  // L213
    gb.date('occDate', 90, '발생일자'),  // L214
    gb.text('desc', 250, '지출내역'),  // L215
    gb.text('corpName', 150, '지출처'),  // L216
    gb.long('settleAmt', 100, '금액'),  // L220
    gb.date('dueDate', 90, '지급요청일'),  // L221
    gb.textCenter('payMethodName', 80, '지급방법'),  // L222
    gb.text('payAccountInfo', 220, '지급요청계좌'),  // L223
    gb.textCenter('fileCountStr', 60, '증빙자료'),  // L224
    // L185-208 viewCell(ImageCell "View") → [E9]·[E10] Com01_Lookup_RelateAppr.open("pay50", expenseId, callback → lookupEnd) | 승인상태가 있으면 view
    iconCell<PayExpenseMine>('view', 'relateCell', 40, '', row => setRelateTarget({ id: row.expenseId, view: row.confirmStatusCode != null })),
    gb.textCenter('confirmerName', 70, '승인자'),  // L226
    gb.textCenter('confirmStatusName', 70, '승인상태'),  // L227
    gb.textCenter('expenseStatusName', 70, '지출결의'),  // L228
    gb.textCenter('settleApprStatusName', 70, '자금집행'),  // L229
  ], []);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', padding: 10, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E1] retrieveButton[조회].Select (L102) → retrieve() */}
        <SearchBar
          onSearch={() => void retrieve()}
          loading={loading}
          extra={(
            <>
              {/* [E2] insertButton[등록].Select (L108) → Pay50_Lookup_ExpenseRequestInsert.insert(callback retrieve) */}
              <Button type="register" onClick={() => setInsertTarget({ mode: 'insert' })}>등록</Button>
              <Button type="delete" onClick={deleteRow}>삭제</Button>
              <Button type="register" onClick={() => requestChk(true)}>요청하기</Button>
              <Button type="cancel" onClick={() => requestChk(false)}>요청취소</Button>
            </>
          )}
        >
          <SearchBar.Field label="조회기간">
            <DatePicker style={{ width: 130 }} allowClear={false} value={startDate} format={FORMAT} onChange={d => d && setStartDate(d)} />
            <span style={{ margin: '0 4px' }}>~</span>
            <DatePicker style={{ width: 130 }} allowClear={false} value={closeDate} format={FORMAT} onChange={d => d && setCloseDate(d)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <MultiGrid<PayExpenseMine>
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.expenseId)}
            loading={loading}
            onCheckedChange={setChecked}
            sumRow={{ labelField: 'desc', label: '합계', sum: ['settleAmt'] }}
            // [E6] grid.CellClick (L139) → 승인상태 칸(인덱스 14)이고 반려(30)이면 lookupOpenConfirmReason() L413-421, 지출결의 칸(15)이고 반려사유가 있으면 lookupOpenRejectReason() L423-431 — 보기 전용
            onCellClicked={e => {
              if (e.colDef.field === 'confirmStatusName' && e.data?.confirmStatusCode === REJECTED) {
                setConfirmReason(e.data.confirmReason);
              } else if (e.colDef.field === 'expenseStatusName' && e.data?.rejectReason != null) {
                setRejectReason(e.data.rejectReason);
              }
            }}
          />
        </div>
      </div>
      <Pay50_Lookup_ExpenseRequestInsert
        open={insertTarget != null}
        mode={insertTarget?.mode ?? 'insert'}
        expenseId={insertTarget?.expenseId}
        onSaved={() => void retrieve()}
        onClose={() => setInsertTarget(null)}
      />
      <Com01_Lookup_RelateAppr open={relateTarget != null} mode={relateTarget?.view ? 'view' : 'open'} keyTable="pay50" keyTableId={relateTarget?.id ?? null}
        onChanged={() => { if (!relateTarget?.view) void retrieve(); }} onClose={() => setRelateTarget(null)} />
      <Pay50_Lookup_ConfirmReason open={confirmReason !== undefined} mode="view" value={confirmReason} onClose={() => setConfirmReason(undefined)} />
      <Pay50_Lookup_RejectReason open={rejectReason !== undefined} mode="view" value={rejectReason} onClose={() => setRejectReason(undefined)} />
    </div>
  );
};
