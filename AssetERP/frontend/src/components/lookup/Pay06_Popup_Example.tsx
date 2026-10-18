/**
 * 참고 (E17) — Com10_Lookup_CommonMapping의 "( 참 고 )"에서 연다.
 * AS-IS: myApp/client/vi/pay/Pay06_Popup_Example.java — 1150×500 모달 "참 고", 이미지(pay06_example.png)를 누르면 닫힌다
 */
import React from 'react';
import { Modal } from 'antd';

interface Props {
  open: boolean;
  onClose: () => void;
}

export const Pay06_Popup_Example: React.FC<Props> = ({ open, onClose }) => (
  <Modal open={open} title="참 고" width={1150} footer={null} maskClosable={false} onCancel={onClose} destroyOnClose>
    {/* [E1] anchor.MouseDown (L28) → hide() */}
    <img src="./img/example/pay06_example.png" alt="참고" style={{ width: '98%', maxHeight: 400, cursor: 'pointer' }} onMouseDown={onClose} />
  </Modal>
);
