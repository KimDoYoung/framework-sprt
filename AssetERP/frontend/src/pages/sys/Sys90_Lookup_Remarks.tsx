/**
 * 비고내용 조회창 (A30) — Sys90_Edit_BoardAdmin의 "비고내용 :" 글자에서 연다
 * AS-IS: myApp/client/vi/sys/Sys90_Lookup_Remarks.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open(afterServiceModel, callback) L37-72: 모달 1000×500 "비고내용", 크기 고정, 글상자 하나, 저장·닫기
 */
import React, { useEffect, useState } from 'react';
import { Input, message, Space } from 'antd';
import { LookupModal } from '@/components/lookup/LookupModal';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { AfterService } from '@/types/sys';
import { Button } from '@/components/button';

interface Props {
  /** AS-IS open(afterServiceModel) — 있으면 열린다 */
  model: AfterService | null;
  /** callback.execute(asModel) — 저장된 행 */
  onSaved: (row: AfterService) => void;
  onClose: () => void;
}

export const Sys90_Lookup_Remarks: React.FC<Props> = ({ model, onSaved, onClose }) => {
  const [remarks, setRemarks] = useState('');
  useEffect(() => { if (model) setRemarks(model.remarks ?? ''); }, [model]);

  // [E1] updateButton[저장].Select (L55) → update() L74-88: 서비스 sys.Sys90_AfterService.updateRemarks → callback, hide()
  const update = async () => {
    if (!model) return;
    try {
      onSaved(await sysApi.updateAfterServiceRemarks(model.afterServiceId, remarks));
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  return (
    <LookupModal
      open={!!model}
      title="비고내용"
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
      <Input.TextArea style={{ height: 340, resize: 'none' }} value={remarks} onChange={e => setRemarks(e.target.value)} />
    </LookupModal>
  );
};
