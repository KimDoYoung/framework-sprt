/**
 * 펀드규약 편집 창 (P12) — Fnd25_Tab_FundTermsManager [등록] · Fnd25_Grid_FundTermsDetail [등록][등록(복사)] · 수정 아이콘이 연다
 * AS-IS: myApp/client/vi/fnd/Fnd25_Edit_FundTermsManager.java (491줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L97-193: 모달 "펀드규약" 1000×850, 라벨 120, 펀드규약구분(400)·종료일(220)·사용(220) / 조회순서(200)·개정회차(200)·제개정일(220)·예탁원펀드코드(270)
 *   / 펀드명(950, 읽기 전용 정식명) / 내용(HTML 편집기 500) / 비고, 아래 가운데 [첨부파일(n건)][저장][닫기]
 * 원본 2026-10-28(CH-0172): 펀드규약명 입력칸 → 펀드명(정식명, 읽기 전용), 필수는 펀드규약명 대신 예탁원펀드코드,
 *   [저장]의 예탁원코드 중복 검사(ksdFundCheck)는 새 규약(insert)만 — 서버가 같은 규칙으로 막는다. 펀드규약명은 원래 값 그대로 저장(편집 칸 없음)
 * 모드 4개: insertFundTerms() L262-286 · newFundTerms() L224-260 · copyFundTerms() L288-334 · editFundTerms() L194-222
 *   (규약구분·조회순서·예탁원코드는 insert만 편집 가능). 새 ID(termsDetailId)는 열기 전에 받아 둔다(DBUtil.setSeq)
 * 내용 편집기는 CKEditor(iframe) → HtmlEditor(Tiptap, 사용자 결정 2026-10-13)
 * 스타일: MH (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useCallback, useEffect, useState } from 'react';
import { Checkbox, DatePicker, Input, InputNumber, message, Space } from 'antd';
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
import { EditModal, EditRow, EditField } from '@/components/form/EditForm';

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

/** 라벨 칸 폭: 가장 긴 라벨 '예탁원펀드코드'(7글자) 기준 110 (AS-IS 120). 필수 라벨은 파란색 */
const LW = 110;
const req = (text: string) => <span style={{ color: '#0069B4' }}>{text}</span>;

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
    if (f.fundId == null) return message.warning('예탁원펀드코드는 필수선택사항입니다.');  // 원본 2026-10-28 (펀드규약명 검사는 주석 처리)
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
    <EditModal
      open
      title="펀드규약"
      width={1000}
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
        {/* hlc01: 400 · 220 · 220 (L145-150, 원본 2026-10-28) — 안쪽 폭 960 − 칸 사이 16 = 944로 비례 확대: 450·247·247 */}
        <EditRow>
          <EditField label={req('펀드규약구분')} labelWidth={LW} width={450}>
            <SystemCodeComboBox kindCd="FundTermsType" placeholder="(선택하세요)" disabled={locked} style={{ width: '100%' }} value={f.termsType ?? undefined}
              onChange={code => set('termsType', code ?? null)} />
          </EditField>
          <EditField label="종료일" labelWidth={LW} width={247}>
            <DatePicker style={{ width: '100%' }} value={f.closeDate ? dayjs(f.closeDate) : null}
              onChange={d => set('closeDate', d ? d.format('YYYY-MM-DD') : null)} />
          </EditField>
          <EditField label="사용" labelWidth={LW} width={247}><Checkbox checked={!!f.useYn} onChange={e => set('useYn', e.target.checked)} /></EditField>
        </EditRow>
        {/* hlc02: 200 · 200 · 220 · 270 (L152-158, 원본 2026-10-28) — 안쪽 폭 960 − 칸 사이 24 = 936으로 비례 확대: 211·211·232·282 */}
        <EditRow>
          <EditField label={req('조회순서')} labelWidth={LW} width={211}>
            <InputNumber style={{ width: '100%' }} precision={0} disabled={locked} value={f.seq ?? null} onChange={v => set('seq', v == null ? null : Number(v))} />
          </EditField>
          <EditField label={req('개정회차')} labelWidth={LW} width={211}>
            <InputNumber style={{ width: '100%' }} precision={0} value={f.revisionNo ?? null} onChange={v => set('revisionNo', v == null ? null : Number(v))} />
          </EditField>
          <EditField label={req('제개정일')} labelWidth={LW} width={232}>
            <DatePicker style={{ width: '100%' }} value={f.revisionDate ? dayjs(f.revisionDate) : null}
              onChange={d => set('revisionDate', d ? d.format('YYYY-MM-DD') : null)} />
          </EditField>
          <EditField label={req('예탁원펀드코드')} labelWidth={LW} width={282}>
            {/* [E4] ksdFundCode[예탁원펀드코드].TriggerClick (L142) → openLookupOpr() L349-361: Fnd01_Lookup_SelectSingle.open — 고르면 채우고, 안 고르면 그대로 */}
            <LookupInput value={f.ksdFundCode ?? ''} width={160} disabled={locked} onOpen={() => setFundOpen(true)} />
          </EditField>
        </EditRow>
        {/* 원본 2026-10-28: 펀드규약명 → 펀드명(fundFullName, setEnabled(false)) */}
        <EditField label={req('펀드명')} labelWidth={LW}><Input disabled value={f.fundFullName ?? ''} /></EditField>
        <EditField label="내용" labelWidth={LW}>
          {/* 편집기는 만들 때 한 번 내용을 넣는다(AS-IS setHtmlText) — 열 때마다 다시 만든다 */}
          <HtmlEditor key={`${f.termsDetailId}-${mode}`} value={f.content} onChange={html => set('content', html)} height={420} />
        </EditField>
        <EditField label="비고" labelWidth={LW}><Input.TextArea rows={3} value={f.note ?? ''} onChange={e => set('note', e.target.value)} /></EditField>
      <Com01_Lookup_RelateFile open={fileOpen} parentId={f.termsDetailId} onClose={() => { setFileOpen(false); void setFileButtonText(); }} />
      <Fnd01_Lookup_SelectSingle
        open={fundOpen}
        onResult={fund => { if (fund) setF(prev => prev && { ...prev, ksdFundCode: fund.ksdFundCode ?? null, fundId: fund.fundId, fundFullName: fund.fundFullName ?? null }); }}
        onClose={() => setFundOpen(false)}
      />
    </EditModal>
  );
};
