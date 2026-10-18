/**
 * 비고 (E17) — Dcr30_TabPage_Company dcrGrid의 비고 아이콘에서 연다.
 * AS-IS: myApp/client/vi/dcr/Dcr30_Lookup_LinkNote.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open() L37-72: 1000×500 모달 "비고", MyTextArea 하나 + 저장·닫기
 */
import React, { useEffect, useState } from 'react';
import { Input, message, Modal, Space } from 'antd';
import { dcrApi } from '@/api/dcr';
import { errorMessage } from '@/api/client';
import { DcrLink } from '@/types/dcr';
import { Button } from '@/components/button';

interface Props {
  /** open(linkModel, callback) L37 — 값이 있으면 열린다 */
  link: DcrLink | null;
  /** 저장이 끝났을 때(AS-IS callback.execute(linkModel)) */
  onSaved: () => void;
  onClose: () => void;
}

export const Dcr30_Lookup_LinkNote: React.FC<Props> = ({ link, onSaved, onClose }) => {
  const [note, setNote] = useState('');

  useEffect(() => { if (link) setNote(link.note ?? ''); }, [link]);

  // [E1] updateButton[저장].Select (L55) → update() L74-88: dcr.Dcr30_Link.updateNote 뒤 callback·hide
  const update = async () => {
    if (!link) return;
    try {
      await dcrApi.updateLinkNote(link.linkId, note);
      onSaved();
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  return (
    <Modal
      open={link != null}
      title="비고"
      width={1000}
      maskClosable={false}
      onCancel={onClose}
      destroyOnClose
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={update}>저장</Button>
            {/* [E2] closeButton[닫기].Select (L61) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <Input.TextArea value={note} onChange={e => setNote(e.target.value)} style={{ height: 360, resize: 'none' }} />
    </Modal>
  );
};
