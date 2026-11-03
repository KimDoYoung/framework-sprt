/**
 * 처리내용 조회창 (EE16) — Scm01_Edit_DevMng의 "처리내용 :" 링크가 연다
 * AS-IS: myApp/client/vi/scm/Scm01_Lookup_ResultContent.java (116줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open(srModel) L36-61: 보기 — [닫기]만 / open(resultStr, srModel, callback) L63-94: 편집 — [확인]·[닫기] — 모달 1000×500 "처리내용", 본문은 글상자 하나
 * [E2] [확인] → update() L96-111: scm.Scm01_Sr.updateResultContent(처리내용) → callback(글) → 닫기
 */
import React, { useEffect, useState } from 'react';
import { Input, message, Space } from 'antd';
import { scmApi } from '@/api/scm';
import { errorMessage } from '@/api/client';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';
import { MODAL_HEADER_STYLE } from './scmGridCells';

interface Props {
  open: boolean;
  /** 지금 폼의 처리내용 */
  resultContent: string;
  srId: number | null;
  /** true면 open(srModel) 보기 전용 — [확인]이 없다 */
  readOnly?: boolean;
  /** callback.execute(글) — [확인]으로 저장이 끝난 뒤 */
  onResult?: (text: string) => void;
  onClose: () => void;
}

export const Scm01_Lookup_ResultContent: React.FC<Props> = ({ open, resultContent, srId, readOnly = false, onResult, onClose }) => {
  const [text, setText] = useState(resultContent);
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (open) setText(resultContent); }, [open, resultContent]);

  const update = async () => {
    if (srId == null) return;
    setSaving(true);
    try {
      await scmApi.updateResultContent(srId, text);
      onResult?.(text);
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <LookupModal
      open={open}
      title="처리내용"
      width={1000}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      styles={{ header: MODAL_HEADER_STYLE }}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E2] confirmButton[확인].Select (L78) → update() */}
            {!readOnly && <Button type="save" loading={saving} onClick={update}>확인</Button>}
            {/* [E1] closeButton[닫기].Select (L51, 보기) · [E3] closeButton[닫기].Select (L84, 편집) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <Input.TextArea value={text} readOnly={readOnly} onChange={e => setText(e.target.value)} style={{ height: 380, resize: 'none' }} />
    </LookupModal>
  );
};
