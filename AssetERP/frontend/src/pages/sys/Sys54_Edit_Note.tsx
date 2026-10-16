/**
 * 참고내용 팝업 (A15-4) — Sys54_Lookup_SpecificMenuHistory 요청이력의 '참고내용' [Edit]에서 연다.
 * AS-IS: myApp/client/vi/sys/Sys54_Edit_Note.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 * open(specificMenuHistoryModel, callback) L39-80: 제목 "참고내용", 900×700, 모달, 크기 조절 가능. CKEditor(iframe) → HtmlEditor(Tiptap, 사용자 결정 2026-10-13)
 */
import React, { useState } from 'react';
import { message, Modal, Space } from 'antd';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { SpecificMenuHistory } from '@/types/sys';
import { Button } from '@/components/button';
import { HtmlEditor } from '@/components/form/HtmlEditor';

interface Props {
  companyId: number;
  /** open(model, callback) — 값이 있으면 열린다 */
  history?: SpecificMenuHistory;
  onClose: () => void;
  /** callback.execute(): 저장 뒤 부른 쪽이 다시 조회한다 */
  onSaved: () => void;
}

export const Sys54_Edit_Note: React.FC<Props> = ({ companyId, history, onClose, onSaved }) => {
  const [note, setNote] = useState<string>(history?.note ?? '');

  // [E1] updateButton[저장].Select (L64) → update() L82-100
  const update = async () => {
    // L83-86: text-decoration-line → text-decoration, ' → " (CKEditor 출력 정리). 바깥 <p> 감싸기는 Tiptap이 이미 블록 HTML을 내므로 하지 않는다(작업기록 결정)
    const htmlContent = note.replaceAll('text-decoration-line', 'text-decoration').replaceAll("'", '"');
    try {
      // 서비스 sys.Sys54_SpecificMenuHistory.updateByNote(specificMenuHistoryId, note)
      await sysApi.updateSpecificMenuHistoryNote(companyId, history!.specificMenuHistoryId, htmlContent);
      onSaved();
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  return (
    <Modal
      open={!!history}
      title="참고내용"
      width={900}
      maskClosable={false}
      closable={false}
      destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={update}>저장</Button>
            {/* [E2] closeButton[닫기].Select (L70) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      {/* key: 다른 행으로 다시 열면 편집기를 새로 만든다 (setHtmlText) */}
      {history && <HtmlEditor key={history.specificMenuHistoryId} value={history.note} onChange={setNote} height={540} />}
    </Modal>
  );
};
