/**
 * 결재의견 창 (V02) — [승인]을 누르면 열려 의견을 적고 [결재]로 승인한다
 * AS-IS: myApp/client/vi/apr/Apr01_Edit_NoteMessage.java (111줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L22-35: 450×250 모달 "결재의견", 글상자 + editMessage(callback) L53-76: [결재][닫기], [결재] → note() → callback.execute(글) 뒤 hide()
 *   (setMessage L37-50 = 읽기 보기, addMessage L78~ = [저장] 모드는 다른 화면용 — 이 단계에서는 쓰지 않는다)
 * 편집 폼 모달 원칙: EditModal (라벨 없는 글상자 하나)
 * 스타일: MF (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useEffect, useState } from 'react';
import { Input, Space } from 'antd';
import { Button } from '@/components/button';
import { EditModal } from '@/components/form/EditForm';

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
    <EditModal
      open={open}
      title="결재의견"
      width={450}
      onCancel={onClose}
      destroyOnHidden
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
    </EditModal>
  );
};
