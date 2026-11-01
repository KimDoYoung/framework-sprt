/**
 * 미수/미지급 결제등록 창 (U11) — Pay50_Tab_ExpenseSettle의 [결제등록]에서 연다 (openNew9100)
 * AS-IS: myApp/client/vi/ast/Ast07_Lookup_Settle.java (422줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L80-100: 모달 500×330, getEditor() L268-301: 라벨 폭 135, 결제일자(250) · 미수/미지급금액(250)+"미수/미지급 정리(결제없음)" 체크 · 결제금액(250) · 예금계좌(350) · 적요(400), 아래 가운데 [저장][닫기]
 * openNew9100(expenseId, callback) L137-174: 최신 지출결의서(pay.Pay50_Expense.selectById)로 새 결제를 채운다 — 거래 코드는 지급(02)이라 9003
 * X03(Ast07_Grid_Settle): 거래(ast06) 기준 openNew(trId, …) L102-135(최신 거래를 다시 읽어 미결제액·적요로 채움, 거래 코드는 수령 9002·지급 9003, 펀드보수 유보처리 9913·9923은 9002)
 *   와 결제변경 open(settleModel, trCode, rcvPayCode, "MODI", …) L176-199("미수/미지급 결제변경", 거래코드가 9007이면 정리(결제없음) 체크)를 `target`으로 더했다.
 *   MODI의 [닫기]는 callback(settleModel)이라 부르는 쪽이 분개를 다시 읽는다(onDone), NEW의 [닫기]는 callback(null)이라 아무것도 하지 않는다
 */
