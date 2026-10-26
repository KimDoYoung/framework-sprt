/**
 * 펀드규약 편집 창 (P12) — Fnd25_Tab_FundTermsManager [등록] · Fnd25_Grid_FundTermsDetail [등록][등록(복사)] · 수정 아이콘이 연다
 * AS-IS: myApp/client/vi/fnd/Fnd25_Edit_FundTermsManager.java (491줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L97-192: 모달 "펀드규약" 1000×850, 라벨 110, 펀드규약구분(360)·종료일(220)·사용(220) / 조회순서(180)·개정회차(180)·제개정일(220)·예탁원코드(270)
 *   / 펀드규약명(950) / 내용(HTML 편집기 500) / 비고, 아래 가운데 [첨부파일(n건)][저장][닫기]
 * 모드 4개: insertFundTerms() L262-286 · newFundTerms() L224-260 · copyFundTerms() L288-334 · editFundTerms() L194-222
 *   (규약구분·조회순서·예탁원코드는 insert만 편집 가능). 새 ID(termsDetailId)는 열기 전에 받아 둔다(DBUtil.setSeq)
 * 내용 편집기는 CKEditor(iframe) → HtmlEditor(Tiptap, 사용자 결정 2026-10-13)
 */
import React, { useCallback, useEffect, useState } from 'react';
import { Checkbox, DatePicker, Input, InputNumber, message, Space, Typography } from 'antd';
import dayjs from 'dayjs';
import { fndApi } from '@/api/fnd';
import { fileApi } from '@/api/file';
import { errorMessage } from '@/api/client';
import { TermsRevision } from '@/types/fnd';
import { Button } from '@/components/button';
import { HtmlEditor } from '@/components/form/HtmlEditor';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { Com01_Lookup_RelateFile } from '@/components/lookup/Com01_Lookup_RelateFile';
import { Fnd01_Lookup_SelectSingle } from '@/components/lookup/Fnd01_Lookup_SelectSingle';
import { LookupInput } from '@/components/lookup/LookupInput';
import { LookupModal } from '@/components/lookup/LookupModal';

export type TermsEditMode = 'insert' | 'new' | 'copy' | 'edit';

/** 열 때 받는 값: model은 편집 창이 처음 보이는 값(새 termsDetailId 포함) */
export interface TermsEditTarget {
  mode: TermsEditMode;
  model: TermsRevision;
}

interface Props {
  /** 값이 있으면 열린다 */
  target: TermsEditTarget | null;
  /** 저장 뒤 (AS-IS callback.execute()) — 부르는 쪽이 다시 조회 */
  onDone: () => void;
  onClose: () => void;
}

/** 라벨 폭 110 (form.setLabelWidth(110)) */
const Field: React.FC<{ label: string; width?: number | string; required?: boolean; children: React.ReactNode }> = ({ label, width = '100%', required, children }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', width }}>
    <Typography.Text style={{ width: 110, flex: 'none', lineHeight: '32px', color: required ? '#0069B4' : undefined }}>{label}</Typography.Text>
    <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
  </div>
);

