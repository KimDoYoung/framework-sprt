/**
 * 미수/미지급 결제등록·변경 창(외화) (X08) — Ast07_Grid_ForSettle의 [등록]과 변경 아이콘이 연다
 * AS-IS: myApp/client/vi/ast/Ast07_Lookup_ForSettle.java (356줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L74-94: 모달 600×400, getEditor() L214-253: 라벨 폭 170, 결제일자(300) · 외화 미수/미지급금액(330) · 외화 결제금액(330) · 적용환율(330) · 원화 결제금액(330)
 *   · 예금계좌(350, 콤보 sys.Sys00_Common.selectForDeposit) · 적요(500), 아래 가운데 [저장][닫기]
 * openNew(trId, …) L96-135: 최신 거래(ast.Ast06_Tr.selectById)로 새 결제를 채운다(일자 오늘, 외화금액 = 미결제액, 적용환율 0, 원화 0, 적요 = 거래 적요, 거래코드 수령 9002 · 지급 9003)
 * open(settleModel, "MODI", …) L137-150: "미수/미지급 결제변경". MODI의 [닫기]는 callback(settleModel)이라 부르는 쪽이 분개를 다시 읽는다(onDone), NEW의 [닫기]는 아무것도 하지 않는다
 * 편집창 규격(11 §4a): antd Modal + 머리말 아래 선·푸터 위 선
 * 스타일: MF (임시 스크립트 판별 — docs/page-style.md 모달 스타일)
 */
