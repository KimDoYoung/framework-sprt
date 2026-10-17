/**
 * [1269] I/F > 10. ICAM > ICAM DB Source Get 의 소스내용 창 (D09)
 * AS-IS: myApp/client/vi/icam/Icam50_Lookup_Source.java (54줄) — open(sourceText) L23-48: 모달 1000x800, 제목 "소스내용", 읽기 전용 텍스트 영역, 닫기 버튼 하나
 */
import React from 'react';
import { Input, Modal } from 'antd';
import { Button } from '@/components/button';

interface Props {
  sourceText: string;
  onClose: () => void;
}

export const Icam50_Lookup_Source: React.FC<Props> = ({ sourceText, onClose }) => (
  <Modal
    open
    title="소스내용"
    width={1000}
    maskClosable={false}
    onCancel={onClose}
    footer={
      <div style={{ textAlign: 'center' }}>
        {/* [E1] closeButton[닫기].Select (L38) → hide() */}
        <Button type="close" onClick={onClose}>닫기</Button>
      </div>
    }
  >
    <Input.TextArea readOnly value={sourceText} style={{ height: 650, resize: 'none', fontFamily: 'monospace' }} />
  </Modal>
);
