/**
 * 회사규정 편집 창 (E10) — Bbs15_Tab_CompanyRuleManager의 [등록]·[등록(복사)]·수정 칸에서 연다
 * AS-IS: myApp/client/vi/bbs/Bbs15_Edit_CompanyRuleManager.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L85-168: 모달 "회사규정" 1000×850, 라벨 110, 회사규정구분(300)·사용·종료일 / 회사규정코드·개정회차·제개정일 / 회사규정명 / 내용(HTML 편집기 500) / 비고, 아래 가운데 [첨부파일(n건)]·[저장]·[닫기]
 * 내용 편집기는 CKEditor(iframe) → HtmlEditor(Tiptap, 사용자 결정 2026-10-13)
 */
import React, { useEffect, useState } from 'react';
import { Checkbox, DatePicker, Input, InputNumber, message, Modal, Space, Typography } from 'antd';
import dayjs from 'dayjs';
import { bbsApi } from '@/api/bbs';
import { fileApi } from '@/api/file';
import { errorMessage } from '@/api/client';
import { BbsCompanyRule } from '@/types/bbs';
import { Button } from '@/components/button';
import { HtmlEditor } from '@/components/form/HtmlEditor';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { Bbs15_Lookup_File } from './Bbs15_Lookup_File';

/** 열 때 받는 값: isNew면 DB에 아직 없는 새 행(등록·복사 — companyRuleId는 미리 받은 새 ID) */
export type BbsCompanyRuleEdit = Partial<BbsCompanyRule> & { isNew?: boolean };

interface Props {
  /** 편집할 회사규정 — null이면 닫힘 */
  model: BbsCompanyRuleEdit | null;
  onClose: () => void;
  /** AS-IS callback.execute() — 저장 뒤 부르는 쪽이 다시 조회 */
  onDone: () => void;
}

/** 라벨 폭 110 (form.setLabelWidth(110)) */
const Field: React.FC<{ label: string; width?: number | string; required?: boolean; children: React.ReactNode }> = ({ label, width = '100%', required, children }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', width }}>
    <Typography.Text style={{ width: 110, flex: 'none', lineHeight: '32px', color: required ? '#0069B4' : undefined }}>{label}</Typography.Text>
    <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
  </div>
);

