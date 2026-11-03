/**
 * [1384] 신청 > 80. 사업비 신청 > 사업비 지출승인(부서장) (Y09)
 * AS-IS: myApp/client/vi/pay/Pay50_Tab_ExpenseConfirm.java (410줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L65-94: 가운데(여백 20, 테두리) = 툴바(조회기간 · 미승인내역만 조회 · [조회] · [승인][반려][취소][반려건 일괄 알림발송]) + 지출요청 그리드(MultiGrid, 합계 행)
 * 함께: Pay50_Lookup_Content(내역상세 보기, U03), Pay50_Lookup_ConfirmReason(반려사유, Pay50_Lookup_RejectReason 껍질)
 *   Com01_Lookup_RelateAppr(증빙자료 아이콘, 보기만)는 EE34에서 연결했다
 * 스타일: SG (견본 — docs/page-style.md)
 * UX보강(10): 툴바 = SearchBar(UX-01·04)
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, DatePicker, message, Modal } from 'antd';
import dayjs from 'dayjs';
import { payApi } from '@/api/pay';
import { errorMessage } from '@/api/client';
import { PayExpenseConfirm } from '@/types/pay';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { SearchBar } from '@/components/search';
import { Com01_Lookup_RelateAppr } from '../com/Com01_Lookup_RelateAppr';
import { Pay50_Lookup_Content } from './Pay50_Lookup_Content';
import { Pay50_Lookup_ConfirmReason } from './Pay50_Lookup_ConfirmReason';

const gb = gbFor<PayExpenseConfirm>();
const FORMAT = 'YYYY-MM-DD';
/** 승인상태 코드 (10 요청 · 20 승인 · 30 반려) */
const APPROVED = '20';
const REJECTED = '30';
const CANCELED = '10';

/** 반려사유 창을 연 이유 — 'new' = 반려 확정 직전(새로 쓰기), 'edit' = 승인상태 칸을 눌러 사유 고치기(L138-146) */
type ReasonTarget = { mode: 'open' | 'edit'; rows: PayExpenseConfirm[]; reason?: string | null };

