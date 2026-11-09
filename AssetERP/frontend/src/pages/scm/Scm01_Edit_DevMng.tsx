/**
 * 의뢰 처리·개발 폼 (EE16). Scm01_Tab_DevMng 아래
 * AS-IS: myApp/client/vi/scm/Scm01_Edit_DevMng.java (446줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * getEditor() L289-391 (라벨 105, 줄 사이 여백 20): 처리상태(250) · 완료예정일(250) · "처리내용 :" 링크 + 글상자(690×90) / 시작일 · 완료일 / 개발난이도 · 예상기간 · 개발내용요약(800) /
 *   개발대상 □화면프로그램 □서버프로그램 □보고서 □DB(DDL/DML) □기타 + 기타 글상자(690) / 예상프로그램 [등록][저장][삭제] · 개발자 [등록][저장][삭제][진행단계 기본설정] /
 *   예상프로그램 그리드(450×220) + 개발자 그리드(1200×220) / 맨 아래 가운데 [저장]
 * checkBox() L109-134: devTarget(1/0 다섯 글자)을 □로, 기타만 켜지면 기타 글상자를 켠다 · getDevTarget() L136-146: □를 다시 다섯 글자로
 * 요청사(corpName LookupTriggerField L209-225, Biz13_Lookup_WithCorp)는 필드만 있고 getEditor()에 붙지 않아 화면에 없다 → [E2 생략]
 * 스타일: MF (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useEffect, useRef, useState } from 'react';
import { Checkbox, DatePicker, Input, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { scmApi } from '@/api/scm';
import { errorMessage } from '@/api/client';
import { Sr } from '@/types/scm';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { Scm03_Grid_ExpectProgram, type ScmExpectProgramHandle } from './Scm03_Grid_ExpectProgram';
import { Scm10_Grid_Dev, type ScmDevHandle } from './Scm10_Grid_Dev';
import { Scm01_Lookup_ResultContent } from './Scm01_Lookup_ResultContent';
import { Scm12_Lookup_DevStepRule } from './Scm12_Lookup_DevStepRule';

const LABEL: React.CSSProperties = { width: 105, textAlign: 'right', paddingRight: 8, flex: 'none', fontSize: 12 };
const ROW: React.CSSProperties = { display: 'flex', alignItems: 'center', margin: '8px 20px' };
const FMT = 'YYYY-MM-DD';
const toDay = (v: string | null | undefined): Dayjs | null => (v ? dayjs(v) : null);

interface Props {
  /** retrieve(param) — 고른 의뢰. null이면 init() */
  sr: Sr | null;
  /** updateRow() 뒤 저장된 한 줄 (GridUpdate.update(grid.getStore(), …)) */
  onSaved: (row: Sr) => void;
}

interface Form {
  srStatusCd: string | null; dueDate: string | null; resultContent: string;
  startDate: string | null; closeDate: string | null;
  devImportanceCd: string | null; expectPeriod: string; devContent: string;
  ch: [boolean, boolean, boolean, boolean, boolean]; devTargetEtc: string;
}

/** checkBox() L109-134: devTarget "10100" → □ 다섯 개 (null이면 모두 끔) */
const fromSr = (sr: Sr | null): Form => {
  const t = sr?.devTarget;
  const on = (i: number) => t != null && t.charAt(i) === '1';
  return {
    srStatusCd: sr?.srStatusCd ?? null, dueDate: sr?.dueDate ?? null, resultContent: sr?.resultContent ?? '',
    startDate: sr?.startDate ?? null, closeDate: sr?.closeDate ?? null,
    devImportanceCd: sr?.devImportanceCd ?? null, expectPeriod: sr?.expectPeriod ?? '', devContent: sr?.devContent ?? '',
    ch: [on(0), on(1), on(2), on(3), on(4)], devTargetEtc: sr?.devTargetEtc ?? '',
  };
};

