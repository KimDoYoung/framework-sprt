/**
 * 펀드별 수요예측 신청 등록·수정 창 (Q05). 본 화면 아래 목록 Fnd31_Page_DemandOprFund의 [등록]·수정 아이콘이 연다
 * AS-IS: myApp/client/vi/fnd/Fnd31_Edit_DemandOprFund.java (358줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L100-142: 모달 400×320, 펀드코드(조회창 트리거, 직접 입력 불가) · 펀드명(읽기 전용 여러 줄 400×70) · 신청수량 · 신청가격(읽기 전용) · 신청금액(읽기 전용), 라벨 폭 105, 아래 가운데 [저장][닫기]
 * insert(oprId, cb) L72 "펀드별 수요예측 신청" / edit(oprId, model, cb) L86 "펀드별 수요예측 수정" — 열릴 때 servicePublic() L253: 수요예측의 신청가격을 읽어 신청가격에 넣는다
 * 숨은 버튼 2개(fundButton[펀드선택]·accountButton[일임계좌선택])는 펀드코드를 누를 때 SettingPopup("펀드/일임계좌 선택")에 담겨 뜬다
 */
import React, { useEffect, useState } from 'react';
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

export type DemandOprFundTarget = { mode: 'insert'; oprId: number } | { mode: 'edit'; oprId: number; row: OprFund };

interface Props {
  target: DemandOprFundTarget | null;
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

export const Fnd31_Edit_DemandOprFund: React.FC<Props> = ({ target, onSaved, onClose }) => {
  const [fundCode, setFundCode] = useState('');
  const [fundName, setFundName] = useState('');
  const [fundId, setFundId] = useState<number | null>(null);
  const [fundAdviceType, setFundAdviceType] = useState<string | null>(null);
  const [qty, setQty] = useState<number | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [settleAmt, setSettleAmt] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [settingOpen, setSettingOpen] = useState(false);
  const [fundOpen, setFundOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  // [E0] 화면 열림 (생성자 L100-142) → settings(), show()
  // insert() L72-84 · edit() L86-98: 모델을 폼에 채우고 servicePublic() L253-269 — 수요예측의 신청가격(없으면 0)
  useEffect(() => {
    if (!target) return;
    if (target.mode === 'edit') {
      const r = target.row;
      setFundCode(r.fundCode ?? ''); setFundName(r.fundName ?? ''); setFundId(r.fundId); setFundAdviceType(r.fundAdviceType ?? null);
      setQty(r.qty ?? null); setSettleAmt(r.settleAmt ?? null);
    } else {
      setFundCode(''); setFundName(''); setFundId(null); setFundAdviceType(null); setQty(null); setSettleAmt(null);
    }
    setPrice(null);
    fndApi.getOpr(target.oprId).then(opr => setPrice(opr.price ?? 0)).catch(() => setPrice(0));
  }, [target]);

  if (!target) return null;

  // [E3] fundButton[펀드선택].Select (L161) → openLookupOpr() L302-316 · [E4] accountButton[일임계좌선택].Select (L167)
  // [E5] fundCode[펀드코드].TriggerClick (L185) → adv.Adv02_Account.selectByCompanyId: 일임계좌가 있으면 SettingPopup("펀드/일임계좌 선택"), 없으면 바로 펀드 조회창
  const openTrigger = async () => {
    try {
      const res = await advApi.searchAccounts({ searchText: '', offset: 0, limit: 1 });
      if (res.total > 0) setSettingOpen(true);
      else setFundOpen(true);
    } catch {
      setFundOpen(true);
    }
  };

  // [E6 생략] fundCode[펀드코드].ValueChange (L209) — 본문이 모두 주석 처리돼 있다
  // [E7] qty[신청수량].Change (L243) → settleAmt = checkLongNull(qty) × checkLongNull(price)
  const changeQty = (v: number | null) => {
    setQty(v);
    setSettleAmt((v ?? 0) * (price ?? 0));
  };

  // [E1] updateButton[저장].Select (L149) → update() L271-300
  const update = async () => {
    if (!fundCode || fundId == null) { message.warning('펀드는 필수선택 항목입니다'); return; }
    if (qty == null) { message.warning('신청수량은 필수작성 항목입니다'); return; }
    if (qty < 0) { message.warning('신청수량을 올바르게 작성해주세요'); return; }
    setSaving(true);
    try {
      await fndApi.saveOprFund({ oprFundId: target.mode === 'edit' ? target.row.oprFundId : null, oprId: target.oprId, fundId, fundAdviceType, price, qty, settleAmt });
      onSaved();
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <LookupModal
      open
      title={target.mode === 'insert' ? '펀드별 수요예측 신청' : '펀드별 수요예측 수정'}
      width={460}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={update} loading={saving}>저장</Button>
            {/* [E2] closeButton[닫기].Select (L155) → hide() */}
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
        <Field label="신청수량 " width={360}>
          <InputNumber style={{ width: 250 }} controls={false} precision={0} formatter={fmtLong} parser={parseNum as never} value={qty} onChange={v => changeQty(v == null ? null : Number(v))} />
        </Field>
        <Field label="신청가격 " width={360}>
          <InputNumber style={{ width: 250 }} controls={false} precision={0} formatter={fmtLong} parser={parseNum as never} readOnly disabled value={price} />
        </Field>
        <Field label="신청금액 " width={360}>
          <InputNumber style={{ width: 250 }} controls={false} precision={0} formatter={fmtLong} parser={parseNum as never} readOnly disabled value={settleAmt} />
        </Field>
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
      {/* openLookupOpr() L302-316: 고르면 펀드명·펀드코드·fundId, fundAdviceType "1"(운용펀드) */}
      <Fnd01_Lookup_SelectSingle
        open={fundOpen}
        onResult={fund => {
          if (!fund) return;
          setFundName(fund.fundName ?? ''); setFundCode(fund.fundCode ?? ''); setFundId(fund.fundId); setFundAdviceType('1');
        }}
        onClose={() => setFundOpen(false)}
      />
      {/* [E4] accountButton L167-184: 계좌명·관리코드·accountId, fundAdviceType "2"(일임·자문) */}
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
