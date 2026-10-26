/**
 * 펀드별 배정 등록·수정 창 (Q06). 본 화면 아래 목록 Fnd31_Page_OprFund의 [등록]·수정 아이콘이 연다
 * AS-IS: myApp/client/vi/fnd/Fnd31_Edit_OprFund.java (442줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L108-159: 모달 400×380, 펀드코드(조회창 트리거, 직접 입력 불가) · 펀드명(읽기 전용 여러 줄 400×70) · 배정수량 · 단가(읽기 전용) · 배정금액 · 수수료 · 납입금액(읽기 전용), 라벨 폭 105, 아래 가운데 [저장][닫기]
 * insert(oprId, cb) L78 "펀드별 배정" / edit(oprId, model, cb) L93 "펀드별 배정 수정" — 열릴 때 servicePublic() L297: 청약의 발행가·수수료율·총배정수량을 읽고, serviceInsert/serviceEdit() L317·L330: 배정수량 합계를 읽는다
 * 숨은 버튼 2개(fundButton[펀드선택]·accountButton[일임계좌선택])는 펀드코드를 누를 때 SettingPopup("펀드/일임계좌 선택")에 담겨 뜬다
 */
import React, { useEffect, useRef, useState } from 'react';
import { Input, InputNumber, message, Space, Typography } from 'antd';
import { fndApi } from '@/api/fnd';
import { advApi } from '@/api/adv';
import { errorMessage } from '@/api/client';
import { OprFund } from '@/types/fnd';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';
import { LookupInput } from '@/components/lookup/LookupInput';
import { SettingPopup } from '@/components/lookup/SettingPopup';
import { Fnd01_Lookup_SelectSingle } from '@/components/lookup/Fnd01_Lookup_SelectSingle';
import { Adv02_Lookup_SelectSingle } from '@/components/lookup/Adv02_Lookup_SelectSingle';

