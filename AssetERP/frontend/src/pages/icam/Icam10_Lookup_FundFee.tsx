/**
 * 펀드보수 발생내역 수정 창 (X23) — Icam10_Tab_OfficeMngFee 그리드 행 더블클릭에서 연다
 * AS-IS: myApp/client/vi/icam/Icam10_Lookup_FundFee.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open() L53-125: 모달 "펀드보수 발생내역 수정" 500×300, 라벨 폭 100, 운용사(코드·이름) · 펀드(코드·이름) · 적요 · 발생보수(통화 + 금액), 아래 가운데 저장·닫기
 * 운용사·펀드·적요·통화는 읽기 전용(L60-65), 금액만 고친다(포맷 #,###.######)
 * 편집창 규격: 11 §4a (EditModal)
 */
import React, { useEffect, useState } from 'react';
import { InputNumber, Input, message, Modal, Space, Typography } from 'antd';
import { icamApi } from '@/api/icam';
import { errorMessage } from '@/api/client';
import { IcamFee } from '@/types/icam';
import { Button } from '@/components/button';

interface Props {
  /** 수정할 발생보수 행 — null이면 닫힘 */
  model: IcamFee | null;
  onClose: () => void;
  /** AS-IS callback.execute(feeModel): 저장한 행 (그리드 store.update) */
  onDone: (saved: IcamFee) => void;
}

/** 라벨 폭 100 (form.setLabelWidth(100)) */
const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0 }}>
    <Typography.Text style={{ width: 100, flex: 'none', lineHeight: '32px', textAlign: 'right', paddingRight: 10 }}>{label}</Typography.Text>
    <div style={{ flex: 1, minWidth: 0, display: 'flex', gap: 8 }}>{children}</div>
  </div>
);

export const Icam10_Lookup_FundFee: React.FC<Props> = ({ model, onClose, onDone }) => {
  const [fee, setFee] = useState<number | null>(model?.fee ?? null);
  const [saving, setSaving] = useState(false);
  useEffect(() => setFee(model?.fee ?? null), [model]);
  if (!model) return null;

  // [E1] updateButton[저장].Select (L108) → update() L127-150: icam.Icam10_Fee.updateFee(feeModel) → "정상정으로 수행되었습니다." → callback.execute(feeModel)
  const update = async () => {
    setSaving(true);
    try {
      await icamApi.updateFee(model.feeId, fee);
      message.success('정상정으로 수행되었습니다.');
      onDone({ ...model, fee });
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open
      title="펀드보수 발생내역 수정"
      width={560}
      maskClosable={false}
      onCancel={onClose}
      styles={{
        header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 0 },
        footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 0 },
      }}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={update} loading={saving}>저장</Button>
            {/* [E2] closeButton[닫기].Select (L114) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '12px 2px' }}>
        <Field label="운용사">
          <Input disabled style={{ width: 100 }} value={model.icamCompanyCode ?? ''} />
          <Input disabled style={{ flex: 1 }} value={model.icamCompanyName ?? ''} />
        </Field>
        <Field label="펀드">
          <Input disabled style={{ width: 100 }} value={model.fundCode ?? ''} />
          <Input disabled style={{ flex: 1 }} value={model.fundName ?? ''} />
        </Field>
        <Field label="적요"><Input disabled value={model.rmkName ?? ''} /></Field>
        <Field label="발생보수">
          <Input disabled style={{ width: 100 }} value={model.curCode ?? ''} />
          {/* fee.setFormat(#,###.######), this.setFocusWidget(fee) */}
          <InputNumber<number> autoFocus style={{ width: 150 }} precision={6} value={fee} stringMode={false}
            formatter={v => {
              if (v == null) return '';
              const [int, dec] = String(v).split('.');
              const decimals = (dec ?? '').replace(/0+$/, '');
              return int.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (decimals ? `.${decimals}` : '');
            }}
            parser={v => Number((v ?? '').replace(/,/g, ''))}
            onChange={v => setFee(v == null ? null : Number(v))} />
        </Field>
      </div>
    </Modal>
  );
};
