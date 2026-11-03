/**
 * 개발 진행단계 처리 폼 (EE17). Scm10_Tab_Dev 가운데 오른쪽
 * AS-IS: myApp/client/vi/scm/Scm11_Edit_DevStep.java (508줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * getEditor() L273-358 (라벨 115, 줄 사이 여백 20, 세로 스크롤): 시작일 · 완료예정일 / 개발상태(수정 불가) + [진행중][완료][이행불가] /
 *   "결과상세 :" 링크 + HTML 편집기(950×170) / 비고(1070×105) / "변경프로그램" [등록][파일일괄등록][삭제][예상목록] · "첨부파일(테스트 자료 및 기타첨부파일)" [파일업로드] /
 *   변경프로그램 그리드(570×220) + 첨부파일 그리드(500×220) / 맨 아래 가운데 [저장](높이 60)
 * retrieve(param, callback) L360-381 · editerEnable(chk) L383-394 · readOnly(chk) L396-417 · init() L461-466
 * [E3] updateButton13[등록] (L157) · [E4] allUpdateButton13[파일일괄등록] (L174) · [E5] deleteButton13[삭제] (L190) · [E6] listButton13[예상목록] (L213)
 * [E7] code20Button[진행중] (L236) · [E8] code90Button[완료] (L242) · [E9] code10Button[이행불가] (L248) → updateStatus() L419-441
 * [E10] uploadFileButton[파일업로드] (L254) · [E11] updateButton[저장] (L265) → updateRow() L443-459 · [E12] anchor.MouseDown (L296) → Scm11_Lookup_Result
 * [E1] fileUpload.Change (L108)·[E2] fileUploadForm.SubmitComplete (L118) → FileUpload?parentId=devStepId 뒤 첨부파일 다시 조회 · [E13] fileUpload.Change (L480) → resetFileUpload()
 * 버튼 색: 원본 ColorButtonBottom 제목(진행중·완료·이행불가)이 button-types 표에 없다 → 진행중 assign(주황) · 완료 save(민트) · 이행불가 cancel(빨강)로 구분만 한다(작업방법)
 */