import React, { useEffect, useState } from 'react';
import { Checkbox, DatePicker, Input, InputNumber, Modal, Space, Typography, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import { actApi } from '@/api/act';
import { astApi } from '@/api/ast';
import { errorMessage } from '@/api/client';
import { AstCorpAccount, AstSettleByTr } from '@/types/ast';
import { Button } from '@/components/button';
import { Ast01_Lookup_CorpAccount } from './Ast01_Lookup_CorpAccount';

const FORMAT = 'YYYY-MM-DD';
/** setTrCode() L399-413: 지급(02) → 9003 미지급금 결제 */
const TR_CODE_PAY = '9003';
/** setNoActCheckBox() L385-397: 9007 미수보수 반제 */
const TR_CODE_NO_ACT = '9007';

/** 라벨 폭 135 (form.setLabelWidth(135)) */
const Field: React.FC<{ label: string; width: number; children: React.ReactNode }> = ({ label, width, children }) => (
  <div style={{ display: 'flex', alignItems: 'center', width }}>
    <Typography.Text style={{ width: 135, flex: 'none', textAlign: 'right', paddingRight: 10 }}>{label}</Typography.Text>
    <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
  </div>
);

const money = { formatter: (v: number | string | undefined) => `${v ?? ''}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','), parser: (v: string | undefined) => Number((v ?? '').replace(/,/g, '')) };

/** 거래 기준 열기 — NEW: openNew(trId, …), MODI: open(settleModel, trCode, rcvPayCode, "MODI", …) */
export type AstSettleTarget =
  | { mode: 'NEW'; trId: number }
  | { mode: 'MODI'; settle: AstSettleByTr; trCode: string | null; rcvPayCode: string | null };

/** setTrCode() L399-413: 수령(01) 9002 · 지급(02) 9003, 펀드운용·사무관리보수 유보처리(자동) 9913·9923은 9002 */
const settleTrCode = (rcvPayCode: string | null, orgTrCode: string | null): string => {
  let code = rcvPayCode === '01' ? '9002' : rcvPayCode === '02' ? TR_CODE_PAY : '';
  if (orgTrCode === '9913' || orgTrCode === '9923') code = '9002';
  return code;
};

interface Props {
  /** openNew9100(expenseId, …)의 지출결의서 ID — null이면 닫힘 */
  expenseId: number | null;
  /** 거래 기준 열기(X03) — 값이 있으면 열림. expenseId와 함께 쓰지 않는다 */
  target?: AstSettleTarget | null;
  /** callback.execute(settleModel) — 저장한 뒤 부모가 retrieve() */
  onDone: () => void;
  onClose: () => void;
}

export const Ast07_Lookup_Settle: React.FC<Props> = ({ expenseId, target = null, onDone, onClose }) => {
  const [settleDate, setSettleDate] = useState<Dayjs | null>(dayjs());
  const [amt, setAmt] = useState<number | null>(null);
  const [settleAmt, setSettleAmt] = useState<number | null>(null);
  const [note, setNote] = useState('');
  const [depositId, setDepositId] = useState<number | null>(null);
  const [depositName, setDepositName] = useState('');
  const [noAct, setNoAct] = useState(false);
  const [lookupOpen, setLookupOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [ready, setReady] = useState(false);
  /** 거래 기준일 때: 원거래의 수령/지급 구분·거래코드(setTrCode()가 쓴다) */
  const [rcvPayCode, setRcvPayCode] = useState<string | null>(null);
  const [orgTrCode, setOrgTrCode] = useState<string | null>(null);

  // [E0] 화면 열림 (생성자 L80-100) → buildGrid(), setting(), getEditor(), show()
  // openNew9100() L137-174: 최신 지출결의서를 다시 읽어 새 결제를 채운다(결제일자 오늘, 금액 = 미결제액, 예금계좌 = 지출결의서 계좌, 적요 = 지출내역)
  useEffect(() => {
    if (expenseId == null && target == null) { setReady(false); return; }
    let alive = true;
    setReady(false);
    if (target?.mode === 'MODI') {
      // open(settleModel, trCode, rcvPayCode, "MODI", …) L176-199: 고른 결제로 채운다, 거래코드가 9007이면 정리(결제없음) 체크
      const m = target.settle;
      setRcvPayCode(target.rcvPayCode);
      setOrgTrCode(target.trCode);
      setSettleDate(dayjs(m.settleDate));
      setAmt(m.amt);
      setSettleAmt(m.settleAmt);
      setNote(m.note ?? '');
      setDepositId(m.depositId);
      setDepositName(m.depositName ?? '');
      setNoAct(m.trCode === TR_CODE_NO_ACT);
      setReady(true);
    } else if (target?.mode === 'NEW') {
      // openNew(trId, …) L102-135: 최신 거래를 다시 읽어 새 결제를 채운다(결제일자 오늘, 금액 = 미결제액, 적요 = 거래 적요)
      astApi.getTrIntrinsic(target.trId).then(t => {
        if (!alive) return;
        setRcvPayCode(t.rcvPayCode);
        setOrgTrCode(t.trCode);
        setSettleDate(dayjs());
        setAmt(t.unSettleAmt);
        setSettleAmt(t.unSettleAmt);
        setNote(t.note ?? '');
        setDepositId(null);
        setDepositName('');
        setNoAct(false);
        setReady(true);
      }).catch(err => { if (alive) { message.error(errorMessage(err, '조회 실패')); onClose(); } });
    } else {
      astApi.getSettleExpense(expenseId!).then(e => {
        if (!alive) return;
        setRcvPayCode('02');
        setOrgTrCode(null);
        setSettleDate(dayjs());
        setAmt(e.unSettleAmt);
        setSettleAmt(e.unSettleAmt);
        setNote(e.desc ?? '');
        setDepositId(e.depositId);
        setDepositName(e.depositName ?? '');
        setNoAct(false);
        setReady(true);
      }).catch(err => { if (alive) { message.error(errorMessage(err, '조회 실패')); onClose(); } });
    }
    return () => { alive = false; };
  }, [expenseId, target]);  // eslint-disable-line react-hooks/exhaustive-deps

  if ((expenseId == null && target == null) || !ready) return null;

  // [E2] noActCheckBox.ValueChange (L214) → setNoActCheckBox() L385-397: 체크하면 9007·예금계좌 지우고 막는다, 풀면 지급 코드·예금계좌 지움
  const changeNoAct = (checked: boolean) => { setNoAct(checked); setDepositId(null); setDepositName(''); };

  // [E4] updateButton[저장].Select (L242) → preUpdate() L303-344: 필수 검사 → act.Act04_GenLedger.checkClose(결제일) → update() L346-369 → "저장이 완료되었습니다." → updateDepositBook → hide()
  const preUpdate = async () => {
    if (!settleDate) { message.info('결제일자는 필수입력 항목입니다'); return; }
    if (!amt) { message.info('미수/미지급 금액은 필수입력 항목입니다'); return; }
    if (!settleAmt) { message.info('결제금액은 필수입력 항목입니다'); return; }
    if (!noAct && depositId == null) { message.info('예금계좌는 필수선택 항목입니다.'); return; }
    const d = settleDate.format(FORMAT);
    setSaving(true);
    try {
      await actApi.checkLedgerClose(d);
      const trCode = noAct ? TR_CODE_NO_ACT : target ? settleTrCode(rcvPayCode, orgTrCode) : TR_CODE_PAY;
      if (target?.mode === 'MODI') {
        await astApi.updateSettle(target.settle.settleId, { expenseId: null, trId: target.settle.trId, settleDate: d, note: note || null, depositId, trCode, amt, settleAmt });
      } else {
        await astApi.createSettle({ expenseId: target ? null : expenseId, trId: target ? target.trId : 0, settleDate: d, note: note || null, depositId, trCode, amt, settleAmt });
      }
    } catch (err) {
      message.info(errorMessage(err, '저장 실패'));
      setSaving(false);
      return;
    }
    setSaving(false);
    message.info('저장이 완료되었습니다.');
    onDone();
    void astApi.cleanDepositBook(d).catch(() => undefined);   // updateDepositBook() L371-383: 결과는 보지 않는다
    onClose();
  };

  return (
    <Modal
      open
      title={target?.mode === 'MODI' ? '미수/미지급 결제변경' : '미수/미지급 결제등록'}
      width={500}
      maskClosable={false}
      onCancel={onClose}
      styles={{
        header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 0 },
        footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 0 },
      }}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={preUpdate} loading={saving}>저장</Button>
            {/* [E5] closeButton[닫기].Select ["NEW".equals(actionName)] (L248) → NEW: callback(null) + hide() — 아무것도 바뀌지 않는다 / MODI: callback(settleModel) + hide() */}
            <Button type="close" onClick={() => { if (target?.mode === 'MODI') onDone(); onClose(); }}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: '12px 2px' }}>
        <Field label="결제일자" width={250}>
          <DatePicker style={{ width: 130 }} allowClear={false} value={settleDate} format={FORMAT} onChange={d => setSettleDate(d)} />
        </Field>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Field label="미수/미지급금액" width={250}>
            {/* [E1] amt[미수/미지급금액].ValueChange (L205) → 결제금액을 같은 값으로 */}
            <InputNumber style={{ width: '100%' }} precision={0} {...money} value={amt} onChange={v => { const n = v == null ? null : Number(v); setAmt(n); setSettleAmt(n); }} />
          </Field>
          <Checkbox style={{ marginLeft: 15 }} checked={noAct} onChange={e => changeNoAct(e.target.checked)}>미수/미지급 정리(결제없음)</Checkbox>
        </div>
        <Field label="결제금액" width={250}>
          <InputNumber style={{ width: '100%' }} precision={0} {...money} value={settleAmt} onChange={v => setSettleAmt(v == null ? null : Number(v))} />
        </Field>
        <Field label="예금계좌" width={350}>
          {/* [E3] depositName[예금계좌].TriggerClick [result == null] (L222) → Ast01_Lookup_CorpAccount.open(결제일자, "NOT") */}
          <Input readOnly disabled={noAct} value={depositName} suffix={<SearchOutlined />} style={{ cursor: noAct ? 'default' : 'pointer' }} onClick={() => !noAct && setLookupOpen(true)} />
        </Field>
        <Field label="적요" width={400}>
          <Input value={note} onChange={e => setNote(e.target.value)} />
        </Field>
      </div>
      <Ast01_Lookup_CorpAccount open={lookupOpen} stdDate={settleDate ?? dayjs()} mode="NOT"
        onResult={(row: AstCorpAccount | null) => { setDepositId(row ? row.classTreeId : null); setDepositName(row ? row.classTreeName ?? '' : ''); setLookupOpen(false); }}
        onClose={() => setLookupOpen(false)} />
    </Modal>
  );
};