const fmtLong = (v: string | number | undefined) => (v == null || v === '' ? '' : `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','));
const parseNum = (v: string | undefined) => (v ?? '').replace(/,/g, '');
const nz = (v: number | null) => v ?? 0;

export type OprFundTarget = { mode: 'insert'; oprId: number } | { mode: 'edit'; oprId: number; row: OprFund };

interface Props {
  target: OprFundTarget | null;
  /** callback.execute() — 저장이 끝난 뒤(창은 스스로 닫는다) */
  onSaved: () => void;
  onClose: () => void;
}

const Field: React.FC<{ label: string; width: number | string; children: React.ReactNode }> = ({ label, width, children }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', width }}>
    <Typography.Text style={{ width: 105, flex: 'none', lineHeight: '32px' }}>{label}</Typography.Text>
    <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
  </div>
);

export const Fnd31_Edit_OprFund: React.FC<Props> = ({ target, onSaved, onClose }) => {
  const [fundCode, setFundCode] = useState('');
  const [fundName, setFundName] = useState('');
  const [fundId, setFundId] = useState<number | null>(null);
  const [fundAdviceType, setFundAdviceType] = useState<string | null>(null);
  const [qty, setQty] = useState<number | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [contAmt, setContAmt] = useState<number | null>(null);
  const [fee, setFee] = useState<number | null>(null);
  const [settleAmt, setSettleAmt] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [settingOpen, setSettingOpen] = useState(false);
  const [fundOpen, setFundOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  // servicePublic()·serviceInsert/Edit()가 읽는 값: 수수료율(feeRate), 총배정수량(totalQty), 이 펀드를 뺀 배정수량 합계(sumQty)
  const base = useRef({ feeRate: 0, totalQty: null as number | null, sumQty: 0 });

  // [E0] 화면 열림 (생성자 L108-159) → settings(), show()
  // insert() L78-91 · edit() L93-106: 모델을 폼에 채우고 servicePublic() L297-315 — 청약의 발행가(없으면 0)·수수료율·총배정수량, serviceInsert/Edit() — 배정수량 합계
  useEffect(() => {
    if (!target) return;
    if (target.mode === 'edit') {
      const r = target.row;
      setFundCode(r.fundCode ?? ''); setFundName(r.fundName ?? ''); setFundId(r.fundId); setFundAdviceType(r.fundAdviceType ?? null);
      setQty(r.qty ?? null); setContAmt(r.contAmt ?? null); setFee(r.fee ?? null); setSettleAmt(r.settleAmt ?? null);
    } else {
      setFundCode(''); setFundName(''); setFundId(null); setFundAdviceType(null); setQty(null); setContAmt(null); setFee(null); setSettleAmt(null);
    }
    setPrice(null);
    base.current = { feeRate: 0, totalQty: null, sumQty: 0 };
    fndApi.getSubscriptionOpr(target.oprId).then(opr => {
      setPrice(opr.price ?? 0);
      base.current.feeRate = opr.feeRate ?? 0;
      base.current.totalQty = opr.qty ?? null;
    }).catch(() => setPrice(0));
    // 원본은 SUM(fnd31_qty)를 서버에서 읽는다(행이 없으면 null → 0으로 본다). 수정이면 이 행의 수량을 뺀다
    fndApi.searchOprFunds(target.oprId).then(list => {
      const exceptId = target.mode === 'edit' ? target.row.oprFundId : null;
      base.current.sumQty = list.filter(f => f.oprFundId !== exceptId).reduce((a, f) => a + (f.qty ?? 0), 0);
    }).catch(() => undefined);
  }, [target]);

  if (!target) return null;

  // [E3] fundButton[펀드선택].Select (L181) → openLookupOpr() L386-400 · [E4] accountButton[일임계좌선택].Select (L187)
  // [E5] fundCode[펀드코드].TriggerClick (L205) → adv.Adv02_Account.selectByCompanyId: 일임계좌가 있으면 SettingPopup("펀드/일임계좌 선택"), 없으면 바로 펀드 조회창
  const openTrigger = async () => {
    try {
      const res = await advApi.searchAccounts({ searchText: '', offset: 0, limit: 1 });
      if (res.total > 0) setSettingOpen(true);
      else setFundOpen(true);
    } catch {
      setFundOpen(true);
    }
  };

  /** 수수료 = 배정금액 × (수수료율 × 100 버림) / 10000 (정수 나눗셈) — BigDecimal.valueOf(feeRate).multiply(100).longValue() */
  const calcFee = (amt: number) => Math.trunc((amt * Math.trunc(Number((base.current.feeRate * 100).toFixed(8)))) / 10000);

  // [E6 생략] fundCode[펀드코드].ValueChange (L229) — 본문이 모두 주석 처리돼 있다
  // [E7] qty[배정수량].Change (L264) → 배정금액 = 배정수량 × 단가, 수수료, 납입금액 = 배정금액 + 수수료
  const changeQty = (v: number | null) => {
    setQty(v);
    const amt = nz(v) * nz(price);
    const f = calcFee(amt);
    setContAmt(amt); setFee(f); setSettleAmt(amt + f);
  };
  // [E8] contAmt[배정금액].Change (L277) → 수수료, 납입금액
  const changeContAmt = (v: number | null) => {
    setContAmt(v);
    const f = calcFee(nz(v));
    setFee(f); setSettleAmt(nz(v) + f);
  };
  // [E9] fee[수수료].Change (L288) → 납입금액 = 배정금액 + 수수료
  const changeFee = (v: number | null) => {
    setFee(v);
    setSettleAmt(nz(contAmt) + nz(v));
  };

  // [E1] updateButton[저장].Select (L169) → update() L345-384
  const update = async () => {
    if (!fundCode || fundId == null) { message.warning('펀드는 필수선택 항목입니다'); return; }
    if (qty == null) { message.warning('배정수량 및 배정금액은 필수선택 항목입니다'); return; }
    if (qty < 0) { message.warning('배정수량을 올바르게 작성해주세요'); return; }
    if (base.current.sumQty + qty > nz(base.current.totalQty)) { message.warning('배정수량을 다시 한번 확인해주세요'); return; }
    setSaving(true);
    try {
      await fndApi.saveOprFund({ oprFundId: target.mode === 'edit' ? target.row.oprFundId : null, oprId: target.oprId, fundId, fundAdviceType, price, qty, contAmt, fee, settleAmt });
      onSaved();
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  const num = (value: number | null, onChange?: (v: number | null) => void) => (
    <InputNumber style={{ width: 250 }} controls={false} precision={0} formatter={fmtLong} parser={parseNum as never}
      value={value} onChange={onChange ? v => onChange(v == null ? null : Number(v)) : undefined} readOnly={!onChange} disabled={!onChange} />
  );

  return (
    <LookupModal
      open
      title={target.mode === 'insert' ? '펀드별 배정' : '펀드별 배정 수정'}
      width={460}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={update} loading={saving}>저장</Button>
            {/* [E2] closeButton[닫기].Select (L175) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '10px 0' }}>
        <Field label="펀드코드 " width={360}>
          <LookupInput value={fundCode} width={250} onOpen={openTrigger} />
        </Field>
        <Field label="펀드명 " width={360}>
          <Input.TextArea rows={3} readOnly value={fundName} />
        </Field>
        <Field label="배정수량 " width={360}>{num(qty, changeQty)}</Field>
        <Field label="단가 " width={360}>{num(price)}</Field>
        <Field label="배정금액 " width={360}>{num(contAmt, changeContAmt)}</Field>
        <Field label="수수료 " width={360}>{num(fee, changeFee)}</Field>
        <Field label="납입금액 " width={360}>{num(settleAmt)}</Field>
      </div>
      <SettingPopup
        open={settingOpen}
        title="펀드/일임계좌 선택"
        onClose={() => setSettingOpen(false)}
        items={[
          { type: 'select', label: '펀드선택', onClick: () => setFundOpen(true) },
          { type: 'select', label: '일임계좌선택', onClick: () => setAccountOpen(true) },
        ]}
      />
      {/* openLookupOpr() L386-400: 고르면 펀드명·펀드코드·fundId, fundAdviceType "1"(운용펀드) */}
      <Fnd01_Lookup_SelectSingle
        open={fundOpen}
        onResult={fund => {
          if (!fund) return;
          setFundName(fund.fundName ?? ''); setFundCode(fund.fundCode ?? ''); setFundId(fund.fundId); setFundAdviceType('1');
        }}
        onClose={() => setFundOpen(false)}
      />
      {/* [E4] accountButton L187-204: 계좌명·관리코드·accountId, fundAdviceType "2"(일임·자문) */}
      <Adv02_Lookup_SelectSingle
        open={accountOpen}
        onResult={account => {
          setFundName(account.manageName ?? ''); setFundCode(account.manageCode ?? ''); setFundId(account.accountId); setFundAdviceType('2');
        }}
        onClose={() => setAccountOpen(false)}
      />
    </LookupModal>
  );
};
