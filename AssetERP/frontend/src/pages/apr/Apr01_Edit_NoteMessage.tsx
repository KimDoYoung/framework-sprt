/**
 * 결재의견 창 (V02) — [승인]을 누르면 열려 의견을 적고 [결재]로 승인한다
 * AS-IS: myApp/client/vi/apr/Apr01_Edit_NoteMessage.java (111줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L22-35: 450×250 모달 "결재의견", 글상자 + editMessage(callback) L53-76: [결재][닫기], [결재] → note() → callback.execute(글) 뒤 hide()
 *   (setMessage L37-50 = 읽기 보기, addMessage L78~ = [저장] 모드는 다른 화면용 — 이 단계에서는 쓰지 않는다)
 * 조회창 규격(11a): LookupModal, 머리 아래 선·푸터 위 선
 */
import React, { useEffect, useState } from 'react';
import { Input, Space } from 'antd';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';

interface Props {
  open: boolean;
  /** [결재]의 callback.execute(noteMessage) */
  onSubmit: (message: string) => void;
  onClose: () => void;
}

export const Apr01_Edit_NoteMessage: React.FC<Props> = ({ open, onSubmit, onClose }) => {
  const [text, setText] = useState('');
  useEffect(() => { if (open) setText(''); }, [open]);

  return (
    <LookupModal
      open={open}
      title="결재의견"
      width={450}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      styles={{ header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 12 } }}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E0] noteButton[결재].Select (L58) → note() → callback.execute(글), hide() */}
            <Button type="save" onClick={() => { onSubmit(text); }}>결재</Button>
            {/* [E1] closeButton[닫기].Select (L67) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <Input.TextArea value={text} onChange={e => setText(e.target.value)} rows={7} style={{ resize: 'none' }} />
    </LookupModal>
  );
};
