/**
 * 거래처 연락처 창 (U07) — Pay50_Tab_ExpensePayWrite·Pay50_Tab_ExpensePay의 지출처 셀 더블클릭이 연다
 * AS-IS: myApp/client/vi/sys/Sys15_Lookup_TelInfo.java (80줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * view(model) L30-44: 모달 520×210 "거래처 연락처", 전화번호(270)·주소(470) 읽기 전용 + [닫기], 라벨 폭 110 (getEditor L61-72)
 * UX보강(10): 조회창(UX-05 — 입력칸이 모두 읽기 전용이라 포커스를 줄 곳이 없다)
 */
import React from 'react';
import { Input } from 'antd';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';

interface Props {
  open: boolean;
  tel: string | null;
  addr: string | null;
  onClose: () => void;
}

const LABEL: React.CSSProperties = { width: 110, textAlign: 'right', paddingRight: 10, flex: 'none' };

export const Sys15_Lookup_TelInfo: React.FC<Props> = ({ open, tel, addr, onClose }) => (
  <LookupModal open={open} title="거래처 연락처" width={520} maskClosable={false} onCancel={onClose} destroyOnHidden
    footer={
      <div style={{ textAlign: 'center' }}>
        {/* [E1] closeButton[닫기].Select (L53) → hide() */}
        <Button type="close" onClick={onClose}>닫기</Button>
      </div>
    }
  >
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '12px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={LABEL}>전화번호</span>
        <Input readOnly style={{ width: 270 }} value={tel ?? ''} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={LABEL}>주소</span>
        <Input readOnly style={{ width: 470 }} value={addr ?? ''} />
      </div>
    </div>
  </LookupModal>
);
