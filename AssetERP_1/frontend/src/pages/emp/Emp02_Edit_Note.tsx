/**
 * 비고(시스템관리자전용) 편집 팝업 (C03) — Emp01_Tab_UserInfo 그리드의 Edit 칸에서 연다.
 * AS-IS: myApp/client/vi/emp/Emp02_Edit_Note.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 * 레이아웃(생성자 L50-70): 710×390, 비고 TextArea 700×300(여백 10), 아래 가운데 저장·닫기
 */
import React, { useEffect, useState } from 'react';
import { Input, message, Modal, Space } from 'antd';
import { empUserInfoApi } from '@/api/emp';
import { errorMessage } from '@/api/client';
import { NoteAdmin } from '@/types/emp';
import { Button } from '@/components/button';

interface Props {
  /** AS-IS edit(othersModel, callback) L40-48: 값이 있으면 열린다 */
  othersModel?: NoteAdmin;
  /** AS-IS callbackResult.execute(updateModel) — 저장 후 */
  onSaved: (othersModel: NoteAdmin) => void;
  onClose: () => void;
}

export const Emp02_Edit_Note: React.FC<Props> = ({ othersModel, onSaved, onClose }) => {
  const [noteAdmin, setNoteAdmin] = useState('');
  const [saving, setSaving] = useState(false);

  // [E0] 화면 열림 (생성자 L50-70) → edit() L40-48: editDriver.edit(othersModel)
  useEffect(() => {
    if (othersModel) setNoteAdmin(othersModel.noteAdmin ?? '');
  }, [othersModel]);

  // [E2] closeButton[닫기].Select (L79) → hide()
  const hide = () => onClose();

  // [E1] updateButton[저장].Select (L73) → update() L87-101: 서비스 emp.Emp02_Others.modelUpdate(updateModel) → callback + hide()
  const update = async () => {
    if (!othersModel) return;
    setSaving(true);
    try {
      // GXT TextArea는 빈 값을 null로 flush한다
      const updateModel = await empUserInfoApi.updateNoteAdmin({ ...othersModel, noteAdmin: noteAdmin || null });
      onSaved(updateModel);
      hide();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={!!othersModel}
      title="체크내용"
      width={710}
      maskClosable={false}
      onCancel={hide}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={update} loading={saving}>저장</Button>
            <Button type="close" onClick={hide}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ padding: 10 }}>
        <Input.TextArea style={{ height: 300, resize: 'none' }} value={noteAdmin} onChange={e => setNoteAdmin(e.target.value)} />
      </div>
    </Modal>
  );
};
