/**
 * 출퇴근 사유 창 (T06) — Att02_Tab_CommuteAdmin 그리드의 사유 아이콘 열이 연다 (읽기 전용)
 * AS-IS: myApp/client/vi/att/Att02_Edit_InOutReason.java (89줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L43-71: 430×410, 사유(출근) · 사유(퇴근) 두 칸(각 360×120), 아래 가운데 [닫기]. open() L34-41: 출퇴근 행을 보여 준다
 */
import React from 'react';
import { Input, Modal, Space } from 'antd';
import { AttCommute } from '@/types/att';
import { Button } from '@/components/button';

interface Props {
  /** 사유를 볼 출퇴근 행 — null이면 닫힘 */
  target: Pick<AttCommute, 'inReason' | 'outReason'> | null;
  onClose: () => void;
}

export const Att02_Edit_InOutReason: React.FC<Props> = ({ target, onClose }) => (
  <Modal
    open={target != null}
    title="출퇴근 사유"
    width={430}
    maskClosable={false}
    onCancel={onClose}
    styles={{
      header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 0 },
      footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 0 },
    }}
    footer={
      <div style={{ textAlign: 'center' }}>
        <Space>
          {/* [E1] closeButton[닫기].Select (L74) → hide() */}
          <Button type="close" onClick={onClose}>닫기</Button>
        </Space>
      </div>
    }
  >
    {/* [E0] 화면 열림 (생성자 L43-71) → show() */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '12px 2px' }}>
      <div>
        <div style={{ marginBottom: 6, fontWeight: 600 }}>사유(출근)</div>
        <Input.TextArea rows={5} readOnly value={target?.inReason ?? ''} />
      </div>
      <div>
        <div style={{ marginBottom: 6, fontWeight: 600 }}>사유(퇴근)</div>
        <Input.TextArea rows={5} readOnly value={target?.outReason ?? ''} />
      </div>
    </div>
  </Modal>
);
