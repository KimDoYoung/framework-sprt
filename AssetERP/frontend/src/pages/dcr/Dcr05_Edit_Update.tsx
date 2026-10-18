/**
 * 문서양식 상세 보기·수정 창 (E16) — Dcr05_Lookup_DocType의 "수정" 칸에서 연다 (E16은 읽기 전용 retrieveReadOnly, 수정은 문서양식등록 화면)
 * AS-IS: myApp/client/vi/dcr/Dcr05_Edit_Update.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L71-98·getEditor() L122-157: 모달 836×880 "상세 보기", 구 분(콤보 DocFormClassCode) · 제 목 · 내 용(HTML 편집기) · 비 고(125), 아래 가운데 [수정][미리보기][닫기]
 */
import React, { useEffect, useState } from 'react';
import { Input, message, Modal, Space } from 'antd';
import { dcrApi } from '@/api/dcr';
import { errorMessage } from '@/api/client';
import { DcrDocType } from '@/types/dcr';
import { Button } from '@/components/button';
import { HtmlEditor } from '@/components/form/HtmlEditor';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';

interface Props {
  /** 보여 줄 문서양식 (retrieveApproval L170-178) — null이면 닫힘 */
  model: DcrDocType | null;
  /** retrieveReadOnly(model, callback) L159-167: [수정]을 숨기고 구분·제목·비고를 읽기 전용으로 */
  readOnly?: boolean;
  /** callback.execute() — updateEdit() 성공 뒤 */
  onSaved?: () => void;
  onClose: () => void;
}

const Row: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
    <span style={{ width: 47, flex: 'none', paddingTop: 4 }}>{label}</span>
    <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
  </div>
);

/** GXT TextField 빈 값 = null */
const n = (s: string | null | undefined) => (s == null || s === '' ? null : s);

export const Dcr05_Edit_Update: React.FC<Props> = ({ model, readOnly = false, onSaved, onClose }) => {
  const [f, setF] = useState<DcrDocType | null>(model);
  const [saving, setSaving] = useState(false);
  useEffect(() => setF(model), [model]);
  if (!f || !model) return null;
  const set = <K extends keyof DcrDocType>(k: K, v: DcrDocType[K]) => setF(prev => prev && { ...prev, [k]: v });

  // [E0] 화면 열림 (생성자 L71-98) → settings(), getEditor(), show() — 모델을 받아 폼을 채운다
  // [E1] updateButton[수정].Select (L101) → updateEdit() L180-218: 구분·제목·내용이 필수 → dcr.Dcr05_DocType.updateEdit → callback.execute(); hide()
  const updateEdit = async () => {
    if (!n(f.docFormClassCode)) return message.warning('구분은 필수선택 항목입니다');
    if (!n(f.title)) return message.warning('제목은 필수입력 항목입니다');
    if (!n(f.content)) return message.warning('내용은 필수입력 항목입니다');
    setSaving(true);
    try {
      await dcrApi.updateDocType(f.docTypeId, { title: n(f.title), content: f.content ?? null, note: n(f.note), docFormClassCode: n(f.docFormClassCode) });
      onSaved?.();
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '오류'));
    } finally {
      setSaving(false);
    }
  };

  // [E2] pdfButton[미리보기].Select (L107) → makePreviewPDF() L220-273: 미리보기용 결재문서(apr.Apr01_ApprTemp.insert, 상태 99)를 만들고 PDF 뷰어(apr.Apr10_StampPDF7)를 연다.
  //   PDF 생성(RD 리포트/도장 PDF) 연동이 TOBE에 없어 자리만 둔다 (E11 재생성과 같은 결정)
  const makePreviewPDF = () => message.info('PDF 미리보기는 아직 지원하지 않습니다 (PDF 생성 연동 전).');

  return (
    <Modal
      open
      title="상세 보기"
      width={836}
      maskClosable={false}
      onCancel={onClose}
      destroyOnClose
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {!readOnly && <Button type="view" onClick={updateEdit} loading={saving}>수정</Button>}
            <Button type="view" onClick={makePreviewPDF}>미리보기</Button>
            {/* [E3] closeButton[닫기].Select (L113) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '8px 4px', maxHeight: 700, overflowY: 'auto' }}>
        <Row label="구 분">
          <SystemCodeComboBox kindCd="DocFormClassCode" style={{ width: '100%' }} disabled={readOnly}
            value={f.docFormClassCode ?? undefined} onChange={(code, name) => setF(prev => prev && { ...prev, docFormClassCode: code ?? null, docFormClassName: name ?? null })} />
        </Row>
        <Row label="제 목"><Input readOnly={readOnly} value={f.title ?? ''} onChange={e => set('title', e.target.value)} /></Row>
        <Row label="내 용">
          {/* 편집기는 만들 때 한 번만 값을 받는다(HtmlEditor) — 문서양식이 바뀌면 key로 새로 만든다. 읽기 전용에서도 원본 편집기는 막혀 있지 않다 */}
          <HtmlEditor key={f.docTypeId} value={model.content} onChange={html => set('content', html)} height={460} />
        </Row>
        <Row label="비 고"><Input.TextArea rows={5} readOnly={readOnly} value={f.note ?? ''} onChange={e => set('note', e.target.value)} /></Row>
      </div>
    </Modal>
  );
};
