/**
 * 기본설정 팝업 — 버튼 여러 개를 세로로 늘어놓고, 하나를 누르면 팝업을 닫고 그 동작을 한다.
 * AS-IS: myApp/client/utils/SettingPopup.java — 버튼 폭 350·높이 40, 간격 10, 모달. 제목은 부르는 쪽이 정한다(예: "기본설정").
 * 사용처: Ics10_Tab_Checklist [기본설정]
 */
import React from 'react';
import { Modal } from 'antd';
import { Button, ButtonType } from '@/components/button';

export interface SettingPopupItem {
  type: ButtonType;
  label: string;
  onClick: () => void;
}

interface Props {
  open: boolean;
  title: string;
  items: SettingPopupItem[];
  onClose: () => void;
}

export const SettingPopup: React.FC<Props> = ({ open, title, items, onClose }) => (
  <Modal open={open} title={title} footer={null} width={420} maskClosable={false} onCancel={onClose}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
      {items.map(item => (
        <Button key={item.label} type={item.type} style={{ width: 350, height: 40 }} onClick={() => { onClose(); item.onClick(); }}>{item.label}</Button>
      ))}
    </div>
  </Modal>
);
