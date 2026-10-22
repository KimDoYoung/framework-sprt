/**
 * 사유 창 (K05) — Ics15_Tab_ChecklistWrite 그리드의 수정 아이콘에서 연다.
 * AS-IS: myApp/client/vi/ics/Ics15_Edit_Reason.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L50-70: 모달 "사유", 사유 입력(700×300), 아래 가운데 [저장]·[닫기]
 */
import React, { useEffect, useState } from 'react';
import { Input, message, Space } from 'antd';
import { LookupModal } from '@/components/lookup/LookupModal';
import { icsApi } from '@/api/ics';
import { errorMessage } from '@/api/client';
import { IcsChecklistWriteItem } from '@/types/ics';
import { Button } from '@/components/button';

interface Props {
  /** edit(checklistWriteModel, callback) L40-48 — 값이 있으면 열린다 */
  model: IcsChecklistWriteItem | null;
  /** callbackResult.execute(updateModel): 저장한 뒤 */
  onSaved: (model: IcsChecklistWriteItem) => void;
  onClose: () => void;
}

export const Ics15_Edit_Reason: React.FC<Props> = ({ model, onSaved, onClose }) => {
  const [reason, setReason] = useState('');

  useEffect(() => { if (model) setReason(model.reason ?? ''); }, [model]);

  // [E1] updateButton[저장].Select (L73) → update() L87-101: ics.Ics15_ChecklistWrite.modelUpdate → callbackResult.execute(updateModel) → hide()
  const update = async () => {
    if (!model) return;
    try {
      const saved = await icsApi.updateChecklistWriteReason(model.checklistWriteId, reason);
      onSaved(saved);
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  // [E0] 화면 열림 (생성자 L50-70) → settings(), show()
  return (
    <LookupModal
      open={!!model}
      title="사유"
      width={730}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={update}>저장</Button>
            {/* [E2] closeButton[닫기].Select (L79) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <Input.TextArea style={{ height: 300, resize: 'none' }} value={reason} onChange={e => setReason(e.target.value)} />
    </LookupModal>
  );
};
