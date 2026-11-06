/**
 * 결과상세 조회창 (EE16) — Scm11_Lookup_DevStep의 결과상세 [보기] 아이콘이 연다 (편집은 EE17 Scm11_Edit_DevStep)
 * AS-IS: myApp/client/vi/scm/Scm11_Lookup_Result.java (159줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open(devStepModel) L59-86: 보기(HTML), [닫기]만 / open(resultStr, devStepModel, callback) L88-122: 편집(HTML 편집기), [확인]·[닫기] — 모달 1000×700 "결과상세"
 * [E0] 화면 열림 (생성자 L49-57) → 초기화, [E1] closeButton[닫기] (L76, 보기), [E2] confirmButton[확인] (L106, 편집) → update() L124-139: scm.Scm11_DevStep.updateResult(결과상세) → callback(HTML) → 닫기
 */
import React, { useEffect, useState } from 'react';
import { message, Space } from 'antd';
import { scmApi } from '@/api/scm';
import { errorMessage } from '@/api/client';
import { DevStep } from '@/types/scm';
import { Button } from '@/components/button';
import { HtmlEditor } from '@/components/form/HtmlEditor';
import { HtmlView } from '@/components/form/HtmlView';
import { LookupModal } from '@/components/lookup/LookupModal';
import { MODAL_HEADER_STYLE } from './scmGridCells';

interface Props {
  open: boolean;
  devStep: DevStep | null;
  /** open(resultStr, devStepModel, callback)이면 true(편집 + [확인]) */
  editable?: boolean;
  /** 편집 때 열 때 넘긴 글(resultStr). 없으면 devStep.result */
  resultStr?: string;
  /** callback.execute(html) — 저장이 끝난 뒤 */
  onResult?: (html: string) => void;
  onClose: () => void;
}

export const Scm11_Lookup_Result: React.FC<Props> = ({ open, devStep, editable = false, resultStr, onResult, onClose }) => {
  const initial = resultStr ?? devStep?.result ?? '';
  const [html, setHtml] = useState(initial);
  const [saving, setSaving] = useState(false);
  useEffect(() => { if (open) setHtml(initial); }, [open, initial]);

  const update = async () => {
    if (!devStep) return;
    setSaving(true);
    try {
      await scmApi.updateDevStepResult(devStep.devStepId, html);
      onResult?.(html);
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
      title="결과상세"
      width={1000}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      focusFirst={false}
      styles={{ header: MODAL_HEADER_STYLE }}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E2] confirmButton[확인].Select (L106) → update() */}
            {editable && <Button type="save" loading={saving} onClick={update}>확인</Button>}
            {/* [E1] closeButton[닫기].Select (L76, 보기) · [E3] closeButton[닫기].Select (L112, 편집) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      {editable
        ? <HtmlEditor toolbar="client" key={String(open)} value={initial} onChange={setHtml} height={520} />
        : <HtmlView html={devStep?.result ?? ''} height={560} />}
    </LookupModal>
  );
};
