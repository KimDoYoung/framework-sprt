/**
 * 결재의견·반려사유 편집창 (EE15) — Scm02_Grid_ApprStep의 결재의견/반려사유 아이콘이 연다
 * AS-IS: myApp/client/vi/scm/Scm02_Edit_NoteMessage.java (119줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L67-79: 모달 450×250, 제목 = 결재의견 | 반려사유(open L36-65), 본문 = 그 TextArea 하나, 아래 가운데 [저장][닫기]
 * [저장]은 실결재자(apprEmpId = 로그인 사원)에게만 보인다(open L44-50). 저장은 두 칸(결재의견·반려사유)을 모두 보낸다(editDriver.flush)
 * EditModal 규격(11 §4a)
 * 스타일: MF (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useEffect, useState } from 'react';
import { Input, message, Modal, Space } from 'antd';
import { scmApi } from '@/api/scm';
import { errorMessage } from '@/api/client';
import { SrApprStep } from '@/types/scm';
import { Button } from '@/components/button';
import { useLoginUser } from '@/hooks/useLoginUser';

interface Props {
  /** open(selectModel, comment) — 고른 결재단계. null이면 닫힘 */
  step: SrApprStep | null;
  /** '결재의견' | '반려사유' */
  comment: '결재의견' | '반려사유';
  /** 저장이 끝나면 바뀐 결재단계(grid의 줄을 갱신한다) */
  onSaved: (step: SrApprStep) => void;
  onClose: () => void;
}

export const Scm02_Edit_NoteMessage: React.FC<Props> = ({ step, comment, onSaved, onClose }) => {
  const user = useLoginUser();
  const [note, setNote] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [saving, setSaving] = useState(false);

  // [E0] 화면 열림 (생성자 L67-79) → settings(), show() · open() L36-65: editDriver.edit(selectModel)
  useEffect(() => {
    setNote(step?.note ?? '');
    setRejectReason(step?.rejectReason ?? '');
  }, [step]);

  // [E1] updateButton[저장].Select (L82) → update() L96-114: scm.Scm02_SrApprStep.modelUpdate — 실패하면 "저장에 실패하였습니다. 관리자에게 문의해주세요"
  const update = async () => {
    if (!step) return;
    setSaving(true);
    try {
      await scmApi.updateSrApprNote(step.srApprStepId, note || null, rejectReason || null);
      onSaved({ ...step, note: note || null, rejectReason: rejectReason || null });
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '저장에 실패하였습니다. 관리자에게 문의해주세요'));
    } finally {
      setSaving(false);
    }
  };

  const canEdit = !!step && user.userId === step.apprEmpId;
  const isNote = comment === '결재의견';

  return (
    <Modal
      open={!!step}
      title={comment}
      width={450}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      styles={{
        header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 0 },
        footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 0 },
      }}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E1] */}
            {canEdit && <Button type="save" loading={saving} onClick={update}>저장</Button>}
            {/* [E2] closeButton[닫기].Select (L88) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ padding: '12px 2px' }}>
        <Input.TextArea
          autoFocus
          rows={5}
          value={isNote ? note : rejectReason}
          readOnly={!canEdit}
          maxLength={500}
          onChange={e => (isNote ? setNote(e.target.value) : setRejectReason(e.target.value))}
        />
      </div>
    </Modal>
  );
};
