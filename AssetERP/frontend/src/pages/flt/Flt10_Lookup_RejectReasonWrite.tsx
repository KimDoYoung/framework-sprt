/**
 * 승인 및 반려사유 (J02) — 준법감시 > 11. 임직원매매(준감인) > 사전승인 #1128 의 사유 입력·수정 창
 * AS-IS: myApp/client/vi/flt/Flt10_Lookup_RejectReasonWrite.java(141줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L39-60: 모달 500×350 "승인 및 반려사유", 사유 입력칸 490×250 + [저장][취소]
 * open(statusCode, callback) L62-72: 제목 "승인사유"('20') / "반려사유"('30'), [저장] = 입력한 사유를 callback으로 돌려주고 닫는다
 * edit(trModel, callback) L74-80: 그 행의 사유를 채워 열고, [저장] = 서버에 저장(Flt10_Tr.update) → "저장이 완료되었습니다" → 저장한 행을 callback으로
 */
import React, { useState } from 'react';
import { Input, message, Space } from 'antd';
import { fltApi } from '@/api/flt';
import { errorMessage } from '@/api/client';
import { FltPreApprove } from '@/types/flt';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';

/** open: 승인('20')·반려('30') 사유를 받는다 / edit: 처리된 행의 사유를 고친다 */
export type RejectReasonTarget =
  | { mode: 'open'; statusCode: string }
  | { mode: 'edit'; row: FltPreApprove };

interface Props {
  target: RejectReasonTarget | null;
  /** open의 [저장] = 입력한 사유, [취소]·닫기 = null (AS-IS callback.execute) */
  onResult?: (reason: string | null) => void;
  /** edit의 [저장] 뒤 저장한 행 (AS-IS callback.execute(trModel)) */
  onSaved?: (row: FltPreApprove) => void;
  onClose: () => void;
}

// [E0] 화면 열림 (생성자 L39-60) → settings(), show() — target이 있으면 모달이 열린다
export const Flt10_Lookup_RejectReasonWrite: React.FC<Props> = ({ target, onResult, onSaved, onClose }) => {
  return (
    <LookupModal open={target !== null} title={titleOf(target)} width={520} maskClosable={false} footer={null} destroyOnHidden
      onCancel={() => cancel(target, onResult, onClose)}>
      {target && <Body target={target} onResult={onResult} onSaved={onSaved} onClose={onClose} />}
    </LookupModal>
  );
};

/** setHeading — open은 승인사유/반려사유, 그 밖(edit 포함)은 생성자의 "승인 및 반려사유" */
const titleOf = (target: RejectReasonTarget | null): string => {
  if (target?.mode === 'open') {
    if (target.statusCode === '20') return '승인사유';
    if (target.statusCode === '30') return '반려사유';
  }
  return '승인 및 반려사유';
};

/** [E2] closeButton[취소].Select (L89) → callback.execute(null), hide() */
const cancel = (target: RejectReasonTarget | null, onResult: Props['onResult'], onClose: () => void) => {
  if (target?.mode === 'open') onResult?.(null);
  onClose();
};

const Body: React.FC<{ target: RejectReasonTarget } & Omit<Props, 'target'>> = ({ target, onResult, onSaved, onClose }) => {
  const statusCode = target.mode === 'open' ? target.statusCode : target.row.statusCode;
  const [note, setNote] = useState(target.mode === 'edit' ? target.row.rejectReason ?? '' : '');
  const [saving, setSaving] = useState(false);

  // [E1] updateButton[저장].Select (L83) → preUpdate() L98-110
  const preUpdate = async () => {
    if (statusCode === '30' && note.length === 0) {
      message.info('사유를 입력하세요');
      return;
    }
    if (target.mode === 'edit') {
      // update() L112-136: Flt10_Tr.update — 사유만 바뀐 행 저장
      setSaving(true);
      try {
        await fltApi.updatePreApproveReason(target.row.trId, note);
        message.info('저장이 완료되었습니다');
        onSaved?.({ ...target.row, rejectReason: note });
        onClose();
      } catch (err) {
        message.error(errorMessage(err, '저장 실패'));
      } finally {
        setSaving(false);
      }
      return;
    }
    onResult?.(note);
    onClose();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Input.TextArea value={note} onChange={e => setNote(e.target.value)} style={{ height: 250, resize: 'none' }} />
      <div style={{ textAlign: 'center' }}>
        <Space>
          <Button type="save" onClick={preUpdate} disabled={saving}>저장</Button>
          <Button type="cancel" onClick={() => cancel(target, onResult, onClose)}>취소</Button>
        </Space>
      </div>
    </div>
  );
};
