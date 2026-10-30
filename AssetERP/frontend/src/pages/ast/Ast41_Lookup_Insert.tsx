/**
 * 투자한도/StopLoss 적용일 생성창 (W03) — Ast41_Lookup_InvestLimit 의 [생성]
 * AS-IS: myApp/client/vi/ast/Ast41_Lookup_Insert.java (95줄) — 함수 이름은 원본 메서드 이름 그대로
 * 적용일(payDate) 하나 + [생성][닫기]. 250×150 → 편집창 규격(11 §4a)
 */
import React, { useEffect, useState } from 'react';
import { DatePicker, message } from 'antd';
import type { Dayjs } from 'dayjs';
import { errorMessage } from '@/api/client';
import { astApi } from '@/api/ast';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';

interface Props {
  open: boolean;
  onCreated: () => void;
  onClose: () => void;
}

export const Ast41_Lookup_Insert: React.FC<Props> = ({ open, onCreated, onClose }) => {
  const [payDate, setPayDate] = useState<Dayjs | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (open) setPayDate(null); }, [open]);

  // [E1] updateButton[생성].Select (L49) → update() L68-86
  const update = async () => {
    if (!payDate) {
      message.warning('적용일은 필수입력 항목입니다');
      return;
    }
    setSaving(true);
    try {
      await astApi.createInvestLimitDate(payDate.format('YYYY-MM-DD'));
      onCreated();
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '생성 실패'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <LookupModal
      open={open}
      title="생성"
      width={300}
      maskClosable={false}
      onCancel={onClose}
      styles={{
        header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 0 },
        footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 0, textAlign: 'center' },
      }}
      footer={[
        /* [E1] */ <Button key="ok" type="generate" loading={saving} onClick={update}>생성</Button>,
        /* [E2] closeButton[닫기].Select (L55) → hide() */ <Button key="close" type="close" onClick={onClose}>닫기</Button>,
      ]}
    >
      <div style={{ padding: '12px 2px', display: 'flex', alignItems: 'center' }}>
        <span style={{ width: 60, textAlign: 'right', paddingRight: 10 }}>적용일</span>
        <DatePicker style={{ width: 150 }} value={payDate} onChange={setPayDate} format="YYYY-MM-DD" />
      </div>
    </LookupModal>
  );
};
