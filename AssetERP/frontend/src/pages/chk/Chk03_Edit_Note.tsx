/**
 * 비고 창 (R02) — Chk03_Tab_DailyListWrite 그리드의 비고 수정 아이콘에서 연다
 * AS-IS: myApp/client/vi/chk/Chk03_Edit_Note.java (106줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L50-70: 모달 "비고", note 입력(700×300, 여백 10), 아래 가운데 [저장]·[닫기]
 * EditModal 규격(11 §4a): 머리말 아래 선 · 푸터 위 선 · 본문 위아래 간격 12
 */
import React, { useRef, useState, useEffect } from 'react';
import { Input, message, Modal, Space } from 'antd';
import type { TextAreaRef } from 'antd/es/input/TextArea';
import { chkApi } from '@/api/chk';
import { errorMessage } from '@/api/client';
import { ChkDailyListWriteItem } from '@/types/chk';
import { Button } from '@/components/button';

interface Props {
  /** edit(checklistWriteModel, callback) L40-48 — 값이 있으면 열린다 */
  model: ChkDailyListWriteItem | null;
  /** callbackResult.execute(updateModel): 저장한 뒤 */
  onSaved: (model: ChkDailyListWriteItem) => void;
  onClose: () => void;
}

export const Chk03_Edit_Note: React.FC<Props> = ({ model, onSaved, onClose }) => {
  const [note, setNoteText] = useState('');
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<TextAreaRef>(null);

  useEffect(() => { if (model) setNoteText(model.note ?? ''); }, [model]);

  // [E1] updateButton[저장].Select (L73) → update() L87-101: chk.Chk03_DailyListWrite.modelUpdate → callbackResult.execute(updateModel) → hide()
  const update = async () => {
    if (!model) return;
    setSaving(true);
    try {
      const saved = await chkApi.updateDailyListWriteNote(model.dailyListWriteId, note);
      onSaved(saved);
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  // [E0] 화면 열림 (생성자 L50-70) → settings(), show() — 열릴 때마다 입력칸에 포커스(UX-05)
  return (
    <Modal
      open={!!model}
      title="비고"
      width={750}
      maskClosable={false}
      onCancel={onClose}
      afterOpenChange={open => { if (open) inputRef.current?.focus(); }}
      styles={{
        header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 0 },
        footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 0 },
      }}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={update} loading={saving}>저장</Button>
            {/* [E2] closeButton[닫기].Select (L79) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ padding: '12px 2px' }}>
        <Input.TextArea ref={inputRef} style={{ height: 300, resize: 'none' }} value={note} onChange={e => setNoteText(e.target.value)} />
      </div>
    </Modal>
  );
};
