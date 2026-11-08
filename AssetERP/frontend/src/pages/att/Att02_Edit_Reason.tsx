/**
 * 지각·조기퇴근 사유 등록 창 (EE50) — Att02_Lookup_Commute가 지각·조기퇴근·외근 후 퇴근일 때 연다
 * AS-IS: myApp/client/vi/att/Att02_Edit_Reason.java (91줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L45-56: 400×200, 닫기(X) 없음, 사유 입력(TextArea) + 아래 가운데 [제출]. edit() L30-43: 머리말 "지각 사유등록" / "조기퇴근 / 외근 후 퇴근 사유등록"
 * 스타일: MF (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useEffect, useState } from 'react';
import { Input, Modal, message } from 'antd';
import { attApi } from '@/api/att';
import { errorMessage } from '@/api/client';
import { AttMyCommute } from '@/types/att';
import { Button } from '@/components/button';

export interface ReasonTarget {
  /** 'in' 지각 / 'out' 조기퇴근·외근 후 퇴근 */
  actionCode: 'in' | 'out';
  commute: AttMyCommute;
}

interface Props {
  /** null이면 닫힘 */
  target: ReasonTarget | null;
  /** AS-IS callback.execute(): 제출한 뒤 */
  onDone?: () => void;
  onClose: () => void;
}

export const Att02_Edit_Reason: React.FC<Props> = ({ target, onDone, onClose }) => {
  const [reason, setReason] = useState('');
  const [saving, setSaving] = useState(false);

  // [E0] 화면 열림 (생성자 L45-56) → show()
  useEffect(() => { if (target) setReason(''); }, [target]);

  // [E1] updateButton[제출].Select (L59) → update() L67-86
  const update = async () => {
    if (!target) return;
    if (!reason.trim()) { message.warning('사유를 입력해주세요'); return; }
    setSaving(true);
    try {
      await attApi.updateMyCommuteReason(target.commute.commuteId, target.actionCode, reason);
      onDone?.();
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={target != null}
      title={target?.actionCode === 'in' ? '지각 사유등록' : '조기퇴근 / 외근 후 퇴근 사유등록'}
      width={400}
      closable={false}
      keyboard={false}
      maskClosable={false}
      styles={{
        header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 0 },
        footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 0 },
      }}
      footer={<div style={{ textAlign: 'center' }}><Button type="save" onClick={update} loading={saving}>제출</Button></div>}
    >
      <div style={{ padding: '12px 2px' }}>
        <Input.TextArea rows={4} value={reason} onChange={e => setReason(e.target.value)} autoFocus />
      </div>
    </Modal>
  );
};