export const Fnd25_Edit_FundTermsManager: React.FC<Props> = ({ target, onDone, onClose }) => {
  const [f, setF] = useState<TermsRevision | null>(target?.model ?? null);
  const [saving, setSaving] = useState(false);
  const [fileCount, setFileCount] = useState(0);
  const [fileOpen, setFileOpen] = useState(false);
  const [fundOpen, setFundOpen] = useState(false);
  useEffect(() => setF(target?.model ?? null), [target]);

  const mode = target?.mode;
  /** originRevisionNo·originFundId = editFundTerms() L194-222에서만 채운다(new·copy·insert는 null — 원본 그대로) */
  const originRevisionNo = mode === 'edit' ? target!.model.revisionNo ?? null : null;
  const originFundId = mode === 'edit' ? target!.model.fundId ?? null : null;
  /** 규약구분·조회순서·예탁원코드는 insert만 편집 가능 (new·copy·edit는 setEnabled(false)) */
  const locked = mode !== 'insert';

  // setFileButtonText() L336-347: 서비스 sys.Sys10_File.selectByParentId → "첨부파일(n건)"
  const id = f?.termsDetailId;
  const setFileButtonText = useCallback(async () => {
    if (id == null) return;
    try {
      setFileCount((await fileApi.searchByParentId(id)).length);
    } catch {
      setFileCount(0);
    }
  }, [id]);
  useEffect(() => { void setFileButtonText(); }, [setFileButtonText, mode]);

  // [E0] 화면 열림 (생성자 L97-192) → getEditor(): 아래 JSX
  if (!f || !target) return null;
  const set = <K extends keyof TermsRevision>(k: K, v: TermsRevision[K]) => setF(prev => prev && { ...prev, [k]: v });
  /** GXT TextField 빈 값 = null */
  const n = (s: string | null | undefined) => (s == null || s === '' ? null : s);

  // [E1] updateButton[저장].Select (L106) → update() L363-401 → ksdFundCheck() L403-422 → updateData() L424-445
  const update = async () => {
    if (n(f.termsType) == null) return message.warning('펀드규약구분은 필수선택사항입니다.');
    if (f.revisionDate == null) return message.warning('제개정일자는 필수입력입니다.');
    if (f.revisionNo == null) return message.warning('개정회차는 필수입력입니다.');
    if (f.seq == null) return message.warning('조회순서는 필수입력입니다.');
    if (n(f.termsName) == null) return message.warning('펀드규약명은 필수입력사항입니다.');
    setSaving(true);
    try {
      await fndApi.saveTermsRevision({
        mode: target.mode, originRevisionNo, originFundId, termsDetailId: f.termsDetailId, termsId: f.termsId ?? null,
        termsType: f.termsType ?? null, termsName: f.termsName ?? null, seq: f.seq ?? null, fundId: f.fundId ?? null, closeDate: f.closeDate ?? null,
        content: f.content ?? null, note: n(f.note), revisionDate: f.revisionDate ?? null, revisionNo: f.revisionNo ?? null, useYn: !!f.useYn,
      });
      message.info('저장이 완료되었습니다');
      onDone();
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <LookupModal
      open
      title="펀드규약"
      width={1000}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E3] addFileButton[첨부파일(n건)].Select (L127) → Com01_Lookup_RelateFile.open(termsDetailId): 닫으면 setFileButtonText() */}
            <Button type="upload" onClick={() => setFileOpen(true)}>{`첨부파일(${fileCount}건)`}</Button>
            <Button type="save" onClick={update} loading={saving}>저장</Button>
            {/* [E2] closeButton[닫기].Select (L112) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '8px 2px 2px' }}>
        {/* hlc01: 360 · 여백 40 · 220 · 여백 160 · 220 (L145-150) */}
        <Space size={0} align="start">
          <Field label="펀드규약구분 " width={360} required>
            <SystemCodeComboBox kindCd="FundTermsType" placeholder="(선택하세요)" disabled={locked} style={{ width: '100%' }} value={f.termsType ?? undefined}
              onChange={code => set('termsType', code ?? null)} />
          </Field>
          <div style={{ width: 40 }} />
          <Field label="종료일 " width={220}>
            <DatePicker style={{ width: '100%' }} value={f.closeDate ? dayjs(f.closeDate) : null}
              onChange={d => set('closeDate', d ? d.format('YYYY-MM-DD') : null)} />
          </Field>
          <div style={{ width: 160 }} />
          <Field label="사용 " width={220}><Checkbox checked={!!f.useYn} onChange={e => set('useYn', e.target.checked)} /></Field>
        </Space>
        {/* hlc02: 180 · 180 · 여백 40 · 220 · 여백 60 · 270 (L152-158) */}
        <Space size={0} align="start">
          <Field label="조회순서 " width={180} required>
            <InputNumber style={{ width: '100%' }} precision={0} disabled={locked} value={f.seq ?? null} onChange={v => set('seq', v == null ? null : Number(v))} />
          </Field>
          <Field label="개정회차 " width={180} required>
            <InputNumber style={{ width: '100%' }} precision={0} value={f.revisionNo ?? null} onChange={v => set('revisionNo', v == null ? null : Number(v))} />
          </Field>
          <div style={{ width: 40 }} />
          <Field label="제개정일 " width={220} required>
            <DatePicker style={{ width: '100%' }} value={f.revisionDate ? dayjs(f.revisionDate) : null}
              onChange={d => set('revisionDate', d ? d.format('YYYY-MM-DD') : null)} />
          </Field>
          <div style={{ width: 60 }} />
          <Field label="예탁원코드 " width={270} required>
            {/* [E4] ksdFundCode[예탁원코드].TriggerClick (L141) → openLookupOpr() L349-361: Fnd01_Lookup_SelectSingle.open — 고르면 채우고, 안 고르면 그대로 */}
            <LookupInput value={f.ksdFundCode ?? ''} width={170} disabled={locked} onOpen={() => setFundOpen(true)} />
          </Field>
        </Space>
        <Field label="펀드규약명 " required><Input value={f.termsName ?? ''} onChange={e => set('termsName', e.target.value)} /></Field>
        <Field label="내용 ">
          {/* 편집기는 만들 때 한 번 내용을 넣는다(AS-IS setHtmlText) — 열 때마다 다시 만든다 */}
          <HtmlEditor key={`${f.termsDetailId}-${mode}`} value={f.content} onChange={html => set('content', html)} height={420} />
        </Field>
        <Field label="비고 "><Input.TextArea rows={3} value={f.note ?? ''} onChange={e => set('note', e.target.value)} /></Field>
      </div>
      <Com01_Lookup_RelateFile open={fileOpen} parentId={f.termsDetailId} onClose={() => { setFileOpen(false); void setFileButtonText(); }} />
      <Fnd01_Lookup_SelectSingle
        open={fundOpen}
        onResult={fund => { if (fund) setF(prev => prev && { ...prev, ksdFundCode: fund.ksdFundCode ?? null, fundId: fund.fundId }); }}
        onClose={() => setFundOpen(false)}
      />
    </LookupModal>
  );
};
