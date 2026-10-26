/**
 * 공모주청약 등록·수정 창 (Q06). 본 화면 Fnd30_Tab_Opr의 [등록]·수정 아이콘, 신청내역 조회창 Fnd30_Lookup_DemandOprList의 등록 아이콘, Q04 공모주 일정조회의 [청약 운용지시] 아이콘이 연다
 * AS-IS: myApp/client/vi/fnd/Fnd30_Edit_Opr.java (335줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 열기 4가지: insert(callback) L73 "청약정보 등록" 590×470 / insert(oprModel, callback) L94 "청약정보 등록" 590×510 + 등록건수 / demandOprInsert(oprModel, callback) L113 "청약정보 등록"(수요예측 신청내역에서: 종목명·확약기간·납입일을 가져오고 저장하면 펀드별 배정도 수요예측 비율로 함께 만든다) / edit L139 "청약정보 수정"
 * getEditor() L195-250: 청약일 230 · 납입일 230 / 종목 560 / 주간사 560 / 발행가 280 + 확약기간 280 / 수수료율 180 % / 총배정수량 280 / 비고 560×150 (· 등록건수 180), 라벨 폭 105, 아래 가운데 [저장][닫기]
 */
import React, { useEffect, useState } from 'react';
import { DatePicker, Input, InputNumber, message, Space, Typography } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { fndApi } from '@/api/fnd';
import { errorMessage } from '@/api/client';
import { OprDemandOffer, OprSub } from '@/types/fnd';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Sys15_Lookup_Corp } from '@/components/lookup/Sys15_Lookup_Corp';

