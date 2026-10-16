/**
 * 본문내용 조회창 (A30) — Sys90_Edit_BoardAdmin의 "본문내용 :" 글자에서 연다 (읽기 전용 HTML)
 * AS-IS: myApp/client/vi/sys/Sys90_Lookup_HappenReason.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open(happenReason) L44-77: 모달 700×700 "본문내용", 크기 조절 가능, 하단 닫기 [E1]. (L79-118 open(happenReason, callback)의 확인 [E2]·닫기 [E3]은 부르는 곳이 없어 옮기지 않는다)
 */
import React from 'react';
import { Modal } from 'antd';
import { Button } from '@/components/button';
import { HtmlView } from '@/components/form/HtmlView';

interface Props {
  /** AS-IS open(happenReason) — 문자열(빈 문자열 포함)이면 열린다, null이면 닫힘 */
  html: string | null;
  onClose: () => void;
}

export const Sys90_Lookup_HappenReason: React.FC<Props> = ({ html, onClose }) => (
  <Modal
    open={html != null}
    title="본문내용"
    width={700}
    maskClosable={false}
    onCancel={onClose}
    destroyOnClose
    footer={
      <div style={{ textAlign: 'center' }}>
        {/* [E1] closeButton[닫기].Select (L67) → hide() */}
        <Button type="close" onClick={onClose}>닫기</Button>
      </div>
    }
  >
    <HtmlView html={html} height={560} />
  </Modal>
);
