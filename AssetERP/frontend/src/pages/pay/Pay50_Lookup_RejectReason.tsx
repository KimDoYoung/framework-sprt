/**
 * 반려사유 창 (U03) — Pay50_Tab_ExpenseManager의 [반려]가 연다
 * AS-IS: myApp/client/vi/pay/Pay50_Lookup_RejectReason.java (107줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L30-51: 모달 500×350 "반려사유", 글 입력칸 하나(490×250) + [저장][닫기]. open(callback) L53-56 / edit(model, callback) L58-62(사유를 채워 열기) / view(model, callback) L64-71(읽기 전용, [저장] 숨김)
 * UX보강(10): 조회창(UX-05 — 열면 입력칸에 커서)
 */
import React, { useEffect, useState } from 'react';
import { Input, message, Space } from 'antd';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';

export type RejectReasonMode = 'open' | 'edit' | 'view';

interface Props {
  open: boolean;
  /** open = 새로 쓰기(닫기 = 취소 → onResult(null)), edit = 사유를 채워 열기, view = 읽기 전용 */
  mode: RejectReasonMode;
  /** edit·view에서 채워 보여 줄 반려사유 */
  value?: string | null;
  /** callback.execute(reason): [저장]이면 사유, open 모드의 [닫기]이면 null */
  onResult?: (reason: string | null) => void;
  onClose: () => void;
}

export const Pay50_Lookup_RejectReason: React.FC<Props> = ({ open, mode, value, onResult, onClose }) => {
  const [note, setNote] = useState('');

  // [E0] 화면 열림 (생성자 L30-51) → settings(), show() — 열 때마다 모드에 맞춰 사유를 채운다
  useEffect(() => {
    if (open) setNote(mode === 'open' ? '' : value ?? '');
  }, [open, mode, value]);

  // [E1] updateButton[저장].Select (L74) → update() L93-102: 사유가 비면 "사유를 입력하세요"
  const update = () => {
    if (note.trim() === '') {
      message.warning('사유를 입력하세요');
      return;
    }
    onResult?.(note);
    onClose();
  };

  // [E2] closeButton[닫기].Select (L80) → edit·view는 hide(), open은 callback(null) 뒤 hide()
  const close = () => {
    if (mode === 'open') onResult?.(null);
    onClose();
  };

  return (
    <LookupModal open={open} title="반려사유" width={500} maskClosable={false} onCancel={onClose} destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {mode !== 'view' && <Button type="save" onClick={update}>저장</Button>}
            <Button type="close" onClick={close}>닫기</Button>
          </Space>
        </div>
      }
    >
      <Input.TextArea style={{ height: 250, resize: 'none' }} value={note} readOnly={mode === 'view'} onChange={e => setNote(e.target.value)} />
    </LookupModal>
  );
};
