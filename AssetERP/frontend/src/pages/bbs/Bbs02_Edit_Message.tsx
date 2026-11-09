/**
 * 문자내용 창 (Z04) — Bbs02_Tab_NoticeAdmin 그리드의 "문자발송" 아이콘이 연다 (발송할 문구를 고친다)
 * AS-IS: myApp/client/vi/bbs/Bbs02_Edit_Message.java (68줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L21-34: 모달 "문자내용" 450×250, 문구 TextArea 하나 / open(msg, callback) L36-63: 아래 가운데 [발송][취소]
 * 스타일: MF (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useEffect, useState } from 'react';
import { Input, Space, message as toast } from 'antd';
import { Button } from '@/components/button';
import { EditModal } from '@/components/form/EditForm';

interface Props {
  /** 처음 문구 — 값이 있으면 열린다 (AS-IS open(msg, callback)) */
  message: string | null;
  /** [발송] → callback.execute(문구) 뒤 hide() */
  onSend: (message: string) => void;
  onClose: () => void;
}

export const Bbs02_Edit_Message: React.FC<Props> = ({ message, onSend, onClose }) => {
  const [text, setText] = useState('');
  // [E0] 화면 열림 (생성자 L21-34) → 초기화: 처음 문구를 넣는다
  useEffect(() => setText(message ?? ''), [message]);

  // [E1] sendButton[발송].Select (L40): 내용이 없으면 "내용을 입력해주세요", 있으면 callback(문구) 뒤 hide()
  const send = () => {
    if (text.length === 0) { toast.warning('내용을 입력해주세요'); return; }
    onSend(text);
    onClose();
  };

  return (
    <EditModal
      open={message != null}
      title="문자내용"
      width={450}
      onCancel={onClose}
      destroyOnClose
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="send" onClick={send}>발송</Button>
            {/* [E2] closeButton[취소].Select (L53) → hide() */}
            <Button type="cancel" onClick={onClose}>취소</Button>
          </Space>
        </div>
      }
    >
      <Input.TextArea rows={7} value={text} onChange={e => setText(e.target.value)} />
    </EditModal>
  );
};
