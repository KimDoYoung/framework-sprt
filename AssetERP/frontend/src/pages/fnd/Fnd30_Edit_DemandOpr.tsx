/**
 * 수요예측 등록·수정 창 (Q05). 본 화면 Fnd30_Tab_DemandOpr의 [등록]·수정 아이콘과 Q04 공모주 일정조회의 [수요예측 참여] 아이콘이 연다
 * AS-IS: myApp/client/vi/fnd/Fnd30_Edit_DemandOpr.java (332줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 열기 4가지: insert(callback) L64 "수요예측 등록" 590×510 / insert(oprModel, callback) L85 "수요예측정보 등록" 590×550 + 등록건수 / edit L104 "수요예측 수정" 590×550 + 참여취소 / edit2 L123 같은 창을 읽기 전용으로(신청일~확약기간을 잠그고 비고·참여취소만)
 * getEditor() L189-253: 신청일 230 · 종목명 560 · 주간사 560 · 수요예측기간 280 + 시장구분 280 · 공모가밴드 280 · 신청가격 280 + ☐ 확정공모가액 -10% 변동수용 · 확약기간 280 · 비고 560×150 (· 등록건수 180 · 참여취소 180), 라벨 폭 105, 아래 가운데 [저장][닫기]
 */
import React, { useEffect, useState } from 'react';
import { Checkbox, DatePicker, Input, InputNumber, message, Space, Typography } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { fndApi } from '@/api/fnd';
import { errorMessage } from '@/api/client';
import { OprDemand } from '@/types/fnd';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';

