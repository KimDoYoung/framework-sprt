/**
 * 개발내용 조회창 (EE16) — Scm10_Grid_Dev의 개발내용 [수정] 아이콘이 연다
 * AS-IS: myApp/client/vi/scm/Scm10_Lookup_Note.java (168줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open(note) L60-94: 보기(HTML), [닫기]만 / open(devModel, callback) L96-132: 편집(HTML 편집기), [확인]·[닫기] — 모달 1000×700 "개발내용"
 * [E2] [확인] → callback(편집한 HTML) → 닫기. 저장은 하지 않는다(개발자 그리드의 [저장]이 한다)
 */
import React, { useEffect, useState } from 'react';
import { Space } from 'antd';
import { Button } from '@/components/button';
import { HtmlEditor } from '@/components/form/HtmlEditor';
import { HtmlView } from '@/components/form/HtmlView';
import { LookupModal } from '@/components/lookup/LookupModal';
import { MODAL_HEADER_STYLE } from './scmGridCells';

interface Props {
  open: boolean;
  note: string;
  /** open(devModel, callback)이면 true(편집 + [확인]), open(note)이면 false(보기) */
  editable: boolean;
  /** callback.execute(html) */
  onResult?: (html: string) => void;
  onClose: () => void;
}

export const Scm10_Lookup_Note: React.FC<Props> = ({ open, note, editable, onResult, onClose }) => {
  // [E0] 화면 열림 (생성자 L50-58) → 모달 1000×700 "개발내용" 초기화
  const [html, setHtml] = useState(note);
  useEffect(() => { if (open) setHtml(note); }, [open, note]);

  return (
    <LookupModal
      open={open}
      title="개발내용"
      width={1000}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      focusFirst={false}
      styles={{ header: MODAL_HEADER_STYLE }}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E2] updateButton[확인].Select (L136) → callback.execute(getHtmlText()), hide() */}
            {editable && <Button type="save" onClick={() => { onResult?.(html); onClose(); }}>확인</Button>}
            {/* [E1] closeButton[닫기].Select (L143) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      {editable
        ? <HtmlEditor toolbar="client" key={String(open)} value={note} onChange={setHtml} height={520} />
        : <HtmlView html={note} height={560} />}
    </LookupModal>
  );
};
