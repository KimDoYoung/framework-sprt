/**
 * 오타수정 창 (V09) — 결재 차례인 사원이 문서 머리·본문을 고친다. 결재선의 "수정" 보기 아이콘으로는 같은 창이 "수정 전 내용"(읽기 전용)으로 열린다.
 * AS-IS: myApp/client/vi/apr/Apr01_Edit_ApprModi.java (365줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L80-122: 800×880 모달 "오타수정"(닫기 X 없음), 위 상신제목 · 수신/참조 · 비고, 아래 상신내용(HTML 편집기 430) · 대외문서 대표회사명/대표서명란(50) · 변경사유(100), 푸터 [저장][닫기]
 * edit() L152-186 · open() L188-213(읽기 전용, 제목 "수정 전 내용", [닫기]만) · save() L293-346
 * 12-화면우선원칙: 스크롤이 생기지 않도록 편집기 높이를 창 높이에 맞춘다(AS-IS 고정 430).
 * 스타일: MH (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useEffect, useState } from 'react';
import { Input, message, Modal } from 'antd';
import { aprExtraApi } from '@/api/apr';
import { errorMessage } from '@/api/client';
import { AprApprDetail, AprTypo } from '@/types/apr';
import { Button } from '@/components/button';
import { EditModal, EditRow, EditField } from '@/components/form/EditForm';
import { HtmlEditor } from '@/components/form/HtmlEditor';
import { HtmlView } from '@/components/form/HtmlView';

const LABEL_W = 70; // 가장 긴 라벨 4글자(상신제목·수　　신) → 70

interface Form {
  title: string; receiveName: string; referenceName: string; note: string; signCompany: string; signCeo: string; content: string; reason: string;
}
const EMPTY: Form = { title: '', receiveName: '', referenceName: '', note: '', signCompany: '', signCeo: '', content: '', reason: '' };

interface Props {
  /** edit(apprModel, callback): 고칠 문서 — 값이 있으면 열린다 */
  doc?: AprApprDetail | null;
  /** open(apprModiModel, personId): 수정 전 내용(읽기 전용) — 값이 있으면 열린다 */
  typo?: AprTypo | null;
  /** edit의 callback.execute(updateModel): 저장이 끝난 문서 — 부른 쪽이 머리·본문·결재선을 다시 읽는다 */
  onSaved?: (doc: AprApprDetail) => void;
  onClose: () => void;
}

const Bar: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ background: '#f5f5f5', padding: '4px 10px', fontSize: 12, fontWeight: 'bold', borderRadius: 4 }}>{children}</div>
);