export const Pay50_Tab_ExpenseConfirm: React.FC = () => {
  // [E0] 화면 열림 (생성자 L65-94) → settings() L96-150: 조회기간 = 올해 1월 1일 ~ 오늘, "미승인내역만 조회" 체크, retrieve()
  const [startDate, setStartDate] = useState(dayjs().startOf('year'));
  const [closeDate, setCloseDate] = useState(dayjs());
  const [confirmStatusCheckYn, setConfirmStatusCheckYn] = useState(true);
  const [rows, setRows] = useState<PayExpenseConfirm[]>([]);
  const [loading, setLoading] = useState(false);
  /** 체크한 행 (grid.getSelectionModel().getSelectedItems()) */
  const [checked, setChecked] = useState<PayExpenseConfirm[]>([]);
  const [contentRow, setContentRow] = useState<PayExpenseConfirm | null>(null);
  const [reasonTarget, setReasonTarget] = useState<ReasonTarget | null>(null);
  const [relateId, setRelateId] = useState<number | null>(null);
  const retrieveSeq = useRef(0);

  // retrieve() L198-213: pay.Pay50_Expense.selectByDateConfirm (companyId·confirmerId는 서버)
  const retrieve = async () => {
    const my = ++retrieveSeq.current;
    setLoading(true);  // grid.mask("Loading")
    try {
      const list = await payApi.searchExpenseConfirms({
        startDate: startDate.format(FORMAT), closeDate: closeDate.format(FORMAT), confirmStatusCheckYn,
      });
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

  // updateConfirm() L346-371: pay.Pay50_Expense.updateConfirmReason(confirmStatusCode, confirmReason, confirmDate) → 성공이면 retrieve(), 아니면 서버 메시지
  const updateConfirm = async (confirmStatusCode: string, list: PayExpenseConfirm[], confirmReason: string | null) => {
    try {
      await payApi.updateExpenseConfirms(list.map(r => r.expenseId), confirmStatusCode, confirmReason);
      await retrieve();
    } catch (err) {
      message.info(errorMessage(err, '처리 실패'));
    }
  };

  // confirmChk() L327-344: 반려(30)는 반려사유 창을 먼저 열고(취소하면 "취소되었습니다."), 승인·취소는 사유 없이 바로 저장
  const confirmChk = (confirmStatusCode: string, list: PayExpenseConfirm[]) => {
    if (confirmStatusCode === REJECTED) setReasonTarget({ mode: 'open', rows: list });
    else void updateConfirm(confirmStatusCode, list, null);
  };

  // [E2] confirmButton[승인].Select (L113) → confirm() L215-251
  const confirm = () => {
    if (checked.length < 1) { message.warning('승인할 내용을 선택해주세요'); return; }
    if (checked.some(r => r.confirmStatusCode === APPROVED)) { message.warning('이미 승인처리된 건이 있습니다.'); return; }
    const list = checked;
    // [E8] msgBox.DialogHide [YES] (L235) → confirmChk("20", expenseList)
    Modal.confirm({ title: '확인', content: `${list.length}건의 내역을 승인하시겠습니까?`, width: 380, okText: '예', cancelText: '아니오', onOk: () => confirmChk(APPROVED, list) });
  };

  // [E3] rejectButton[반려].Select (L119) → reject() L253-289
  const reject = () => {
    if (checked.length < 1) { message.warning('반려할 내용을 선택해주세요'); return; }
    if (checked.some(r => r.confirmStatusCode === REJECTED)) { message.warning('이미 반려처리된 건이 있습니다.'); return; }
    const list = checked;
    // [E9] msgBox.DialogHide [YES] (L273) → confirmChk("30", expenseList)
    Modal.confirm({ title: '확인', content: `${list.length}건의 내역을 반려하시겠습니까?`, width: 380, okText: '예', cancelText: '아니오', onOk: () => confirmChk(REJECTED, list) });
  };

  // [E4] cancelButton[취소].Select (L125) → cancel() L291-325: 이미 지출결의(결의자 있음)가 진행·완료됐으면 취소할 수 없다
  const cancel = () => {
    if (checked.length < 1) { message.warning('취소할 내용을 선택해주세요'); return; }
    if (checked.some(r => r.apprEmpId != null)) { message.warning('지출결의 진행중 또는 완료되었습니다'); return; }
    const list = checked;
    // [E10] msgBox.DialogHide [YES] (L309) → confirmChk("10", expenseList)
    Modal.confirm({ title: '확인', content: `${list.length}건의 내역을 취소하시겠습니까?`, width: 380, okText: '예', cancelText: '아니오', onOk: () => confirmChk(CANCELED, list) });
  };

  // [E5] rejectSMSButton[반려건 일괄 알림발송].Select (L131) → rejectSMS() L386-401: pay.Pay50_Expense.confirmSendMessage → 서버 메시지 + retrieve()
  const rejectSMS = async () => {
    try {
      const n = await payApi.sendExpenseConfirmNotices();
      message.info(`${n}건이 발송완료되었습니다`);
      await retrieve();
    } catch (err) {
      message.error(errorMessage(err, '알림 발송 실패'));
    }
  };

  // buildGrid() L152-196: setChecked(MULTI), 합계 행(setSumGridHeader("계", 2), setSumGrid(8)) — 인덱스 2 = 발생일자, 8 = 지출금액
  const columnDefs = useMemo(() => [
    gb.date('occDate', 90, '발생일자'),  // L170
    gb.textCenter('regEmpName', 70, '요청자'),  // L171
    gb.text('desc', 320, '지출내역'),  // L172
    gb.textCenter('contentStatusName', 60, '내역상세'),  // L173
    // L174 addCell(ImageCell("View")) → Pay50_Lookup_Content.open(selectModel.getContent()) — 보기 전용
    iconCell<PayExpenseConfirm>('view', 'contentCell', 40, '', row => setContentRow(row)),
    gb.text('corpName', 150, '지출처'),  // L175
    gb.long('settleAmt', 100, '지출금액'),  // L176
    gb.date('dueDate', 90, '지급요청일'),  // L177
    gb.textCenter('payMethodName', 80, '지급방법'),  // L178
    gb.text('payAccountInfo', 220, '지급요청계좌'),  // L179
    gb.textCenter('fileCountStr', 60, '증빙자료'),  // L180
    // L189 addCell(ImageCell("View")) → Com01_Lookup_RelateAppr.view("pay50", expenseId) — 보기만
    iconCell<PayExpenseConfirm>('view', 'relateCell', 40, '', row => setRelateId(row.expenseId)),
    gb.textCenter('confirmStatusName', 70, '승인상태'),  // L182
  ], []);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', padding: 10, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E1] retrieveButton[조회].Select (L107) → retrieve() */}
        <SearchBar
          onSearch={() => void retrieve()}
          loading={loading}
          extra={(
            <>
              <Button type="save" onClick={confirm}>승인</Button>
              <Button type="cancel" onClick={reject}>반려</Button>
              <Button type="cancel" onClick={cancel}>취소</Button>
              <Button type="send" onClick={rejectSMS}>반려건 일괄 알림발송</Button>
            </>
          )}
        >
          <SearchBar.Field label="조회기간">
            <DatePicker style={{ width: 130 }} allowClear={false} value={startDate} format={FORMAT} onChange={d => d && setStartDate(d)} />
            <span style={{ margin: '0 4px' }}>~</span>
            <DatePicker style={{ width: 130 }} allowClear={false} value={closeDate} format={FORMAT} onChange={d => d && setCloseDate(d)} />
          </SearchBar.Field>
          <Checkbox checked={confirmStatusCheckYn} onChange={e => setConfirmStatusCheckYn(e.target.checked)}>미승인내역만 조회</Checkbox>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <MultiGrid<PayExpenseConfirm>
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.expenseId)}
            loading={loading}
            onCheckedChange={setChecked}
            sumRow={{ labelField: 'occDate', label: '계', sum: ['settleAmt'] }}
            // [E6] grid.CellClick (L138) → 승인상태 칸(인덱스 14)이고 반려(30)이면 lookupOpenReason() L373-384: 사유를 채운 반려사유 창 → updateConfirm(30, [행], 고친 사유)
            onCellClicked={e => {
              if (e.colDef.field === 'confirmStatusName' && e.data?.confirmStatusCode === REJECTED) {
                setReasonTarget({ mode: 'edit', rows: [e.data], reason: e.data.confirmReason });
              }
            }}
          />
        </div>
      </div>
      {/* [E7] viewCell (ImageCell).callbackOnCreate (L167) → 인라인 L167-172 */}
      <Com01_Lookup_RelateAppr open={relateId != null} mode="view" keyTable="pay50" keyTableId={relateId} onClose={() => setRelateId(null)} />
      <Pay50_Lookup_Content open={contentRow != null} mode="view" content={contentRow?.content} onClose={() => setContentRow(null)} />
      <Pay50_Lookup_ConfirmReason
        open={reasonTarget != null}
        mode={reasonTarget?.mode ?? 'open'}
        value={reasonTarget?.reason}
        onResult={reason => {
          const t = reasonTarget;
          if (!t) return;
          if (reason == null) { message.info('취소되었습니다.'); return; }
          void updateConfirm(REJECTED, t.rows, reason);
        }}
        onClose={() => setReasonTarget(null)}
      />
    </div>
  );
};
