/**
 * 사용료청구 메일 양식 & 태그 창 (EE22) — Biz50_Lookup_ErpSetup의 [메일양식]이 연다
 * AS-IS: myApp/client/vi/biz/Biz50_Lookup_MailMapping.java (154줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L54-88: 950×820 모달 "양식 & 태그", 왼쪽 CKEditor(720×715) + 오른쪽 150 태그 목록(TempData.getMailMappingList), 아래 가운데 [저장][닫기]
 * open(erpSetupModel) L50: 부르는 쪽이 메일양식 행(없으면 insertMailForm 으로 빈 행)을 넘긴다. 열릴 때 mailForm 이 있으면 에디터에 넣는다(L65-67)
 * 편집기는 AS-IS CKEditor 대신 HtmlEditor(Tiptap, 11 §3) — 표·글꼴 색이 없어 원본 HTML에 표가 있으면 편집 때 사라질 수 있다
 */
import React, { useState } from 'react';
import { message, Space } from 'antd';
import { bizErpSetupApi } from '@/api/bizErp';
import { errorMessage } from '@/api/client';
import { BizErpMailForm } from '@/types/bizErp';
import { Button } from '@/components/button';
import { HtmlEditor } from '@/components/form/HtmlEditor';
import { LookupModal } from '@/components/lookup/LookupModal';
import { getErpMailMappingTags } from './bizErpTags';

interface Props {
  /** open(erpSetupModel) — 값이 있으면 열린다 (메일양식 행) */
  target: BizErpMailForm | null;
  onClose: () => void;
}

export const Biz50_Lookup_MailMapping: React.FC<Props> = ({ target, onClose }) => {
  const [html, setHtml] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // [E1] updateButton[저장].Select (L70) → update() L122-135: mailForm 을 에디터 내용으로 바꿔 biz.Biz50_ErpSetup.insertMailForm → hide()
  const update = async () => {
    if (!target) return;
    setSaving(true);
    try {
      await bizErpSetupApi.saveMailForm(target.erpSetupId, html ?? target.mailForm ?? null);
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <LookupModal
      open={target !== null}
      title="양식 & 태그"
      width={950}
      style={{ top: 20 }}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      afterOpenChange={open => { if (open) setHtml(null); }}
      styles={{
        header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 12 },
        footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 12 },
      }}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={update} loading={saving}>저장</Button>
            {/* [E2] closeButton[닫기].Select (L76) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      {/* [E0] 화면 열림 (생성자 L54-88) → getEditor(), show(). 편집기는 만들 때 한 번만 값을 넣는다 → 메일양식 행이 바뀌면 key 로 새로 */}
      <div style={{ display: 'flex', gap: 16 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <HtmlEditor key={target?.erpSetupId ?? 'none'} value={target?.mailForm ?? undefined} onChange={setHtml} height={560} />
        </div>
        <div style={{ width: 150, flex: 'none', paddingTop: 40, lineHeight: '180%', fontWeight: 'bold' }}>
          {getErpMailMappingTags().map(t => <div key={t}>{`#{${t}}`}</div>)}
        </div>
      </div>
    </LookupModal>
  );
};
