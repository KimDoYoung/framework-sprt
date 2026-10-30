/**
 * 미수/미지급 결제등록 창 (U11) — Pay50_Tab_ExpenseSettle의 [결제등록]에서 연다 (openNew9100)
 * AS-IS: myApp/client/vi/ast/Ast07_Lookup_Settle.java (422줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L80-100: 모달 500×330, getEditor() L268-301: 라벨 폭 135, 결제일자(250) · 미수/미지급금액(250)+"미수/미지급 정리(결제없음)" 체크 · 결제금액(250) · 예금계좌(350) · 적요(400), 아래 가운데 [저장][닫기]
 * openNew9100(expenseId, callback) L137-174: 최신 지출결의서(pay.Pay50_Expense.selectById)로 새 결제를 채운다 — 거래 코드는 지급(02)이라 9003
 * 1단계: 거래(ast06) 기준 openNew·결제변경(open)은 이 화면이 쓰지 않아 만들지 않았다
 */
import React, { useEffect, useState } from 'react';
import { Checkbox, DatePicker, Input, InputNumber, Modal, Space, Typography, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import { actApi } from '@/api/act';
import { astApi } from '@/api/ast';
import { errorMessage } from '@/api/client';
import { AstCorpAccount } from '@/types/ast';
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

interface Props {
  /** openNew9100(expenseId, …)의 지출결의서 ID — null이면 닫힘 */
  expenseId: number | null;
  /** callback.execute(settleModel) — 저장한 뒤 부모가 retrieve() */
  onDone: () => void;
  onClose: () => void;
}

export const Ast07_Lookup_Settle: React.FC<Props> = ({ expenseId, onDone, onClose }) => {
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

  // [E0] 화면 열림 (생성자 L80-100) → buildGrid(), setting(), getEditor(), show()
  // openNew9100() L137-174: 최신 지출결의서를 다시 읽어 새 결제를 채운다(결제일자 오늘, 금액 = 미결제액, 예금계좌 = 지출결의서 계좌, 적요 = 지출내역)
  useEffect(() => {
    if (expenseId == null) { setReady(false); return; }
    let alive = true;
    setReady(false);
    astApi.getSettleExpense(expenseId).then(e => {
      if (!alive) return;
      setSettleDate(dayjs());
      setAmt(e.unSettleAmt);
      setSettleAmt(e.unSettleAmt);
      setNote(e.desc ?? '');
      setDepositId(e.depositId);
      setDepositName(e.depositName ?? '');
      setNoAct(false);
      setReady(true);
    }).catch(err => { if (alive) { message.error(errorMessage(err, '조회 실패')); onClose(); } });
    return () => { alive = false; };
  }, [expenseId]);  // eslint-disable-line react-hooks/exhaustive-deps

  if (expenseId == null || !ready) return null;

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
      await astApi.createSettle({
        expenseId, trId: 0, settleDate: d, note: note || null, depositId, trCode: noAct ? TR_CODE_NO_ACT : TR_CODE_PAY, amt, settleAmt,
      });
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
      title="미수/미지급 결제등록"
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
            {/* [E5] closeButton[닫기].Select ["NEW".equals(actionName)] (L248) → callback(null) + hide() — 새 결제는 아무것도 바뀌지 않는다 */}
            <Button type="close" onClick={onClose}>닫기</Button>
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
