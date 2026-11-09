/**
 * 일일업무 확인자 비고 창 (Z09) — Rpt01_Tab_DailyConfirm의 수정 칸에서 연다
 * AS-IS: myApp/client/vi/rpt/Rpt01_Edit_DailyConfirm.java (127줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * edit() L44-51: 제목 "등록", 업무내용은 읽기 전용(L58) / 생성자 L53-83: 700×470, 라벨 폭 75, 업무내용(높이 230) · 비고(높이 150), 아래 가운데 저장·닫기
 * 스타일: MF (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useEffect, useState } from 'react';
import { Input, message, Space } from 'antd';
import { EditModal, EditField } from '@/components/form/EditForm';
import { rptDailyApi } from '@/api/rpt';
import { errorMessage } from '@/api/client';
import { RptDailyConfirm } from '@/types/rpt';
import { Button } from '@/components/button';

interface Props {
  /** 편집할 글 — null이면 닫힘 */
  model: RptDailyConfirm | null;
  onClose: () => void;
  /** AS-IS callback.execute() → retrieve() */
  onDone?: () => void;
}

export const Rpt01_Edit_DailyConfirm: React.FC<Props> = ({ model, onClose, onDone }) => {
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  useEffect(() => setNote(model?.confirmNote ?? ''), [model]);
  if (!model) return null;

  // [E1] updateButton[저장].Select (L87) → update() L102-117: 서비스 rpt.Rpt01_Daily.confirmModelUpdate → callback.execute() 뒤 hide()
  const update = async () => {
    setSaving(true);
    try {
      await rptDailyApi.saveConfirmNote(model.dailyId, note === '' ? null : note);
      onClose();
      onDone?.();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <EditModal
      open
      title="등록"
      width={700}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={update} loading={saving}>저장</Button>
            {/* [E2] closeButton[닫기].Select (L93) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      {/* [E0] 화면 열림 (생성자 L53-83) → settings(), show() */}
        <EditField label="업무내용" labelWidth={70}><Input.TextArea rows={9} readOnly value={model.content ?? ''} /></EditField>
        <EditField label="비고" labelWidth={70}><Input.TextArea rows={5} value={note} onChange={e => setNote(e.target.value)} /></EditField>
    </EditModal>
  );
};
