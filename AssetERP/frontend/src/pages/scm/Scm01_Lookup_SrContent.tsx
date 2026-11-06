/**
 * 요청내용 조회창 (EE15) — Scm01_Edit_Sr의 "요청내용 :" 링크가 연다
 * AS-IS: myApp/client/vi/scm/Scm01_Lookup_SrContent.java (172줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open(srContent) L53-86: 읽기 전용 보기(HTML), [닫기]만 / open(srContent, EnabledYn, srModel, callback) L88-130: 편집(HTML 편집기),
 *   [확인](EnabledYn일 때만)·[닫기] — 모달 1000×700 "요청내용", 본문은 편집기 하나
 * [E2] [확인] → update() L132-147: scm.Scm01_Sr.updateContent(의뢰의 요청내용) → callback(편집한 HTML) → 닫기
 */
import React, { useEffect, useState } from 'react';
import { message, Space } from 'antd';
import { scmApi } from '@/api/scm';
import { errorMessage } from '@/api/client';
import { Button } from '@/components/button';
import { HtmlEditor } from '@/components/form/HtmlEditor';
import { HtmlView } from '@/components/form/HtmlView';
import { LookupModal } from '@/components/lookup/LookupModal';

interface Props {
  open: boolean;
  /** 지금 폼의 요청내용(HTML) */
  srContent: string;
  /** EnabledYn — 임시저장 상태의 등록자만 true(편집·[확인]) */
  enabledYn: boolean;
  srId: number | null;
  /** callback.execute(html) — [확인]으로 저장이 끝난 뒤 */
  onResult: (html: string) => void;
  onClose: () => void;
}

export const Scm01_Lookup_SrContent: React.FC<Props> = ({ open, srContent, enabledYn, srId, onResult, onClose }) => {
  const [html, setHtml] = useState(srContent);
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (open) setHtml(srContent); }, [open, srContent]);

  const update = async () => {
    if (srId == null) return;
    setSaving(true);
    try {
      await scmApi.updateSrContent(srId, html);
      onResult(html);
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
      title="요청내용"
      width={1000}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      focusFirst={false}
      styles={{ header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 12 } }}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E2] confirmButton[확인].Select (L111) → update() */}
            {enabledYn && <Button type="save" loading={saving} onClick={update}>확인</Button>}
            {/* [E1] closeButton[닫기].Select (L76, 보기 전용 open) · [E3] closeButton[닫기].Select (L117) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      {enabledYn
        ? <HtmlEditor toolbar="client" key={String(open)} value={srContent} onChange={setHtml} height={520} />
        : <HtmlView html={srContent} height={560} />}
    </LookupModal>
  );
};
