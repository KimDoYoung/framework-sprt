/**
 * 문서의견 창 (V01) — 결재선의 의견 아이콘에서 연다
 * AS-IS: myApp/client/vi/apr/Apr01_Edit_Message.java (52줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L19-32: 450×250 모달 "문서의견", 읽기 전용 글상자 + setMessage(msg) L34-47: [닫기]
 * 편집 폼 모달 원칙: EditModal (라벨 없는 글상자 하나)
 * 스타일: MF (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React from 'react';
import { Input } from 'antd';
import { Button } from '@/components/button';
import { EditModal } from '@/components/form/EditForm';

interface Props {
  /** 값이 있으면(빈 글자 포함) 열림 — AS-IS setMessage(msg) */
  message: string | null;
  onClose: () => void;
}

export const Apr01_Edit_Message: React.FC<Props> = ({ message, onClose }) => (
  <EditModal
    open={message != null}
    title="문서의견"
    width={450}
    onCancel={onClose}
    destroyOnHidden
    focusFirst={false}
    footer={
      <div style={{ textAlign: 'center' }}>
        {/* [E0] closeButton[닫기].Select (L37) → hide() */}
        <Button type="close" onClick={onClose}>닫기</Button>
      </div>
    }
  >
    <Input.TextArea value={message ?? ''} readOnly rows={7} style={{ resize: 'none' }} />
  </EditModal>
);