import React, { useEffect, useRef, useState } from 'react';
import { DatePicker, Input, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { scmApi } from '@/api/scm';
import { fileApi } from '@/api/file';
import { errorMessage } from '@/api/client';
import { DevStep } from '@/types/scm';
import { Button } from '@/components/button';
import { FileUpdownForm, type FileUpdownFormHandle } from '@/components/form/FileUpdownForm';
import { HtmlEditor } from '@/components/form/HtmlEditor';
import { Scm03_Lookup_ExpectProgram } from './Scm03_Lookup_ExpectProgram';
import { Scm11_Grid_ApprFile, type ScmDevApprFileHandle } from './Scm11_Grid_ApprFile';
import { Scm11_Lookup_Result } from './Scm11_Lookup_Result';
import { Scm13_Edit_DevProgram } from './Scm13_Edit_DevProgram';
import { Scm13_Grid_DevProgram, type ScmDevProgramHandle } from './Scm13_Grid_DevProgram';
import { Scm13_Lookup_MultiUpload } from './Scm13_Lookup_MultiUpload';

const LABEL: React.CSSProperties = { width: 115, textAlign: 'right', paddingRight: 10, flex: 'none', fontSize: 12 };
const ROW: React.CSSProperties = { display: 'flex', alignItems: 'center', margin: '10px 20px 10px 20px' };
const FMT = 'YYYY-MM-DD';
const toDay = (v: string | null | undefined): Dayjs | null => (v ? dayjs(v) : null);
const NEED_STEP = '상단 개발내용을 먼저 선택해주세요';
const CANNOT_EDIT = '수정이 불가능한 개발내역입니다. 관리자에게 문의해주세요';

interface Props {
  /** retrieve(param) — 고른 진행단계. null이면 init() */
  devStep: DevStep | null;
  /** editBoard.setEnabled(...) — Scm10_Tab_Dev.retrieveEditPage()가 정한다 */
  enabled: boolean;
  /** readOnly(chk) 의 chk — 로그인한 사람이 그 단계의 담당자인가 */
  mine: boolean;
  /** callback.execute() — 저장·상태 변경이 끝난 뒤 (Scm10_Tab_Dev.retrieve()) */
  onChanged: () => void;
}

interface Form { startDate: string | null; dueDate: string | null; note: string; html: string; htmlKey: number }

const fromStep = (s: DevStep | null, htmlKey: number): Form => ({
  startDate: s?.startDate ?? null, dueDate: s?.dueDate ?? null, note: s?.note ?? '', html: s?.result ?? '', htmlKey,
});

// [E0] 화면 열림 (생성자 L98-147) → settings(), getEditor(), show()
export const Scm11_Edit_DevStep: React.FC<Props> = ({ devStep, enabled, mine, onChanged }) => {
  const programList = useRef<ScmDevProgramHandle>(null);
  const fileList = useRef<ScmDevApprFileHandle>(null);
  const fileForm = useRef<FileUpdownFormHandle>(null);
  const [form, setForm] = useState<Form>(fromStep(devStep, 0));
  const [saving, setSaving] = useState(false);
  const [resultOpen, setResultOpen] = useState(false);
  const [programOpen, setProgramOpen] = useState(false);
  const [multiOpen, setMultiOpen] = useState(false);
  const [expectSrId, setExpectSrId] = useState<number | null>(null);
  const set = (patch: Partial<Form>) => setForm(prev => ({ ...prev, ...patch }));

  // retrieve(param) L360-381: editDriver.edit(devStepModel) · setHtmlText(result) · retrieveApproval(): 첨부·변경프로그램 그리드 다시 조회
  useEffect(() => { setForm(prev => fromStep(devStep, prev.htmlKey + 1)); }, [devStep]);

  // editerEnable(chk) L383-394: 90 완료 · 05/10 이행불가이거나 담당자가 아니면 날짜·변경프로그램 버튼·[저장]을 끈다 (개발상태 칸은 늘 수정 불가)
  const status = devStep?.devStatusCd ?? null;
  const canEdit = mine && !(status === '90' || status === '05' || status === '10');
  // readOnly(chk) L396-417: 담당자가 아니면 상태 버튼·비고·[파일업로드]도 끈다, 첨부파일 그리드의 삭제 열을 감춘다(hideButton)
  const stepLoaded = devStep != null;

  const needStep = (run: () => void) => () => {
    if (!devStep) { message.warning(NEED_STEP); return; }
    run();
  };

  // [E3] 등록 → Scm13_Edit_DevProgram.insert(devStepModel, callback: devProgramList.retrieve())
  const insertProgram = needStep(() => setProgramOpen(true));
  // [E4] 파일일괄등록 → Scm13_Lookup_MultiUpload.insert(devStepModel, callback)
  const multiUpload = needStep(() => setMultiOpen(true));

  // [E5] 삭제 → scm.Scm11_DevStep.checkMyTurn(devId, devStepId) 통과하면 devProgramList.deleteRow(), 아니면 CANNOT_EDIT
  const deleteProgram = async () => {
    if (!devStep || devStep.devId == null) return;
    try {
      if (await scmApi.checkMyTurn(devStep.devId, devStep.devStepId)) programList.current?.deleteRow();
      else message.warning(CANNOT_EDIT);
    } catch (err) {
      message.error(errorMessage(err, '확인 실패'));
    }
  };

  // [E6] 예상목록 → scm.Scm01_Sr.getSrModel(devId) → Scm03_Lookup_ExpectProgram.open(srId)
  const listExpect = needStep(() => {
    void (async () => {
      try {
        const sr = await scmApi.getSrByDev(devStep!.devId as number);
        setExpectSrId(sr.srId);
      } catch (err) {
        message.error(errorMessage(err, '조회 실패'));
      }
    })();
  });

  // [E7~E9] 진행중(20) · 완료(90) · 이행불가(10) → updateStatus(code) L419-441: 상태가 바뀌면 callback.execute(), 아니면 CANNOT_EDIT
  const updateStatus = async (devStatusCd: string) => {
    if (!devStep || devStep.devId == null) return;
    try {
      const status = await scmApi.updateDevStepStatus(devStep.devStepId, {
        devId: devStep.devId, devStatusCd, result: form.html, note: form.note, startDate: form.startDate, dueDate: form.dueDate,
      });
      if (status > 0) onChanged();
      else message.warning(CANNOT_EDIT);
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  // [E10] 파일업로드 → fileUpload.click() · [E1]·[E2] 고르면 FileUpload?parentId=devStepId → 첨부파일 다시 조회
  const upload = async (file: File | undefined) => {
    if (!file || !devStep) return;
    try {
      await fileApi.upload(devStep.devStepId, file);
      await fileList.current?.retrieve();
    } catch (err) {
      message.error(errorMessage(err, '업로드 실패'));
    }
  };

  // [E11] 저장 → updateRow() L443-459: scm.Scm11_DevStep.modelUpdate(updateModel, startDate, dueDate) 뒤 callback.execute()
  const updateRow = async () => {
    if (!devStep || devStep.devId == null) return;
    setSaving(true);
    try {
      await scmApi.updateDevStep(devStep.devStepId, {
        devId: devStep.devId, resultCd: devStep.resultCd ?? null, result: form.html, note: form.note, startDate: form.startDate, dueDate: form.dueDate,
      });
      onChanged();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  const off = !enabled || !stepLoaded;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto', opacity: off ? 0.6 : 1, pointerEvents: off ? 'none' : 'auto' }}>
        <div style={ROW}>
          <span style={LABEL}>시작일</span>
          <DatePicker style={{ width: 135 }} format={FMT} disabled={!canEdit} value={toDay(form.startDate)} onChange={d => set({ startDate: d ? d.format(FMT) : null })} />
          <span style={{ ...LABEL, marginLeft: 100 }}>완료예정일</span>
          <DatePicker style={{ width: 135 }} format={FMT} disabled={!canEdit} value={toDay(form.dueDate)} onChange={d => set({ dueDate: d ? d.format(FMT) : null })} />
        </div>
        <div style={{ ...ROW, gap: 8 }}>
          <span style={LABEL}>개발상태</span>
          <Input disabled style={{ width: 135 }} value={devStep?.devStatusNm ?? ''} />
          <span style={{ width: 16 }} />
          <Button type="assign" disabled={!mine} onClick={() => void updateStatus('20')}>진행중</Button>
          <Button type="save" disabled={!mine} onClick={() => void updateStatus('90')}>완료</Button>
          <Button type="cancel" disabled={!mine} onClick={() => void updateStatus('10')}>이행불가</Button>
        </div>
        <div style={{ ...ROW, alignItems: 'flex-start' }}>
          {/* [E12] anchor.MouseDown (L296) → Scm11_Lookup_Result.open(result, devStepModel, callback: setHtmlText) */}
          <a style={{ ...LABEL, width: 120, marginLeft: 40, cursor: 'pointer', textDecoration: 'none', color: 'inherit', paddingTop: 4 }}
             onClick={() => { if (devStep) setResultOpen(true); }}>결과상세 :</a>
          <div style={{ width: 950, flex: 'none' }}>
            <HtmlEditor key={form.htmlKey} value={form.html} onChange={html => set({ html })} height={170} />
          </div>
        </div>
        <div style={{ ...ROW, alignItems: 'flex-start' }}>
          <span style={{ ...LABEL, paddingTop: 5 }}>비고</span>
          <Input.TextArea disabled={!mine} style={{ width: 1070 - 115, height: 105, resize: 'none' }} value={form.note} onChange={e => set({ note: e.target.value })} />
        </div>
        <div style={{ ...ROW, gap: 8 }}>
          <span style={{ width: 120, flex: 'none', fontSize: 12, marginLeft: 20 }}>변경프로그램</span>
          <Button type="register" disabled={!canEdit} onClick={insertProgram}>등록</Button>
          <Button type="register" disabled={!canEdit} onClick={multiUpload}>파일일괄등록</Button>
          <Button type="delete" disabled={!canEdit} onClick={() => void deleteProgram()}>삭제</Button>
          <Button type="assign" onClick={listExpect}>예상목록</Button>
          <span style={{ width: 100 }} />
          <span style={{ width: 265, flex: 'none', fontSize: 12 }}>첨부파일(테스트 자료 및 기타첨부파일)</span>
          <Button type="upload" disabled={!mine} onClick={needStep(() => fileForm.current?.click())}>파일업로드</Button>
          <FileUpdownForm ref={fileForm} onChange={file => void upload(file)} />
        </div>
        <div style={{ ...ROW, alignItems: 'flex-start', gap: 20, marginLeft: 20 }}>
          <div style={{ width: 570, height: 220, flex: 'none' }}>
            <Scm13_Grid_DevProgram ref={programList} devId={devStep?.devId ?? null} />
          </div>
          <div style={{ width: 500, height: 220, flex: 'none' }}>
            <Scm11_Grid_ApprFile ref={fileList} devId={devStep?.devId ?? null} editable={mine} />
          </div>
        </div>
      </div>
      <div style={{ height: 60, flex: 'none', borderTop: '1px solid #d9d9d9', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: off ? 0.6 : 1 }}>
        <Button type="save" loading={saving} disabled={off || !canEdit} onClick={updateRow}>저장</Button>
      </div>
      <Scm11_Lookup_Result open={resultOpen} devStep={devStep} editable resultStr={form.html}
        onResult={html => set({ html, htmlKey: form.htmlKey + 1 })} onClose={() => setResultOpen(false)} />
      <Scm13_Edit_DevProgram open={programOpen} mode="insert" devId={devStep?.devId ?? null} systemCd={devStep?.systemCd ?? null}
        onSaved={() => void programList.current?.retrieve()} onClose={() => setProgramOpen(false)} />
      <Scm13_Lookup_MultiUpload open={multiOpen} devStep={devStep}
        onUploaded={() => void programList.current?.retrieve()} onClose={() => setMultiOpen(false)} />
      <Scm03_Lookup_ExpectProgram open={expectSrId != null} srId={expectSrId} onClose={() => setExpectSrId(null)} />
    </div>
  );
};
