/**
 * 작성요령 및 변경이력 등록·수정 창 (E19) — Rpt10_Tab_FssSubmit의 [등록]·수정 아이콘에서 연다
 * AS-IS: myApp/client/vi/rpt/Rpt10_Edit_WriteGuide.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * view()·edit() L57-77·getEditor() L79-117: 모달 700×550, 제목 "작성요령 및 변경이력 등록"/"… 수정",
 *   보고서코드 200 · 보고서명 480 / 제출주기(콤보 CycleCode001) 200 · 작성대상 480 / 작성요령(230) / 변경이력(150), 아래 가운데 [저장][닫기]
 */
import React, { useEffect, useState } from 'react';
import { Input, message, Modal, Space } from 'antd';
import { rptApi } from '@/api/rpt';
import { errorMessage } from '@/api/client';
import { RptFssSubmit } from '@/types/rpt';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';

interface Props {
  /** view() = 새 모델(submitId 없음), edit(model) = 그 행. null이면 닫힘 */
  model: Partial<RptFssSubmit> | null;
  /** callback.execute() — update() 성공 뒤 */
  onSaved: () => void;
  onClose: () => void;
}

const Label: React.FC<{ label: string; width: number; children: React.ReactNode }> = ({ label, width, children }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, width }}>
    <span style={{ width: 82, flex: 'none', paddingTop: 4 }}>{label}</span>
    <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
  </div>
);

/** GXT TextField 빈 값 = null */
const n = (s: string | null | undefined) => (s == null || s === '' ? null : s);

export const Rpt10_Edit_WriteGuide: React.FC<Props> = ({ model, onSaved, onClose }) => {
  const [f, setF] = useState<Partial<RptFssSubmit>>({});
  const [saving, setSaving] = useState(false);
  useEffect(() => setF(model ?? {}), [model]);
  if (!model) return null;
  const isNew = model.submitId == null;
  const set = <K extends keyof RptFssSubmit>(k: K, v: RptFssSubmit[K]) => setF(prev => ({ ...prev, [k]: v }));

  // [E2] updateButton[저장].Select (L135) → update() L155-180: rpt.Rpt10_FssSubmit.modelUpdate → callback.execute(); hide()
  const update = async () => {
    setSaving(true);
    try {
      await rptApi.saveFssSubmit({
        submitId: f.submitId ?? null, reportCode: n(f.reportCode), reportName: n(f.reportName), submitCycleCode: n(f.submitCycleCode),
        writeTarget: n(f.writeTarget), writeGuide: n(f.writeGuide), reviseHistory: n(f.reviseHistory),
      });
      onSaved();
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '오류'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open
      title={isNew ? '작성요령 및 변경이력 등록' : '작성요령 및 변경이력 수정'}
      width={700}
      maskClosable={false}
      onCancel={onClose}
      destroyOnClose
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={update} loading={saving}>저장</Button>
            {/* [E3] closeButton[닫기].Select (L141) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      {/* view() L57-66·edit() L68-77 → settings(): 모델을 폼에 채운다 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '8px 4px' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <Label label="보고서코드" width={220}><Input value={f.reportCode ?? ''} maxLength={5} onChange={e => set('reportCode', e.target.value)} /></Label>
          <Label label="보고서명" width={420}><Input value={f.reportName ?? ''} onChange={e => set('reportName', e.target.value)} /></Label>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Label label="제출주기" width={220}>
            {/* [E1] submitCycleName[제출주기].Collapse (L128) → submitCycleCode = 고른 코드 */}
            <SystemCodeComboBox kindGroupCd="CycleCode001" style={{ width: '100%' }} value={f.submitCycleCode ?? undefined}
              onChange={(code, name) => setF(prev => ({ ...prev, submitCycleCode: code ?? null, submitCycleName: name ?? null }))} />
          </Label>
          <Label label="작성대상" width={420}><Input value={f.writeTarget ?? ''} onChange={e => set('writeTarget', e.target.value)} /></Label>
        </div>
        <Label label="작성요령" width={680}><Input.TextArea rows={10} value={f.writeGuide ?? ''} onChange={e => set('writeGuide', e.target.value)} /></Label>
        <Label label="변경이력" width={680}><Input.TextArea rows={6} value={f.reviseHistory ?? ''} onChange={e => set('reviseHistory', e.target.value)} /></Label>
      </div>
    </Modal>
  );
};
