/**
 * 자산분류 이동 팝업 (도달 불가: AS-IS 원본에서도 open 호출처 없음)
 * AS-IS: myApp/client/vi/ast/Ast01_Lookup_MoveClassTree.java (128줄)
 */
import React from 'react';
import { Modal } from 'antd';
import { Button } from '@/components/button';

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const Ast01_Lookup_MoveClassTree: React.FC<Props> = ({ open, onClose }) => {
  // [E0] 화면 열림 (생성자 L66-99) → show()

  // [E1] parentName.TriggerClick (L49)
  const handleTriggerClick = () => {};

  // [E2] updateButton[확인].Select (L73) → update()
  const handleUpdate = () => {
    onClose();
  };

  // [E3] cancleButton[닫기].Select (L79) → hide()
  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      open={open}
      title="상위분류 변경"
      onCancel={handleClose}
      footer={[
        <Button key="confirm" type="save" onClick={handleUpdate}>
          확인
        </Button>,
        <Button key="close" type="close" onClick={handleClose}>
          닫기
        </Button>,
      ]}
    >
      <div style={{ padding: 16 }}>
        <span onClick={handleTriggerClick}>상위분류를 선택하세요.</span>
      </div>
    </Modal>
  );
};
