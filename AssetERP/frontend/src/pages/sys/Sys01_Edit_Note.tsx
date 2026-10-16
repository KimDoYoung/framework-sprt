/**
 * 비고 팝업 (A15) — 관리정보 탭(Sys01_TabPage_Info01)의 비고 옆 [Edit]에서 연다.
 * AS-IS: myApp/client/vi/sys/Sys01_Edit_Note.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 */
import React, { useEffect, useState } from 'react';
import { Input, message, Modal, Space } from 'antd';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { CompanyManage } from '@/types/sys';
import { Button } from '@/components/button';

interface Props {
  /** open(companyModel, callback) L32-38 — 값이 있으면 열린다 */
  company?: CompanyManage;
  onClose: () => void;
  /** callback.execute(note) */
  onSaved: (note: string | null) => void;
}

export const Sys01_Edit_Note: React.FC<Props> = ({ company, onClose, onSaved }) => {
  const [note, setNote] = useState('');

  // [E0] 화면 열림: note.setText(companyModel.getNote())
  useEffect(() => { setNote(company?.note ?? ''); }, [company]);

  // [E1] updateButton[저장].Select (L62) → update() L76-89: 서비스 sys.Sys01_Company.updateNote(companyId, note)
  const update = async () => {
    try {
      const value = note === '' ? null : note;
      await sysApi.updateCompanyNote(company!.companyId, value);
      onSaved(value);
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  // 생성자 L40-59: 1200×650, 크기 조절 가능, 닫기(X) 없음
  return (
    <Modal
      open={!!company}
      title="비고"
      width={1200}
      closable={false}
      maskClosable={false}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={update}>저장</Button>
            {/* [E2] closeButton[닫기].Select (L68) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <Input.TextArea value={note} onChange={e => setNote(e.target.value)} style={{ height: 520, resize: 'none' }} />
    </Modal>
  );
};
