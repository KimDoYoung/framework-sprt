/**
 * 대표이사 추가가감 (T04) — Emp43_Tab_FinalAppr의 수정 아이콘에서 연다 (가점·감점 입력)
 * AS-IS: myApp/client/vi/emp/Emp43_Edit_CeoScore.java (112줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * edit() L41-60: 모달 200×200 "대표이사 추가가감"(X 없음), getEditor() L77-87: 라벨 폭 88, 가점 · 감점(LongField 155), 아래 가운데 저장·닫기
 * 스타일: MF (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useEffect, useState } from 'react';
import { InputNumber, message, Space } from 'antd';
import { EditModal, EditField } from '@/components/form/EditForm';
import { empEvalApi } from '@/api/emp';
import { errorMessage } from '@/api/client';
import { EvalAdmin } from '@/types/emp';
import { Button } from '@/components/button';

interface Props {
  /** 편집할 대상자 — null이면 닫힘 */
  target: EvalAdmin | null;
  /** AS-IS callback.execute(): 저장 뒤 부르는 쪽이 다시 조회 */
  onSaved: () => void;
  onClose: () => void;
}

export const Emp43_Edit_CeoScore: React.FC<Props> = ({ target, onSaved, onClose }) => {
  const [ceoEvalBonus, setCeoEvalBonus] = useState<number | null>(null);
  const [ceoEvalPenalty, setCeoEvalPenalty] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setCeoEvalBonus(target?.ceoEvalBonus ?? null);
    setCeoEvalPenalty(target?.ceoEvalPenalty ?? null);
  }, [target]);

  if (!target) return null;

  // [E1] updateButton[저장].Select (L63) → update() L89-103: emp.Emp43_EvalTarget.modelUpdate → callback.execute(), hide()
  const update = async () => {
    setSaving(true);
    try {
      await empEvalApi.updateEvalCeoScore(target.evalTargetId, { ceoEvalBonus, ceoEvalPenalty });
      onClose();
      onSaved();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <EditModal
      open
      title="대표이사 추가가감"
      width={300}
      closable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={update} loading={saving}>저장</Button>
            {/* [E2] closeButton[닫기].Select (L69) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
        <EditField label="가점" labelWidth={50}><InputNumber style={{ width: '100%' }} precision={0} value={ceoEvalBonus} onChange={v => setCeoEvalBonus(v == null ? null : Number(v))} /></EditField>
        <EditField label="감점" labelWidth={50}><InputNumber style={{ width: '100%' }} precision={0} value={ceoEvalPenalty} onChange={v => setCeoEvalPenalty(v == null ? null : Number(v))} /></EditField>
    </EditModal>
  );
};
