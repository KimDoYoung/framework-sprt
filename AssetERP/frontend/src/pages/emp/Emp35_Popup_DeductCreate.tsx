/**
 * 급여공제 생성 팝업 (C01-3) — Emp35_TabPage_DeductDate [등록]에서 연다.
 * AS-IS: myApp/client/vi/emp/Emp35_Popup_DeductCreate.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 */
import React, { useState } from 'react';
import { DatePicker, message, Space } from 'antd';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Dayjs } from 'dayjs';
import { empApi } from '@/api/emp';
import { errorMessage } from '@/api/client';
import { Button } from '@/components/button';

interface Props {
  open: boolean;
  personId: number | undefined;
  onClose: () => void;
  /** AS-IS insert() 콜백: 목록 갱신 */
  onCreated: () => void;
}

export const Emp35_Popup_DeductCreate: React.FC<Props> = ({ open, personId, onClose, onCreated }) => {
  const [year, setYear] = useState<Dayjs | null>(null);
  const [saving, setSaving] = useState(false);

  // [E0] 생성자 → show(): 팝업 열릴 때 날짜 초기화
  const handleOpen = () => setYear(null);

  // [E1] updateButton[생성].Select (L59) → update() L88-106
  const update = async () => {
    if (!year) {
      message.warning('적용일은 필수입력 항목입니다');
      return;
    }
    if (!personId) return;
    setSaving(true);
    try {
      await empApi.createDeduct(personId, year.format('YYYY-MM-DD'));
      onCreated();
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '생성 실패'));
    } finally {
      setSaving(false);
    }
  };

  // [E2] closeButton[닫기].Select (L65) → hide()
  return (
    <LookupModal
      title="급여공제 생성"
      open={open}
      onCancel={onClose}
      afterOpenChange={v => { if (v) handleOpen(); }}
      footer={null}
      width={400}
      destroyOnClose
    >
      <Space direction="vertical" style={{ width: '100%', padding: '16px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 80, textAlign: 'right' }}>적용일</span>
          <DatePicker value={year} onChange={setYear} format="YYYY-MM-DD" style={{ flex: 1 }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 16 }}>
          <Button type="register" onClick={update} loading={saving}>생성</Button>
          <Button type="close" onClick={onClose}>닫기</Button>
        </div>
      </Space>
    </LookupModal>
  );
};
