/**
 * 소스 생성 결과 창 — Dbm02_TabPage_ColComments의 XML·Model·Properties·GridBuilder 버튼이 연다.
 * AS-IS: myApp/client/vi/dbm/Dbm02_PopupSourceGenerator.java (31줄) — 함수 이름은 원본 메서드 이름 그대로
 * 생성자 L14-29: 닫기 버튼 + 1100×550 TextArea에 서버가 준 문자열
 */
import React from 'react';
import { Input } from 'antd';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Button } from '@/components/button';

interface Props {
  /** 보일 문자열. null이면 닫힘 */
  text: string | null;
  onClose: () => void;
}

// [E0] 화면 열림 (생성자 L14-29) → 초기화 (닫기 버튼 + TextArea)
export const Dbm02_PopupSourceGenerator: React.FC<Props> = ({ text, onClose }) => (
  <LookupModal
    open={text != null}
    title="Generating"
    width={1150}
    maskClosable={false}
    onCancel={onClose}
    footer={
      <div style={{ textAlign: 'center' }}>
        {/* [E1] closeButton[닫기].Select (L16) → hide() */}
        <Button type="close" onClick={onClose}>닫기</Button>
      </div>
    }
  >
    <Input.TextArea value={text ?? ''} readOnly style={{ width: '100%', height: 550, fontFamily: 'monospace' }} />
  </LookupModal>
);
