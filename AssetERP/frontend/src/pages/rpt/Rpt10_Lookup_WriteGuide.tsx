/**
 * 작성요령 및 변경이력 보기 창 (T17) — Rpt10_Rd_* 탭 페이지의 [작성요령]에서 연다
 * AS-IS: myApp/client/vi/rpt/Rpt10_Lookup_WriteGuide.java (89줄, 새 원본 IDMS-IC) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 * 생성자 L34-61: 모달 700×470, 제목 "작성요령 및 변경이력", 작성요령(읽기 전용 230) / 변경이력(읽기 전용 150), 아래 가운데 [닫기]
 */
import React from 'react';
import { Input } from 'antd';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';
import { RptWriteGuide } from '@/types/rpt';

const label: React.CSSProperties = { width: 75, textAlign: 'right', paddingRight: 10, paddingTop: 4, flex: 'none' };

// [E0] 화면 열림 (생성자 L34-61) → show() — 호출하는 쪽이 submit을 넘기면 열린다
export const Rpt10_Lookup_WriteGuide: React.FC<{ submit: RptWriteGuide | null; onClose: () => void }> = ({ submit, onClose }) => (
  <LookupModal
    open={submit != null}
    title="작성요령 및 변경이력"
    width={700}
    maskClosable={false}
    destroyOnHidden
    onCancel={onClose}
    footer={<div style={{ textAlign: 'center' }}>
      {/* [E1] closeButton[닫기].Select (L70) → hide() */}
      <Button type="close" onClick={onClose}>닫기</Button>
    </div>}
  >
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '8px 2px' }}>
      <div style={{ display: 'flex' }}>
        <div style={label}>작성요령</div>
        <Input.TextArea readOnly style={{ height: 230, resize: 'none' }} value={submit?.writeGuide ?? ''} />
      </div>
      <div style={{ display: 'flex' }}>
        <div style={label}>변경이력</div>
        <Input.TextArea readOnly style={{ height: 150, resize: 'none' }} value={submit?.reviseHistory ?? ''} />
      </div>
    </div>
  </LookupModal>
);
