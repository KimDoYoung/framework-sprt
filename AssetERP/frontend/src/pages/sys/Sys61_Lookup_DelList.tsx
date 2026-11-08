/**
 * 삭제된 첨부파일 내역 창 (V05) — 결재완료(30) 문서의 [삭제된 첨부파일 내역]이 연다.
 * AS-IS: myApp/client/vi/sys/Sys61_Lookup_DelList.java (134줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * [E0] 화면 열림 (생성자 L43-68) → settings(), show() ·
 * 생성자 L43-68: 740×450 모달 "삭제된 첨부파일 내역", 그리드, 푸터 [닫기]
 * 스타일: MF (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React from 'react';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Sys61_TabPage_DelList } from './Sys61_TabPage_DelList';

interface Props {
  /** open(parentId) — 값이 있으면 열린다 */
  parentId: number | null;
  onClose: () => void;
}

export const Sys61_Lookup_DelList: React.FC<Props> = ({ parentId, onClose }) => (
  <LookupModal
    open={parentId != null}
    title="삭제된 첨부파일 내역"
    width={800}
    style={{ top: 20 }}
    maskClosable={false}
    onCancel={onClose}
    destroyOnClose
    focusFirst={false}
    styles={{ header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 12 } }}
    footer={<div style={{ textAlign: 'center' }}>{/* [E1] closeButton[닫기].Select (L71) → hide() */}<Button type="close" onClick={onClose}>닫기</Button></div>}
  >
    <div style={{ height: 'min(340px, calc(100vh - 260px))' }}>
      <Sys61_TabPage_DelList parentId={parentId} />
    </div>
  </LookupModal>
);
