/**
 * 반려사유 창 (V02) — [반려]를 누르면 열려 사유를 적고 [반려]로 반려한다 (사유를 안 적으면 서버가 "반려사유 미입력"을 남긴다)
 * AS-IS: myApp/client/vi/apr/Apr01_Edit_RejectMessage.java (84줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L22-35: 450×250 모달 "반려사유", 글상자 + editMessage(callback) L52-74: [반려][닫기], [반려] → reject() L76-79 → callback.execute(글) 뒤 hide()
 * 조회창 규격(11a): LookupModal, 머리 아래 선·푸터 위 선
 */
import React, { useEffect, useState } from 'react';
import { Input, Space } from 'antd';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';

interface Props {
  open: boolean;
  /** [반려]의 callback.execute(rejectMessage) */
  onSubmit: (message: string) => void;
  onClose: () => void;
}

export const Apr01_Edit_RejectMessage: React.FC<Props> = ({ open, onSubmit, onClose }) => {
  const [text, setText] = useState('');
  useEffect(() => { if (open) setText(''); }, [open]);

  return (
    <LookupModal
      open={open}
      title="반려사유"
      width={450}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      styles={{ header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 12 } }}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E0] rejectButton[반려].Select (L56) → reject() L76-79 → callback.execute(글), hide() */}
            <Button type="cancel" onClick={() => { onSubmit(text); }}>반려</Button>
            {/* [E1] closeButton[닫기].Select (L65) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <Input.TextArea value={text} onChange={e => setText(e.target.value)} rows={7} style={{ resize: 'none' }} />
    </LookupModal>
  );
};
