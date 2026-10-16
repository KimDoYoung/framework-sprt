/**
 * 처리방안 조회창 (A30 편집 / A29 읽기 전용) — Sys90_Edit_Board(Admin)의 "처리방안 :" 글자에서 연다
 * AS-IS: myApp/client/vi/sys/Sys90_Lookup_HappenRemedy.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open(happenRemedy, callback) L79-118 (A30): 모달 900×700 "처리방안", 크기 조절 가능, CKEditor(iframe) → HtmlEditor(Tiptap, 사용자 결정 2026-10-13), 확인·닫기
 * open(happenRemedy) L44-77 (A29): 같은 창에 읽기 전용 HTML(HtmlView), 하단 닫기 [E1]
 * onConfirm을 주면 편집(A30), 안 주면 읽기 전용(A29)
 */
import React, { useEffect, useState } from 'react';
import { Modal, Space } from 'antd';
import { Button } from '@/components/button';
import { HtmlEditor } from '@/components/form/HtmlEditor';
import { HtmlView } from '@/components/form/HtmlView';

interface Props {
  /** AS-IS open(happenRemedy) — 문자열(빈 문자열 포함)이면 열린다, null이면 닫힘 */
  html: string | null;
  /** [E2] confirmButton[확인].Select (L101) → callback.execute(getHtmlText()). 없으면 읽기 전용 */
  onConfirm?: (html: string) => void;
  onClose: () => void;
}

export const Sys90_Lookup_HappenRemedy: React.FC<Props> = ({ html, onConfirm, onClose }) => {
  const [text, setText] = useState('');
  useEffect(() => { if (html != null) setText(html); }, [html]);

  return (
    <Modal
      open={html != null}
      title="처리방안"
      width={900}
      maskClosable={false}
      onCancel={onClose}
      destroyOnClose
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E2] confirmButton[확인].Select (L101) → callback.execute(getHtmlText()), hide() */}
            {onConfirm && <Button type="save" onClick={() => { onConfirm(text); onClose(); }}>확인</Button>}
            {/* [E1] closeButton[닫기].Select (L67) / [E3] (L108) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      {onConfirm ? <HtmlEditor value={html} onChange={setText} height={560} /> : <HtmlView html={html} height={560} />}
    </Modal>
  );
};
