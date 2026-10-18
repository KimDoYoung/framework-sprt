/**
 * 문서양식 등록 창 (E18) — Dcr05_Tab_DocType의 [등록]에서 연다. 로그인 회사에 새 양식을 만든다
 * AS-IS: myApp/client/vi/dcr/Dcr05_Edit_DocType.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L65-100·getEditor() L102-137: 모달 800×880 "문서양식 등록", 구 분(콤보 DocFormClassCode) · 제 목 · 내 용(HTML 편집기) · 비 고(125), 아래 가운데 [저장][닫기]
 */
import React, { useState } from 'react';
import { Input, message, Modal, Space } from 'antd';
import { dcrApi } from '@/api/dcr';
import { errorMessage } from '@/api/client';
import { Button } from '@/components/button';
import { HtmlEditor } from '@/components/form/HtmlEditor';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';

interface Props {
  open: boolean;
  /** callback.execute() — update() 성공 뒤 */
  onSaved: () => void;
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

export const Dcr05_Edit_DocType: React.FC<Props> = ({ open, onSaved, onClose }) => {
  const [docFormClassCode, setDocFormClassCode] = useState<string | undefined>();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  // [E1] updateButton[저장].Select (L74) → update() L144-183: 구분·제목·내용이 필수 → dcr.Dcr05_DocType.update → callback.execute(); hide()
  const update = async () => {
    if (!n(docFormClassCode)) return message.warning('구분은 필수선택 항목입니다');
    if (!n(title)) return message.warning('제목은 필수입력 항목입니다');
    if (!n(content)) return message.warning('내용은 필수입력 항목입니다');
    setSaving(true);
    try {
      await dcrApi.createDocType({ title: n(title), content, note: n(note), docFormClassCode: n(docFormClassCode) });
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
      open={open}
      title="문서양식 등록"
      width={800}
      maskClosable={false}
      onCancel={onClose}
      destroyOnClose
      afterClose={() => { setDocFormClassCode(undefined); setTitle(''); setContent(''); setNote(''); }}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={update} loading={saving}>저장</Button>
            {/* [E2] closeButton[닫기].Select (L83) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      {/* [E0] 화면 열림 (생성자 L65-100) → getEditor(), show() — 빈 모델로 폼을 연다 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '8px 4px', maxHeight: 700, overflowY: 'auto' }}>
        <Row label="구 분">
          <SystemCodeComboBox kindCd="DocFormClassCode" style={{ width: '100%' }} value={docFormClassCode} onChange={code => setDocFormClassCode(code)} />
        </Row>
        <Row label="제 목"><Input value={title} onChange={e => setTitle(e.target.value)} /></Row>
        <Row label="내 용"><HtmlEditor value="" onChange={html => setContent(html)} height={460} /></Row>
        <Row label="비 고"><Input.TextArea rows={5} value={note} onChange={e => setNote(e.target.value)} /></Row>
      </div>
    </Modal>
  );
};
