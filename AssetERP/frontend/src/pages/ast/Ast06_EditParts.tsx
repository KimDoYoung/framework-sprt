/**
 * 세금/4대보험 편집창 두 개(Ast06_Lookup_TrTax·Ast06_Lookup_Tr4Insure)가 같이 쓰는 입력 조각 (U04)
 * AS-IS: 두 클래스에서 같은 모양으로 반복되는 FieldLabel · LongField(#,###) · 결제구분(Radio 둘 + depositName 트리거) · 분개 안내 라벨
 */
import React, { useState } from 'react';
import { InputNumber, Radio, Typography } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Ast01_Lookup_CorpAccount } from './Ast01_Lookup_CorpAccount';

/** 라벨 오른쪽 정렬 + 고정 폭 (EditModal 규격, 11 §4a) */
export const FieldRow: React.FC<{ label: string; labelWidth: number; width?: number | string; children: React.ReactNode }> = ({ label, labelWidth, width = '100%', children }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', width, flex: width === '100%' ? undefined : 'none' }}>
    <Typography.Text style={{ width: labelWidth, flex: 'none', lineHeight: '32px', textAlign: 'right', paddingRight: 10 }}>{label}</Typography.Text>
    <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
  </div>
);

/** 테두리 박스 한 묶음 (AS-IS VerticalLayoutContainer.setBorders(true) + 여백 17/15/17/5) */
export const Box: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ border: '1px solid #d9d9d9', padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 10, boxSizing: 'border-box' }}>{children}</div>
);

/** AS-IS LongField + setFormat("#,###") */
export const LongInput: React.FC<{ value: number | null | undefined; disabled?: boolean; onChange: (v: number | null) => void }> = ({ value, disabled, onChange }) => (
  <InputNumber style={{ width: '100%' }} controls={false} precision={0} disabled={disabled} value={value ?? null}
    formatter={v => (v == null ? '' : String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ','))}
    parser={v => Number((v ?? '').replace(/,/g, ''))}
    onChange={v => onChange(v == null || Number.isNaN(Number(v)) ? null : Math.trunc(Number(v)))} />
);

/** 분개 안내 라벨 jnlMessage (거래변경에서만) */
export const JournalNotice: React.FC = () => (
  <div style={{ fontSize: 13, fontWeight: 'bold', color: '#DD5E5E', padding: '5px 0 0 5px' }}> ※ 분개는 자동반영 하지 않습니다. 분개재생성 버튼을 클릭하여 재생성해주세요.</div>
);

interface SettleProps {
  /** 거래일자 — 계좌선택 창의 기준일 */
  date: Dayjs | null;
  settleMngYn: boolean;
  depositName: string | null;
  onChange: (v: { settleMngYn: boolean; depositId: number | null; depositName: string | null }) => void;
}

/**
 * 결제구분 (setting() L193-212, depositName.TriggerClick L226-244):
 * [미수/미지급][예금] 라디오 — 바꾸면 계좌를 비우고, 미수/미지급이면 계좌 칸을 막는다. 계좌 칸을 누르면 Ast01_Lookup_CorpAccount.open(date, "NOT")
 * — 고른 계좌가 없으면(선택안함) 비운다
 */
export const SettleMngField: React.FC<SettleProps> = ({ date, settleMngYn, depositName, onChange }) => {
  const [lookupOpen, setLookupOpen] = useState(false);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <Radio.Group value={settleMngYn ? 'true' : 'false'} onChange={e => onChange({ settleMngYn: e.target.value === 'true', depositId: null, depositName: null })}>
        <Radio value="true">미수/미지급</Radio>
        <Radio value="false">예금</Radio>
      </Radio.Group>
      <LookupInput value={depositName ?? ''} width={208} disabled={settleMngYn} onOpen={() => setLookupOpen(true)}
        onClear={() => onChange({ settleMngYn, depositId: null, depositName: null })} />
      <Ast01_Lookup_CorpAccount open={lookupOpen} stdDate={date ?? dayjs()} mode="NOT"
        onResult={acc => { setLookupOpen(false); onChange({ settleMngYn, depositId: acc?.classTreeId ?? null, depositName: acc?.classTreeName ?? null }); }}
        onClose={() => setLookupOpen(false)} />
    </div>
  );
};