export const Apr01_Edit_ApprModi: React.FC<Props> = ({ doc = null, typo = null, onSaved, onClose }) => {
  const readOnly = typo != null;
  const open = doc != null || typo != null;
  const [form, setForm] = useState<Form>(EMPTY);
  const [saving, setSaving] = useState(false);
  const set = (patch: Partial<Form>) => setForm(prev => ({ ...prev, ...patch }));

  // edit() L152-186: 문서 값으로 채우고, 이 사원의 지난 변경사유를 읽는다(apr.Apr92_ApprModi.selectByPersonId). open() L188-213: 수정 전 내용으로 채운다
  useEffect(() => {
    if (typo) {
      setForm({ title: typo.title ?? '', receiveName: typo.receiveName ?? '', referenceName: typo.referenceName ?? '', note: typo.note ?? '', signCompany: typo.signCompany ?? '', signCeo: typo.signCeo ?? '', content: typo.content ?? '', reason: typo.reason ?? '' });
      return;
    }
    if (!doc) { setForm(EMPTY); return; }
    setForm({ title: doc.title ?? '', receiveName: doc.receiveName ?? '', referenceName: doc.referenceName ?? '', note: doc.note ?? '', signCompany: doc.signCompany ?? '', signCeo: doc.signCeo ?? '', content: doc.content ?? '', reason: '' });
    let alive = true;
    aprExtraApi.getTypo(doc.apprId).then(t => { if (alive && t?.reason) set({ reason: t.reason }); }).catch(err => message.error(errorMessage(err, '조회 실패')));
    return () => { alive = false; };
  }, [doc, typo]);

  const info = (content: string) => Modal.info({ title: '확인', content, okText: '확인' });

  // save() L293-346: 검사 순서와 문구는 원본 그대로
  const doSave = async () => {
    if (!doc) return;
    setSaving(true);
    try {
      const updated = await aprExtraApi.saveTypo(doc.apprId, form);
      info('저장이 완료되었습니다');
      onSaved?.(updated);
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };
  const save = () => {
    if (!doc) return;
    if (form.title === '') return info('제목은 반드시 입력하셔야 합니다');
    if (form.reason === '') return info('변경사유는 반드시 입력하셔야 합니다');
    if (form.title.length > 200) return info('상신제목 글자수가 초과되었습니다.(200자 제한)');
    if (doc.inOutTypeCode === '10' && form.receiveName === '') return info('수신자는 필수입력 항목입니다');
    if (form.content === '') return info('내용은 필수입력 항목입니다');
    // [E1] saveButton[저장].Select (L127) → [E2] messageBox "수정된 내용을 저장하시겠습니까?" [YES] (L132) → save()
    Modal.confirm({ title: '확인', content: '수정된 내용을 저장하시겠습니까?', okText: '예', cancelText: '아니오', width: 350, onOk: doSave });
  };

  return (
    <EditModal
      open={open}
      title={readOnly ? '수정 전 내용' : '오타수정'}
      width={820}
      style={{ top: 20 }}
      closable={false}
      onCancel={onClose}
      destroyOnHidden
      focusFirst={false}
      footer={
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
          {!readOnly && <Button type="save" loading={saving} onClick={save}>저장</Button>}
          {/* [E3] closeButton[닫기].Select (L144) → hide() */}
          <Button type="close" onClick={onClose}>닫기</Button>
        </div>
      }
    >
      <>
        {/* getApprovalForm() L223-247 */}
        <EditField label="상신제목" labelWidth={LABEL_W}><Input value={form.title} readOnly={readOnly} onChange={e => set({ title: e.target.value })} /></EditField>
        <EditRow>
          <EditField label="수　　신" labelWidth={LABEL_W} width={386}><Input value={form.receiveName} readOnly={readOnly} onChange={e => set({ receiveName: e.target.value })} /></EditField>
          <EditField label="참　　조" labelWidth={LABEL_W} width={386}><Input value={form.referenceName} readOnly={readOnly} onChange={e => set({ referenceName: e.target.value })} /></EditField>
        </EditRow>
        <EditField label="비　　고" labelWidth={LABEL_W}><Input value={form.note} readOnly={readOnly} onChange={e => set({ note: e.target.value })} /></EditField>
        {/* getHtmlForm() L249-286 */}
        <Bar>상신내용</Bar>
        {readOnly
          ? <HtmlView html={form.content} height={300} />
          : <HtmlEditor key={doc?.apprId} value={form.content} onChange={html => set({ content: html })} height={Math.max(240, Math.min(300, window.innerHeight - 690))} />}
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1 }}><Bar>대외문서 대표회사명</Bar></div>
          <div style={{ flex: 1 }}><Bar>대외문서 대표서명란</Bar></div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Input.TextArea style={{ flex: 1, height: 50, resize: 'none' }} placeholder="대외문서 하단표기" value={form.signCompany} readOnly={readOnly} onChange={e => set({ signCompany: e.target.value })} />
          <Input.TextArea style={{ flex: 1, height: 50, resize: 'none' }} placeholder="대외문서 하단표기" value={form.signCeo} readOnly={readOnly} onChange={e => set({ signCeo: e.target.value })} />
        </div>
        <Bar>변경사유</Bar>
        <Input.TextArea style={{ height: 70, resize: 'none' }} value={form.reason} readOnly={readOnly} onChange={e => set({ reason: e.target.value })} />
      </>
    </EditModal>
  );
};