export const Bbs15_Edit_CompanyRuleManager: React.FC<Props> = ({ model, onClose, onDone }) => {
  const [f, setF] = useState<BbsCompanyRuleEdit | null>(model);
  const [saving, setSaving] = useState(false);
  const [fileCount, setFileCount] = useState(0);
  const [fileOpen, setFileOpen] = useState(false);
  useEffect(() => setF(model), [model]);

  // setFileButtonText() L260-271: 서비스 sys.Sys10_File.selectByParentId → "첨부파일(n건)"
  const id = f?.companyRuleId;
  const setFileButtonText = React.useCallback(async () => {
    if (id == null) return;
    try {
      setFileCount((await fileApi.searchByParentId(id)).length);
    } catch {
      setFileCount(0);
    }
  }, [id]);
  useEffect(() => { void setFileButtonText(); }, [setFileButtonText]);

  // [E0] 화면 열림 (생성자 L85-168) → getEditor(): 아래 JSX (편집 모드는 editCompanyRule() L170-190 — 첨부파일 건수 setFileButtonText())
  if (!f) return null;
  const set = <K extends keyof BbsCompanyRuleEdit>(k: K, v: BbsCompanyRuleEdit[K]) => setF(prev => prev && { ...prev, [k]: v });
  /** GXT TextField 빈 값 = null */
  const n = (s: string | null | undefined) => (s == null || s === '' ? null : s);

  // [E1] updateButton[저장].Select (L94) → update() L273-316
  const update = async () => {
    if (n(f.ruleType) == null) return message.warning('회사규정구분은 필수선택사항입니다.');
    if (n(f.companyRuleCode) == null) return message.warning('회사규정코드는 필수입력사항입니다.');
    if (f.companyRuleCode!.length > 8) return message.warning('회사규정코드는 최대 8자리까지 입력가능합니다');
    if (f.revisionDate == null) return message.warning('제개정일자는 필수입력입니다.');
    if (f.revisionNo == null) return message.warning('개정회차는 필수입력입니다.');
    if (n(f.title) == null) return message.warning('회사규정명은 필수입력사항입니다.');
    setSaving(true);
    try {
      const req = {
        companyRuleId: f.companyRuleId, companyId: f.companyId, ruleType: f.ruleType ?? null, companyRuleCode: f.companyRuleCode ?? null, title: f.title ?? null,
        content: n(f.content), note: n(f.note), seq: f.seq ?? null, revisionDate: f.revisionDate ?? null, revisionNo: f.revisionNo ?? null,
        publicYn: f.publicYn ?? false, closeDate: f.closeDate ?? null,
      };
      if (f.isNew) await bbsApi.createCompanyRule(req);
      else await bbsApi.updateCompanyRule(f.companyRuleId!, req);
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
    <Modal
      open
      title="회사규정"
      width={1000}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E3] addFileButton[첨부파일(n건)].Select (L115) → Bbs15_Lookup_File.open(companyRuleId): 닫으면 setFileButtonText() */}
            <Button type="upload" onClick={() => setFileOpen(true)}>{`첨부파일(${fileCount}건)`}</Button>
            <Button type="save" onClick={update} loading={saving}>저장</Button>
            {/* [E2] closeButton[닫기].Select (L100) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '8px 2px 2px' }}>
        {/* hlc01/hlc02: 300 · 여백 90 · 220 · 여백 90 · 250 (L139-150) */}
        <Space size={0} align="start">
          <Field label="회사규정구분 " width={300} required>
            <SystemCodeComboBox kindCd="CompanyRuleType" placeholder="(선택하세요)" style={{ width: '100%' }} value={f.ruleType ?? undefined}
              onChange={code => set('ruleType', code ?? null)} />
          </Field>
          <div style={{ width: 90 }} />
          <Field label="사용 " width={220}><Checkbox checked={!!f.publicYn} onChange={e => set('publicYn', e.target.checked)} /></Field>
          <div style={{ width: 90 }} />
          <Field label="종료일 " width={250}>
            <DatePicker style={{ width: '100%' }} value={f.closeDate ? dayjs(f.closeDate) : null}
              onChange={d => set('closeDate', d ? d.format('YYYY-MM-DD') : null)} />
          </Field>
        </Space>
        <Space size={0} align="start">
          <Field label="회사규정코드 " width={300} required>
            <Input value={f.companyRuleCode ?? ''} onChange={e => set('companyRuleCode', e.target.value)} />
          </Field>
          <div style={{ width: 90 }} />
          <Field label="개정회차 " width={220} required>
            <InputNumber style={{ width: '100%' }} precision={0} value={f.revisionNo ?? null} onChange={v => set('revisionNo', v == null ? null : Number(v))} />
          </Field>
          <div style={{ width: 90 }} />
          <Field label="제개정일 " width={250} required>
            <DatePicker style={{ width: '100%' }} value={f.revisionDate ? dayjs(f.revisionDate) : null}
              onChange={d => set('revisionDate', d ? d.format('YYYY-MM-DD') : null)} />
          </Field>
        </Space>
        <Field label="회사규정명 " required><Input value={f.title ?? ''} onChange={e => set('title', e.target.value)} /></Field>
        <Field label="내용 ">
          {/* 편집기는 만들 때 한 번 내용을 넣는다(AS-IS setHtmlText) — 열 때마다 다시 만든다 */}
          <HtmlEditor key={`${f.companyRuleId}-${f.isNew ? 'n' : 'e'}`} value={f.content} onChange={html => set('content', html)} height={420} />
        </Field>
        <Field label="비고 "><Input.TextArea rows={3} value={f.note ?? ''} onChange={e => set('note', e.target.value)} /></Field>
      </div>
      <Bbs15_Lookup_File open={fileOpen} parentId={f.companyRuleId} onClose={() => { setFileOpen(false); void setFileButtonText(); }} />
    </Modal>
  );
};