import React, { useEffect, useMemo, useState } from 'react';
import { DatePicker, Input, Modal, Select, Space, Typography, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { actApi } from '@/api/act';
import { astApi } from '@/api/ast';
import { errorMessage } from '@/api/client';
import { AstForeignDeposit, AstSettleByTr } from '@/types/ast';
import { Button } from '@/components/button';
import { DoubleInput, LongInput } from './Ast06_EditParts';

const FORMAT = 'YYYY-MM-DD';
const LABEL = 170;

/** 라벨 폭 170 (form.setLabelWidth(170)) */
const Field: React.FC<{ label: string; width: number; children: React.ReactNode }> = ({ label, width, children }) => (
  <div style={{ display: 'flex', alignItems: 'center', width }}>
    <Typography.Text style={{ width: LABEL, flex: 'none', textAlign: 'right', paddingRight: 10 }}>{label}</Typography.Text>
    <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
  </div>
);

/** 거래 기준 열기 — NEW: openNew(trId, …), MODI: open(settleModel, "MODI", …) */
export type AstForSettleTarget = { mode: 'NEW'; trId: number } | { mode: 'MODI'; settle: AstSettleByTr };

interface Props {
  /** 값이 있으면 열림 */
  target: AstForSettleTarget | null;
  /** callback.execute(settleModel) — 저장했거나 MODI를 닫았다. 부모가 결제내역·분개를 다시 읽는다 */
  onDone: () => void;
  onClose: () => void;
}

export const Ast07_Lookup_ForSettle: React.FC<Props> = ({ target, onDone, onClose }) => {
  const [settleDate, setSettleDate] = useState<Dayjs | null>(dayjs());
  const [forAmt, setForAmt] = useState<number | null>(null);
  const [forSettleAmt, setForSettleAmt] = useState<number | null>(null);
  const [fxRate, setFxRate] = useState<number | null>(null);
  const [settleAmt, setSettleAmt] = useState<number | null>(null);
  const [depositId, setDepositId] = useState<number | null>(null);
  const [depositName, setDepositName] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [trCode, setTrCode] = useState('');
  const [deposits, setDeposits] = useState<AstForeignDeposit[]>([]);
  const [saving, setSaving] = useState(false);
  const [ready, setReady] = useState(false);

  // [E0] 화면 열림 (생성자 L74-94) → buildGrid(), setting(), getEditor(), show()
  // setting() L152-206: depositName = CommonComboBoxField("sys.Sys00_Common.selectForDeposit")
  useEffect(() => {
    if (!target) { setReady(false); return; }
    let alive = true;
    setReady(false);
    astApi.getForeignDeposits().then(d => { if (alive) setDeposits(d); }).catch(() => { if (alive) setDeposits([]); });
    if (target.mode === 'MODI') {
      const m = target.settle;
      setSettleDate(dayjs(m.settleDate));
      setForAmt(m.forAmt); setForSettleAmt(m.forSettleAmt); setFxRate(m.fxRate); setSettleAmt(m.settleAmt);
      setDepositId(m.depositId); setDepositName(m.depositName); setNote(m.note ?? ''); setTrCode(m.trCode ?? '');
      setReady(true);
    } else {
      // openNew() L96-135: 최신 거래를 다시 읽어 새 결제를 채운다
      astApi.getTrIntrinsic(target.trId).then(t => {
        if (!alive) return;
        setSettleDate(dayjs());
        setForAmt(t.unSettleAmt); setForSettleAmt(t.unSettleAmt); setFxRate(0); setSettleAmt(0);
        setDepositId(null); setDepositName(null); setNote(t.note ?? '');
        setTrCode(t.rcvPayCode === '01' ? '9002' : t.rcvPayCode === '02' ? '9003' : '');   // 9002:미수금 결제 · 9003:미지급금 결제
        setReady(true);
      }).catch(err => { if (alive) { message.error(errorMessage(err, '조회 실패')); onClose(); } });
    }
    return () => { alive = false; };
  }, [target]);  // eslint-disable-line react-hooks/exhaustive-deps

  const depositOptions = useMemo(() => {
    const opts = deposits.map(d => ({ value: d.codeId, label: d.name ?? '' }));
    if (depositId != null && !opts.some(o => o.value === depositId)) opts.unshift({ value: depositId, label: depositName ?? String(depositId) });
    return opts;
  }, [deposits, depositId, depositName]);

  if (!target || !ready) return null;

  // setSettleAmt() L255-261: 원화 결제금액 = (long)(외화 결제금액 × 적용환율)
  const calc = (fs: number | null, fx: number | null) => setSettleAmt(Math.trunc((fs ?? 0) * (fx ?? 0)));

  // [E4] updateButton[저장].Select (L188) → preUpdate() L263-307 → 마감 검사(act.Act04_GenLedger.checkClose(결제일)) → update() L309-332 → "저장이 완료되었습니다." → updateDepositBook → hide()
  const preUpdate = async () => {
    if (!settleDate) { message.info('결제일자는 필수입력 항목입니다'); return; }
    if (!forSettleAmt) { message.info('외화 미수/미지급 금액은 필수입력 항목입니다'); return; }
    if (!fxRate) { message.info('적용환율은 필수입력 항목입니다'); return; }
    if (!settleAmt) { message.info('원화 결제금액은 필수입력 항목입니다'); return; }
    if (depositId == null) { message.info('예금계좌는 필수선택 항목입니다.'); return; }
    const d = settleDate.format(FORMAT);
    setSaving(true);
    try {
      await actApi.checkLedgerClose(d);
      const req = { expenseId: null, trId: target.mode === 'NEW' ? target.trId : target.settle.trId, settleDate: d, note: note || null, depositId, trCode, amt: null, settleAmt, forAmt: forAmt ?? 0, forSettleAmt, fxRate };
      if (target.mode === 'MODI') await astApi.updateSettle(target.settle.settleId, req);
      else await astApi.createSettle(req);
    } catch (err) {
      message.info(errorMessage(err, '저장 실패'));
      setSaving(false);
      return;
    }
    setSaving(false);
    message.info('저장이 완료되었습니다.');
    onDone();
    void astApi.cleanDepositBook(d).catch(() => undefined);   // updateDepositBook() L334-346: 결과는 보지 않는다
    onClose();
  };

  return (
    <Modal
      open
      title={target.mode === 'MODI' ? '미수/미지급 결제변경' : '미수/미지급 결제등록'}
      width={680}
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
            {/* [E6] closeButton[닫기].Select ["NEW".equals(actionName)] (L194) → NEW: callback(null) + hide() — 아무것도 바뀌지 않는다 / MODI: callback(settleModel) + hide() */}
            <Button type="close" onClick={() => { if (target.mode === 'MODI') onDone(); onClose(); }}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: '12px 2px' }}>
        <Field label="결제일자" width={300}>
          <DatePicker style={{ width: 130 }} allowClear={false} value={settleDate} format={FORMAT} onChange={d => setSettleDate(d)} />
        </Field>
        <Field label="외화 미수/미지급금액" width={330}>
          {/* [E1] forAmt[외화 미수/미지급금액].ValueChange (L158) → 외화 결제금액을 같은 값으로, setSettleAmt() */}
          <DoubleInput value={forAmt} dec={6} onChange={v => { setForAmt(v); setForSettleAmt(v); calc(v, fxRate); }} />
        </Field>
        <Field label="외화 결제금액" width={330}>
          {/* [E2] forSettleAmt[외화 결제금액].ValueChange (L165) → setSettleAmt() */}
          <DoubleInput value={forSettleAmt} dec={6} onChange={v => { setForSettleAmt(v); calc(v, fxRate); }} />
        </Field>
        <Field label="적용환율" width={330}>
          {/* [E3] fxRate[적용환율].ValueChange (L171) → setSettleAmt() */}
          <DoubleInput value={fxRate} dec={6} onChange={v => { setFxRate(v); calc(forSettleAmt, v); }} />
        </Field>
        <Field label="원화 결제금액" width={330}>
          <LongInput value={settleAmt} onChange={v => setSettleAmt(v)} />
        </Field>
        <Field label="예금계좌" width={350}>
          {/* [E5] depositName[예금계좌].Collapse (L181) → depositId = 고른 코드 ID */}
          <Select<number> style={{ width: '100%' }} options={depositOptions} value={depositId ?? undefined}
            onChange={(id, opt) => { setDepositId(id); setDepositName((opt as { label?: string }).label ?? null); }} />
        </Field>
        <Field label="적요" width={500}>
          <Input value={note} onChange={e => setNote(e.target.value)} />
        </Field>
      </div>
    </Modal>
  );
};
