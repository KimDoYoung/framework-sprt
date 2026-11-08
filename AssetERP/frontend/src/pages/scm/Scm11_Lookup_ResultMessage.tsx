/**
 * 결과 보기 창 (EE17) — 단계가 끝난 줄을 고르면 그 결과(HTML)를 알려 준다
 * AS-IS: myApp/client/vi/scm/Scm11_Lookup_ResultMessage.java (79줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 1000×700 · 제목 "결과" · 닫기 아이콘 없음(setClosable(false)) · [닫기]만
 * [E0] 화면 열림 (생성자 L31-47) → setMessage(msg) L49-69: 글이 있으면 HTML을 채우고 show()
 * 스타일: MH (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React from 'react';
import { HtmlView } from '@/components/form/HtmlView';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';
import { MODAL_HEADER_STYLE } from './scmGridCells';

interface Props {
  open: boolean;
  /** setMessage(msg) — 결과(HTML) */
  message: string;
  onClose: () => void;
}

export const Scm11_Lookup_ResultMessage: React.FC<Props> = ({ open, message, onClose }) => (
  <LookupModal
    open={open}
    title="결과"
    width={1000}
    closable={false}
    maskClosable={false}
    onCancel={onClose}
    destroyOnHidden
    focusFirst={false}
    styles={{ header: MODAL_HEADER_STYLE }}
    footer={
      <div style={{ textAlign: 'center' }}>
        {/* [E1] closeButton[닫기].Select (L60) → hide() */}
        <Button type="close" onClick={onClose}>닫기</Button>
      </div>
    }
  >
    <HtmlView html={message} height={560} />
  </LookupModal>
);