const FORMAT = 'YYYY-MM-DD';
const fmtLong = (v: string | number | undefined) => (v == null || v === '' ? '' : `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','));
const parseNum = (v: string | undefined) => (v ?? '').replace(/,/g, '');

/** AS-IS Fnd30_OprModel 중 이 창이 쓰는 값 — insert(oprModel, callback)이 미리 채워 넘기는 것(Q04 Sch10_Tab_Ipo E10) */
export interface OprPreset {
  itemName?: string | null;
  payDate?: string | null;
}

export type OprTarget =
  | { mode: 'insert' }
  | { mode: 'insertWith'; preset: OprPreset }
  | { mode: 'demand'; offer: OprDemandOffer }
  | { mode: 'edit'; row: OprSub };

interface Props {
  target: OprTarget | null;
  /** callback.execute() — 저장이 끝난 뒤(창은 스스로 닫는다) */
  onSaved: () => void;
  onClose: () => void;
}

const Field: React.FC<{ label: string; width: number; children: React.ReactNode }> = ({ label, width, children }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', width }}>
    <Typography.Text style={{ width: 105, flex: 'none', lineHeight: '32px' }}>{label}</Typography.Text>
    <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
  </div>
);

interface Form {
  subscriptionDate: Dayjs | null;
  payDate: Dayjs | null;
  itemName: string;
  corpId: number | null;
  corpName: string;
  price: number | null;
  lockPeriod: string;
  feeRate: number | null;
  qty: number | null;
  note: string;
}

const empty = (): Form => ({ subscriptionDate: null, payDate: null, itemName: '', corpId: null, corpName: '', price: null, lockPeriod: '', feeRate: null, qty: null, note: '' });

const initialForm = (t: OprTarget): Form => {
  if (t.mode === 'insert') return empty();
  if (t.mode === 'insertWith') return { ...empty(), itemName: t.preset.itemName ?? '', payDate: t.preset.payDate ? dayjs(t.preset.payDate) : null };
  if (t.mode === 'demand') return { ...empty(), itemName: t.offer.itemName ?? '', lockPeriod: t.offer.lockPeriod ?? '', payDate: t.offer.schPayDate ? dayjs(t.offer.schPayDate) : null };
  const r = t.row;
  return { subscriptionDate: r.subscriptionDate ? dayjs(r.subscriptionDate) : null, payDate: r.payDate ? dayjs(r.payDate) : null, itemName: r.itemName ?? '',
    corpId: r.corpId ?? null, corpName: r.corpName ?? '', price: r.price ?? null, lockPeriod: r.lockPeriod ?? '', feeRate: r.feeRate ?? null, qty: r.qty ?? null, note: r.note ?? '' };
};

export const Fnd30_Edit_Opr: React.FC<Props> = ({ target, onSaved, onClose }) => {
  const [f, setF] = useState<Form>(empty());
  const [insertCount, setInsertCount] = useState<number | null>(1);
  const [saving, setSaving] = useState(false);
  const [corpOpen, setCorpOpen] = useState(false);
  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF(prev => ({ ...prev, [k]: v }));

  useEffect(() => {
    if (target) { setF(initialForm(target)); setInsertCount(1); }
  }, [target]);

  if (!target) return null;
  const multi = target.mode === 'insertWith';
  const title = target.mode === 'edit' ? '청약정보 수정' : '청약정보 등록';

  // 열기 4가지(L73-156) → settings(), show()
  // [E2] updateButton[저장].Select (L181) → update() L252-312
  const update = async () => {
    const blank = (v: string) => v.trim() === '';
    const warn = (msg: string) => { message.warning(msg); };
    if (!f.subscriptionDate) return warn('청약일은 필수작성 항목입니다');
    if (!f.payDate) return warn('납입일은 필수작성 항목입니다');
    if (blank(f.itemName)) return warn('종목은 필수작성 항목입니다');
    if (blank(f.corpName)) return warn('주간사는 필수선택 항목입니다');
    if (f.price == null) return warn('발행가는 필수작성 항목입니다');
    if (f.feeRate == null) return warn('수수료율은 필수작성 항목입니다');
    if (f.qty == null) return warn('총배정수량은 필수작성 항목입니다');
    const req = {
      subscriptionDate: f.subscriptionDate.format(FORMAT), payDate: f.payDate.format(FORMAT), itemName: f.itemName, corpId: f.corpId,
      price: f.price, feeRate: f.feeRate, qty: f.qty, lockPeriod: f.lockPeriod === '' ? null : f.lockPeriod, note: f.note === '' ? null : f.note,
    };
    setSaving(true);
    try {
      if (target.mode === 'edit') {
        await fndApi.updateSubscriptionOpr(target.row.oprId, req);
      } else {
        // insertCount > 1이면 multiUpdate(건수만큼), 아니면 modelUpdate 한 행. 수요예측 신청내역에서 열었으면 demandId로 펀드별 배정도 함께
        await fndApi.createSubscriptionOpr({ ...req, insertCount: multi ? (insertCount ?? 1) : 1, demandId: target.mode === 'demand' ? target.offer.oprId : null });
      }
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
      title={title}
      width={640}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={update} loading={saving}>저장</Button>
            {/* [E3] closeButton[닫기].Select (L187) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '10px 0' }}>
        <div style={{ display: 'flex', gap: 20 }}>
          <Field label="청약일 " width={230}>
            <DatePicker style={{ width: '100%' }} format={FORMAT} value={f.subscriptionDate} onChange={d => set('subscriptionDate', d)} />
          </Field>
          <Field label="납입일 " width={230}>
            <DatePicker style={{ width: '100%' }} format={FORMAT} value={f.payDate} onChange={d => set('payDate', d)} />
          </Field>
        </div>
        <Field label="종목 " width={560}>
          <Input value={f.itemName} onChange={e => set('itemName', e.target.value)} />
        </Field>
        <Field label="주간사 " width={560}>
          <LookupInput value={f.corpName} width={250} onOpen={() => setCorpOpen(true)} />
        </Field>
        <div style={{ display: 'flex', gap: 20 }}>
          <Field label="발행가 " width={280}>
            <InputNumber style={{ width: '100%' }} controls={false} precision={0} formatter={fmtLong} parser={parseNum as never}
              value={f.price} onChange={v => set('price', v == null ? null : Number(v))} />
          </Field>
          <Field label="확약기간 " width={280}>
            <Input value={f.lockPeriod} onChange={e => set('lockPeriod', e.target.value)} />
          </Field>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
          <Field label="수수료율 " width={180}>
            <InputNumber style={{ width: '100%' }} controls={false} value={f.feeRate} onChange={v => set('feeRate', v == null ? null : Number(v))} />
          </Field>
          <Typography.Text style={{ lineHeight: '32px' }}>%</Typography.Text>
        </div>
        <Field label="총배정수량 " width={280}>
          <InputNumber style={{ width: '100%' }} controls={false} precision={0} formatter={fmtLong} parser={parseNum as never}
            value={f.qty} onChange={v => set('qty', v == null ? null : Number(v))} />
        </Field>
        <Field label="비고 " width={560}>
          <Input.TextArea rows={5} value={f.note} onChange={e => set('note', e.target.value)} />
        </Field>
        {multi && (
          <Field label="등록건수 " width={180}>
            <InputNumber style={{ width: '100%' }} controls={false} precision={0} min={1} value={insertCount} onChange={v => setInsertCount(v == null ? null : Number(v))} />
          </Field>
        )}
      </div>
      {/* [E1] corpName[주간사].TriggerClick (L174) → openLookupOpr() L314-326: Sys15_Lookup_Corp.open("증권회사", true, …) — 고른 거래처의 이름·ID를 넣는다(선택안함은 그대로) */}
      <Sys15_Lookup_Corp
        open={corpOpen}
        regYn
        corpTypeName="증권회사"
        onResult={corp => { if (corp) setF(prev => ({ ...prev, corpName: corp.corpName ?? '', corpId: corp.corpId })); }}
        onClose={() => setCorpOpen(false)}
      />
    </LookupModal>
  );
};