// [E0] 화면 열림 (생성자 L148-171) → settings(), getEditor(), show()
export const Scm01_Edit_DevMng: React.FC<Props> = ({ sr, onSaved }) => {
  const programList = useRef<ScmExpectProgramHandle>(null);
  const devList = useRef<ScmDevHandle>(null);
  const [form, setForm] = useState<Form>(fromSr(sr));
  const [saving, setSaving] = useState(false);
  const [resultOpen, setResultOpen] = useState(false);
  const [ruleOpen, setRuleOpen] = useState(false);
  const set = (patch: Partial<Form>) => setForm(prev => ({ ...prev, ...patch }));

  // retrieve(param) L393-405 → editDriver.edit(srModel), checkBox(), retrieveApproval(): programList.retrieve(srModel), devList.retrieve(srModel)
  // init() L424-429: 폼을 비우고 두 그리드를 비운다
  useEffect(() => {
    setForm(fromSr(sr));
    if (sr) {
      void programList.current?.retrieve(sr);
      void devList.current?.retrieve(sr.srId);
    } else {
      programList.current?.clear();
      devList.current?.clear();
    }
  }, [sr?.srId]);  // eslint-disable-line react-hooks/exhaustive-deps

  // [E1] ch05.ValueChange [!event.getValue()] (L196) → devTargetEtc를 막고 비운다
  const setCh = (i: number, v: boolean) => {
    const ch = [...form.ch] as Form['ch'];
    ch[i] = v;
    set({ ch, ...(i === 4 && !v ? { devTargetEtc: '' } : {}) });
  };

  // [E3] updateButton[저장].Select (L227) → updateRow() L407-422: getDevTarget() 뒤 scm.Scm01_Sr.update
  const updateRow = async () => {
    if (!sr) return;
    setSaving(true);
    try {
      const saved = await scmApi.saveDevMng(sr.srId, {
        srStatusCd: form.srStatusCd, dueDate: form.dueDate, startDate: form.startDate, closeDate: form.closeDate,
        devImportanceCd: form.devImportanceCd, expectPeriod: form.expectPeriod || null, devContent: form.devContent || null,
        devTarget: form.ch.map(c => (c ? '1' : '0')).join(''), devTargetEtc: form.devTargetEtc || null,
        resultContent: form.resultContent || null,
      });
      onSaved(saved);
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  // [E4]·[E7] insertButton[등록].Select (L233·L257): 선택한 의뢰가 없으면 "상단 개발요청내용을 먼저 선택해주세요"
  const needSr = (run: (s: Sr) => void) => () => {
    if (!sr) { message.warning('상단 개발요청내용을 먼저 선택해주세요'); return; }
    run(sr);
  };

  // [E2 생략] corpName.TriggerClick (L211) → Biz13_Lookup_WithCorp: 요청사 칸은 필드만 있고 getEditor()에 붙지 않아 화면에 없다 (조회창은 components/lookup/Biz13_Lookup_WithCorp)
  const disabled = !sr;  // 선택한 줄이 없으면 폼 비활성 (SGEF)

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto', opacity: disabled ? 0.6 : 1, pointerEvents: disabled ? 'none' : 'auto' }}>
        <div style={ROW}>
          <span style={LABEL}>처리상태</span>
          <SystemCodeComboBox kindCd="SrStatus" style={{ width: 145 }} value={form.srStatusCd ?? undefined} onChange={c => set({ srStatusCd: c ?? null })} />
          <span style={{ ...LABEL, marginLeft: 0 }}>완료예정일</span>
          <DatePicker style={{ width: 140 }} format={FMT} value={toDay(form.dueDate)} onChange={d => set({ dueDate: d ? d.format(FMT) : null })} />
          {/* [E11] anchor.MouseDown (L303) → Scm01_Lookup_ResultContent.open(resultContent, srModel, callback) */}
          <a style={{ ...LABEL, width: 110, marginLeft: 60, cursor: 'pointer', textDecoration: 'none', color: 'inherit', alignSelf: 'flex-start', paddingTop: 4 }}
             onClick={() => setResultOpen(true)}>처리내용 :</a>
          <Input.TextArea style={{ width: 690, height: 90, resize: 'none' }} value={form.resultContent} onChange={e => set({ resultContent: e.target.value })} />
        </div>
        <div style={ROW}>
          <span style={LABEL}>시작일</span>
          <DatePicker style={{ width: 140 }} format={FMT} value={toDay(form.startDate)} onChange={d => set({ startDate: d ? d.format(FMT) : null })} />
          <span style={{ ...LABEL, marginLeft: 105 }}>완료일</span>
          <DatePicker style={{ width: 140 }} format={FMT} value={toDay(form.closeDate)} onChange={d => set({ closeDate: d ? d.format(FMT) : null })} />
        </div>
        <div style={ROW}>
          <span style={LABEL}>개발난이도</span>
          <SystemCodeComboBox kindCd="DevImportanceCode" style={{ width: 145 }} value={form.devImportanceCd ?? undefined} onChange={c => set({ devImportanceCd: c ?? null })} />
          <span style={{ ...LABEL, marginLeft: 0 }}>예상기간</span>
          <Input style={{ width: 140 }} value={form.expectPeriod} onChange={e => set({ expectPeriod: e.target.value })} />
          <span style={{ ...LABEL, marginLeft: 100 }}>개발내용요약</span>
          <Input style={{ width: 695 }} value={form.devContent} onChange={e => set({ devContent: e.target.value })} />
        </div>
        <div style={ROW}>
          <span style={LABEL}>개발대상</span>
          <Checkbox checked={form.ch[0]} onChange={e => setCh(0, e.target.checked)} style={{ width: 150 }}><b>화면프로그램</b></Checkbox>
          <Checkbox checked={form.ch[1]} onChange={e => setCh(1, e.target.checked)} style={{ width: 150, marginLeft: 0 }}><b>서버프로그램</b></Checkbox>
          <Checkbox checked={form.ch[2]} onChange={e => setCh(2, e.target.checked)} style={{ width: 100, marginLeft: 0 }}><b>보고서</b></Checkbox>
          <Checkbox checked={form.ch[3]} onChange={e => setCh(3, e.target.checked)} style={{ width: 150, marginLeft: 0 }}><b>DB(DDL/DML)</b></Checkbox>
          <Checkbox checked={form.ch[4]} onChange={e => setCh(4, e.target.checked)} style={{ width: 60, marginLeft: 0 }}><b>기타</b></Checkbox>
          <Input style={{ width: 690 }} disabled={!form.ch[4]} value={form.devTargetEtc} onChange={e => set({ devTargetEtc: e.target.value })} />
        </div>
        <div style={{ ...ROW, gap: 8 }}>
          <span style={LABEL}>예상프로그램</span>
          {/* [E4] insertButton03[등록] · [E5] updateButton03[저장] · [E6] deleteButton03[삭제] */}
          <Button type="register" onClick={needSr(s => programList.current?.insertRow(s))}>등록</Button>
          <Button type="save" onClick={() => void programList.current?.update()}>저장</Button>
          <Button type="delete" onClick={() => programList.current?.deleteChk()}>삭제</Button>
          <span style={{ ...LABEL, marginLeft: 100 }}>개발자</span>
          {/* [E7] insertButton10[등록] · [E8] updateButton10[저장] · [E9] deleteButton10[삭제] · [E10] settingButton10[진행단계 기본설정] */}
          <Button type="register" onClick={needSr(s => devList.current?.insertRow(s.srId))}>등록</Button>
          <Button type="save" onClick={() => void devList.current?.update()}>저장</Button>
          <Button type="delete" onClick={() => devList.current?.deleteChk()}>삭제</Button>
          <Button type="assign" onClick={() => setRuleOpen(true)}>진행단계 기본설정</Button>
        </div>
        <div style={{ ...ROW, alignItems: 'flex-start', gap: 50 }}>
          <div style={{ width: 450, height: 220, flex: 'none' }}><Scm03_Grid_ExpectProgram ref={programList} /></div>
          <div style={{ width: 1200, height: 220, flex: 'none' }}><Scm10_Grid_Dev ref={devList} /></div>
        </div>
      </div>
      <div style={{ height: 60, flex: 'none', borderTop: '1px solid #d9d9d9', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: disabled ? 0.6 : 1 }}>
        <Button type="save" loading={saving} disabled={disabled} onClick={updateRow}>저장</Button>
      </div>
      <Scm01_Lookup_ResultContent open={resultOpen} resultContent={form.resultContent} srId={sr?.srId ?? null}
        onResult={text => set({ resultContent: text })} onClose={() => setResultOpen(false)} />
      <Scm12_Lookup_DevStepRule open={ruleOpen} onClose={() => setRuleOpen(false)} />
    </div>
  );
};
