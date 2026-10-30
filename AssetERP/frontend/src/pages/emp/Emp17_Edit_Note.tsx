/**
 * 알림 등록 창 (U05) — Emp17_Tab_BenefitManager의 위 그리드 [알림] 아이콘에서 연다
 * AS-IS: myApp/client/vi/emp/Emp17_Edit_Note.java (139줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L46-63: 모달 450×250 "알림 등록", getEditor() L86-95: 라벨 폭 10, 알림 내용 TextArea 한 칸, 아래 가운데 [저장][문자발송][닫기]
 */
import React, { useEffect, useState } from 'react';
import { Input, message, Modal, Space } from 'antd';
import { empBenefitApi } from '@/api/emp';
import { errorMessage } from '@/api/client';
import { Benefit } from '@/types/emp';
import { Button } from '@/components/button';

interface Props {
  /** 알림을 쓸 신청 — null이면 닫힘 (AS-IS open(selectModel)) */
  model: Benefit | null;
  onClose: () => void;
}

export const Emp17_Edit_Note: React.FC<Props> = ({ model, onClose }) => {
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  useEffect(() => setNote(model?.note ?? ''), [model]);
  if (!model) return null;
  // [E0] 화면 열림 (생성자 L46-63) → settings(), show() / open(selectModel) L39-44: 고른 신청의 알림 내용을 칸에 채운다

  // [E1] updateButton[저장].Select (L66) → update() L97-115: 알림내용이 비어 있으면 안내, 저장 후 "정상적으로 저장되었습니다"
  const update = async () => {
    if (note === '') { message.warning('알림내용은 필수입력 항목입니다'); return; }
    setSaving(true);
    try {
      await empBenefitApi.updateNote(model.benefitId, note);
      message.success('정상적으로 저장되었습니다');
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  // [E2] sendButton[문자발송].Select (L78) → sendMessage() L117-134: 신청한 사원 휴대폰으로 문자, "정상적으로 발송되었습니다"
  const sendMessage = async () => {
    if (note === '') { message.warning('알림내용은 필수입력 항목입니다'); return; }
    setSending(true);
    try {
      await empBenefitApi.sendMessage(model.benefitId, note);
      message.success('정상적으로 발송되었습니다');
    } catch (err) {
      message.error(errorMessage(err, '발송 실패'));
    } finally {
      setSending(false);
    }
  };

  return (
    <Modal
      open
      title="알림 등록"
      width={450}
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
            <Button type="send" onClick={sendMessage} loading={sending}>문자발송</Button>
            {/* [E3] closeButton[닫기].Select (L72) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ padding: '12px 2px' }}>
        <Input.TextArea rows={5} value={note} onChange={e => setNote(e.target.value)} />
      </div>
    </Modal>
  );
};