const FORMAT = 'YYYY-MM-DD';
const fmtLong = (v: string | number | undefined) => (v == null || v === '' ? '' : `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','));
const parseNum = (v: string | undefined) => (v ?? '').replace(/,/g, '');

/** AS-IS Fnd30_OprModel 중 이 창이 쓰는 값 — insert(oprModel, callback)이 미리 채워 넘기는 것(Q04 Sch10_Tab_Ipo E9) */
export interface DemandOprPreset {
  demandDate?: string | null;
  payDate?: string | null;
  itemName?: string | null;
  leadManager?: string | null;
  demandPeriod?: string | null;
  market?: string | null;
  priceBracket?: string | null;
  priceAcceptYn?: boolean;
}

export type DemandOprTarget =
  | { mode: 'insert' }
  | { mode: 'insertWith'; preset: DemandOprPreset }
  | { mode: 'edit' | 'edit2'; row: OprDemand };

interface Props {
  target: DemandOprTarget | null;
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
  demandDate: Dayjs | null;
  itemName: string;
  leadManager: string;
  demandPeriod: string;
  market: string;
  priceBracket: string;
  price: number | null;
  priceAcceptYn: boolean;
  lockPeriod: string;
  note: string;
  cancelYn: boolean;
}

const empty = (): Form => ({ demandDate: null, itemName: '', leadManager: '', demandPeriod: '', market: '', priceBracket: '', price: null, priceAcceptYn: false, lockPeriod: '', note: '', cancelYn: false });

const initialForm = (t: DemandOprTarget): Form => {
  if (t.mode === 'insert') return empty();
  if (t.mode === 'insertWith') {
    const p = t.preset;
    return { ...empty(), demandDate: p.demandDate ? dayjs(p.demandDate) : null, itemName: p.itemName ?? '', leadManager: p.leadManager ?? '', demandPeriod: p.demandPeriod ?? '',
      market: p.market ?? '', priceBracket: p.priceBracket ?? '', priceAcceptYn: p.priceAcceptYn ?? false };
  }
  const r = t.row;
  return { demandDate: r.demandDate ? dayjs(r.demandDate) : null, itemName: r.itemName ?? '', leadManager: r.leadManager ?? '', demandPeriod: r.demandPeriod ?? '', market: r.market ?? '',
    priceBracket: r.priceBracket ?? '', price: r.price ?? null, priceAcceptYn: r.priceAcceptYn ?? false, lockPeriod: r.lockPeriod ?? '', note: r.note ?? '', cancelYn: r.cancelYn ?? false };
};

export const Fnd30_Edit_DemandOpr: React.FC<Props> = ({ target, onSaved, onClose }) => {
  const [f, setF] = useState<Form>(empty());
  const [insertCount, setInsertCount] = useState<number | null>(1);
  const [saving, setSaving] = useState(false);
  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF(prev => ({ ...prev, [k]: v }));

  useEffect(() => {
    if (target) { setF(initialForm(target)); setInsertCount(1); }
  }, [target]);

  if (!target) return null;
  const multi = target.mode === 'insertWith';
  const isEdit = target.mode === 'edit' || target.mode === 'edit2';
  // setUnabled() L177-187: edit2는 신청일~확약기간을 잠근다(비고·참여취소만 고친다)
  const locked = target.mode === 'edit2';
  const title = target.mode === 'insert' ? '수요예측 등록' : multi ? '수요예측정보 등록' : '수요예측 수정';

  // [E1] updateButton[저장].Select (L163) → update() L256-319
  const update = async () => {
    const blank = (v: string) => v.trim() === '';
    const warn = (msg: string) => { message.warning(msg); };
    if (!f.demandDate) return warn('신청일은 필수작성 항목입니다');
    if (blank(f.itemName)) return warn('종목명은 필수작성 항목입니다');
    if (blank(f.leadManager)) return warn('주간사는 필수선택 항목입니다');
    if (blank(f.demandPeriod)) return warn('수요예측기간은 필수작성 항목입니다');
    if (blank(f.market)) return warn('시장구분은 필수작성 항목입니다');
    if (blank(f.priceBracket)) return warn('공모가밴드은 필수작성 항목입니다');
    if (f.price == null) return warn('신청가격은 필수작성 항목입니다');
    if (blank(f.lockPeriod)) return warn('확약기간은 필수작성 항목입니다');
    const req = {
      demandDate: f.demandDate.format(FORMAT), itemName: f.itemName, leadManager: f.leadManager, demandPeriod: f.demandPeriod, market: f.market,
      priceBracket: f.priceBracket, price: f.price, priceAcceptYn: f.priceAcceptYn, lockPeriod: f.lockPeriod, note: f.note === '' ? null : f.note, cancelYn: f.cancelYn,
    };
    setSaving(true);
    try {
      if (target.mode === 'edit' || target.mode === 'edit2') {
        await fndApi.updateDemandOpr(target.row.oprId, req);
      } else {
        // insertCount > 1이면 multiUpdate(건수만큼), 아니면 modelUpdate 한 행
        await fndApi.createDemandOpr({ ...req, insertCount: multi ? (insertCount ?? 1) : 1, payDate: target.mode === 'insertWith' ? target.preset.payDate ?? null : null });
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
            {/* [E2] closeButton[닫기].Select (L169) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '10px 0' }}>
        <Field label="신청일 " width={230}>
          <DatePicker style={{ width: '100%' }} format={FORMAT} disabled={locked} value={f.demandDate} onChange={d => set('demandDate', d)} />
        </Field>
        <Field label="종목명 " width={560}>
          <Input disabled={locked} value={f.itemName} onChange={e => set('itemName', e.target.value)} />
        </Field>
        <Field label="주간사 " width={560}>
          <Input disabled={locked} value={f.leadManager} onChange={e => set('leadManager', e.target.value)} />
        </Field>
        <div style={{ display: 'flex', gap: 20 }}>
          <Field label="수요예측기간 " width={280}>
            <Input disabled={locked} value={f.demandPeriod} onChange={e => set('demandPeriod', e.target.value)} />
          </Field>
          <Field label="시장구분 " width={280}>
            <Input disabled={locked} value={f.market} onChange={e => set('market', e.target.value)} />
          </Field>
        </div>
        <Field label="공모가밴드 " width={280}>
          <Input disabled={locked} value={f.priceBracket} onChange={e => set('priceBracket', e.target.value)} />
        </Field>
        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
          <Field label="신청가격 " width={280}>
            <InputNumber style={{ width: '100%' }} controls={false} precision={0} formatter={fmtLong} parser={parseNum as never} disabled={locked}
              value={f.price} onChange={v => set('price', v == null ? null : Number(v))} />
          </Field>
          <Checkbox disabled={locked} checked={f.priceAcceptYn} onChange={e => set('priceAcceptYn', e.target.checked)} style={{ lineHeight: '32px', color: '#000', fontSize: 12 }}>확정공모가액 -10% 변동수용</Checkbox>
        </div>
        <Field label="확약기간 " width={280}>
          <Input disabled={locked} value={f.lockPeriod} onChange={e => set('lockPeriod', e.target.value)} />
        </Field>
        <Field label="비고 " width={560}>
          <Input.TextArea rows={5} value={f.note} onChange={e => set('note', e.target.value)} />
        </Field>
        {multi && (
          <Field label="등록건수 " width={180}>
            <InputNumber style={{ width: '100%' }} controls={false} precision={0} min={1} value={insertCount} onChange={v => setInsertCount(v == null ? null : Number(v))} />
          </Field>
        )}
        {isEdit && (
          <Field label="참여취소 " width={180}>
            <Checkbox checked={f.cancelYn} onChange={e => set('cancelYn', e.target.checked)} style={{ lineHeight: '32px' }} />
          </Field>
        )}
      </div>
    </LookupModal>
  );
};
