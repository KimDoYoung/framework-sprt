/**
 * 시스템 개발의뢰 입력·결재 폼 (EE15). Scm01_Tab_Sr 가운데
 * AS-IS: myApp/client/vi/scm/Scm01_Edit_Sr.java (773줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * getEditor() L291-363: 라벨 100 · 요청일 + "요청내용 :" 링크 + HTML 편집기(695×120) / 요청구분(시스템 콤보 + 요청구분 콤보) / 요청자(요청사 조회칸 + 요청자 글자칸) /
 *   첨부파일 [파일업로드] ... 결재선 [결재선 설정] / 첨부파일 그리드(500×160) + 결재선 그리드(770×160). 아래 가운데 [저장][결재요청][승인][반려][전체 초기화](60)
 * 상태 판정: retrieveApprStep() L597-691 — 등록자가 임시저장('99'·없음)일 때만 입력·[저장]·[결재요청]·첨부 올리기가 열린다.
 *   [승인]·[반려]는 내 차례(앞 결재자가 승인 '20', 나는 대기 '10')일 때, [전체 초기화]는 등록자에게만(retrieveApproval L587-595)
 * 스타일: MH (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, Input, message, Modal } from 'antd';
import dayjs from 'dayjs';
import { scmApi } from '@/api/scm';
import { fileApi } from '@/api/file';
import { errorMessage } from '@/api/client';
import { Sr, SrApprStep } from '@/types/scm';
import { Button } from '@/components/button';
import { HtmlEditor } from '@/components/form/HtmlEditor';
import { FileUpdownForm, FileUpdownFormHandle } from '@/components/form/FileUpdownForm';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Sys15_Lookup_Corp } from '@/components/lookup/Sys15_Lookup_Corp';
import { useLoginUser } from '@/hooks/useLoginUser';
import { Scm01_Grid_ApprFile, ScmApprFileHandle } from './Scm01_Grid_ApprFile';
import { Scm01_Lookup_SrContent } from './Scm01_Lookup_SrContent';
import { Scm02_Grid_ApprStep, ScmApprStepGridHandle } from './Scm02_Grid_ApprStep';

const FORMAT = 'YYYY-MM-DD';
const LABEL: React.CSSProperties = { width: 100, textAlign: 'right', paddingRight: 8, flex: 'none', fontSize: 12 };
const ROW: React.CSSProperties = { display: 'flex', alignItems: 'center' };

interface Props {
  /** retrieve(param) — 고른 의뢰. null이면 init() */
  sr: Sr | null;
  /** 저장·승인·반려 뒤 바뀐 의뢰 한 줄(위 그리드의 줄을 갱신한다) */
  onSaved: (row: Sr) => void;
}

/** 참조('30')가 아닌 결재단계만 (standardList) */
const standardOf = (steps: SrApprStep[]) => steps.filter(s => s.stepTypeCd !== '30');

export const Scm01_Edit_Sr: React.FC<Props> = ({ sr, onSaved }) => {
  const user = useLoginUser();
  const fileForm = useRef<FileUpdownFormHandle>(null);
  const fileList = useRef<ScmApprFileHandle>(null);
  const stepList = useRef<ScmApprStepGridHandle>(null);
  const seq = useRef(0);

  // editDriver.edit(srModel)
  const [srDate, setSrDate] = useState<string | null>(null);
  const [systemCd, setSystemCd] = useState<string | null>(null);
  const [srType, setSrType] = useState<string | null>(null);
  const [corpId, setCorpId] = useState<number | null>(null);
  const [corpNm, setCorpNm] = useState('');
  const [requestor, setRequestor] = useState('');
  const [html, setHtml] = useState('');
  /** HtmlEditor는 만들 때 한 번만 값을 받으므로 다른 값으로 다시 열려면 key를 바꾼다 */
  const [editorKey, setEditorKey] = useState(0);
  const [steps, setSteps] = useState<SrApprStep[]>([]);
  const [corpOpen, setCorpOpen] = useState(false);
  const [contentOpen, setContentOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  // [E0] 화면 열림 (생성자 L124-178) · retrieve() L365-378: editDriver.edit(srModel), setHtmlText, retrieveApproval(), retrieveApprStep()
  useEffect(() => {
    setSrDate(sr?.srDate ?? null);
    setSystemCd(sr?.systemCd ?? null);
    setSrType(sr?.srType ?? null);
    setCorpId(sr?.corpId ?? null);
    setCorpNm(sr?.corpNm ?? '');
    setRequestor(sr?.requestor ?? '');
    setHtml(sr?.srContent ?? '');
    setEditorKey(k => k + 1);
    setSteps([]);
    if (!sr) return;
    const my = ++seq.current;
    scmApi.searchSrApprSteps(sr.srId)
      .then(list => { if (my === seq.current) setSteps(list); })
      .catch(err => message.error(errorMessage(err, '조회 실패')));
  }, [sr]);

  const isOwner = !!sr && sr.personId === user.userId;
  /** 임시저장 상태의 등록자 — enabledYn */
  const editable = isOwner && (sr?.apprStatusCd == null || sr.apprStatusCd === '99');

  // retrieveApprStep L664-685: 내 차례 = 앞 결재자 승인('20') + 나 대기('10'). 마지막 결재자면 lastChk
  const turn = useMemo(() => {
    const std = standardOf(steps);
    for (let i = 1; i < std.length; i++) {
      if (std[i].stepEmpId === user.userId && std[i - 1].stepStatusCd === '20' && std[i].stepStatusCd === '10') {
        return { step: std[i], last: std.length === i + 1 };
      }
    }
    return null;
  }, [steps, user.userId]);

  /** 저장 뒤 폼 값으로 만든 요청 */
  const form = (apprStatusCd: string | null) => ({
    srId: sr!.srId,
    systemCd,
    srDate,
    corpId,
    requestor: requestor.trim() === '' ? null : requestor,
    srType,
    srContent: html === '' ? null : html,
    apprStatusCd,
  });

  /** 저장 → 결재단계 저장 → 최신 의뢰를 위 그리드에 돌려준다 */
  const saveAll = async (apprStatusCd: string | null, makeSteps: (cur: SrApprStep[]) => SrApprStep[]) => {
    const srId = sr!.srId;
    await scmApi.saveSr(form(apprStatusCd));
    await scmApi.saveSrApprSteps(srId, makeSteps(steps));
    onSaved(await scmApi.getSr(srId));
  };

  // [E6] tempUpdateButton[저장] · [E7] updateButton[결재요청] (L225·L231) → updateRow(actioncCode) L380-500
  const updateRow = async (actioncCode: 'temp' | 'real') => {
    if (!sr) return;
    if (systemCd == null || srType == null) { message.warning('요청구분(시스템,구분)은 필수 선택항목입니다'); return; }
    if (requestor.trim() === '') { message.warning('요청자는 필수 입력항목입니다'); return; }
    if (html === '') { message.warning('신청내용을 입력해주세요'); return; }
    const standard = standardOf(steps);
    let apprStatusCd = '99';
    if (actioncCode === 'real') {
      if (standard.length === 0) { message.warning('결재선을 등록해주세요'); return; }
      apprStatusCd = standard.length === 1 ? '30' : '10';
    }
    setBusy(true);
    try {
      await saveAll(apprStatusCd, cur => (actioncCode === 'real'
        // 상신자(첫 줄)는 결재 처리(20), 그 밖은 결재일·실결재자를 비우고 결재·합의는 대기(10), 참조는 없음
        ? cur.map((d, i) => (i === 0
          ? { ...d, stepStatusCd: '20', apprDate: dayjs().format('YYYY-MM-DDTHH:mm:ss'), apprEmpId: user.userId }
          : { ...d, apprDate: null, apprEmpId: null, stepStatusCd: d.stepTypeCd === '10' || d.stepTypeCd === '20' ? '10' : d.stepTypeCd === '30' ? null : d.stepStatusCd }))
        : cur));
      message.success(actioncCode === 'real' ? '결재요청이 완료되었습니다' : '저장이 완료되었습니다');
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setBusy(false);
    }
  };

  // [E8] cancelButton[전체 초기화].Select (L237) → cancelRow() L502-520 → [E14] messageBox.DialogHide [YES] (L511) → cancel() L522-578
  const cancelRow = () => {
    if (!sr) { message.warning('취소 할 개발의뢰 내용을 선택해주세요.'); return; }
    Modal.confirm({
      title: '취소', content: '해당 내용을 취소하시겠습니까?', okText: '예', cancelText: '아니오',
      onOk: async () => {
        setBusy(true);
        try {
          // 승인상태를 비우고, 참조는 상태 없음 / 그 밖은 대기, 결재일·실결재자 비움
          await saveAll(null, cur => cur.map(d => ({ ...d, stepStatusCd: d.stepTypeCd === '30' ? null : '10', apprDate: null, apprEmpId: null })));
        } catch (err) {
          message.error(errorMessage(err, '저장 실패'));
        } finally {
          setBusy(false);
        }
      },
    });
  };

  // [E9] confirmButton[승인] (L243) → msgBox "승인하시겠습니까?" [E10] YES → updateApprStep("20") · [E11] rejectButton[반려] → [E12] YES → updateApprStep("30") L693-737
  const confirmStep = (stepStatusCd: '20' | '30') => {
    Modal.confirm({
      title: '확인', content: stepStatusCd === '20' ? '승인하시겠습니까?' : '반려하시겠습니까?', width: 200, okText: '예', cancelText: '아니오',
      onOk: async () => {
        if (!sr || !turn) return;
        setBusy(true);
        try {
          await scmApi.decideSrApprStep(turn.step.srApprStepId, stepStatusCd, turn.last);
          onSaved(await scmApi.getSr(sr.srId));
          message.success(stepStatusCd === '20' ? '승인되었습니다' : '반려되었습니다');
        } catch (err) {
          message.error(errorMessage(err, '처리 실패'));
        } finally {
          setBusy(false);
        }
      },
    });
  };

  // [E1]·[E2]·[E15] fileUpload.Change → FileUpload?parentId=srId (여러 파일) → SubmitComplete → resetFileUpload(), fileList.retrieve(srId, true)
  const onFiles = async (files: File[]) => {
    if (!sr) return;
    try {
      for (const file of files) await fileApi.upload(sr.srId, file);
    } catch (err) {
      message.error(errorMessage(err, '파일 업로드 실패'));
    }
    await fileList.current?.retrieve();
  };

  const onContentResult = useCallback((v: string) => { setHtml(v); setEditorKey(k => k + 1); }, []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 10, opacity: sr ? 1 : 0.5, pointerEvents: sr ? 'auto' : 'none' }}>
        {/* hlc00: 요청일 / 요청내용 링크 + 편집기 695 */}
        <div style={{ display: 'flex', gap: 30, alignItems: 'flex-start' }}>
          <div style={ROW}>
            <span style={LABEL}>요청일</span>
            <DatePicker
              value={srDate ? dayjs(srDate) : null}
              format={FORMAT}
              allowClear={false}
              disabled={!editable}
              style={{ width: 140 }}
              onChange={d => setSrDate(d ? d.format(FORMAT) : null)}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', flex: 1, minWidth: 0, maxWidth: 820 }}>
            {/* [E13] anchor.MouseDown (L294) → Scm01_Lookup_SrContent.open(html, enabledYn, srModel, callback) */}
            <a style={{ ...LABEL, width: 110, paddingTop: 5, textDecoration: 'none', cursor: 'pointer' }} onClick={() => setContentOpen(true)}>요청내용 :</a>
            <div style={{ flex: 1, minWidth: 0, pointerEvents: editable ? 'auto' : 'none', opacity: editable ? 1 : 0.7 }}>
              <HtmlEditor toolbar="client" key={editorKey} value={html} onChange={setHtml} height={150} />
            </div>
          </div>
        </div>
        {/* hlc01: 요청구분 */}
        <div style={ROW}>
          <span style={LABEL}>요청구분</span>
          <SystemCodeComboBox kindCd="SystemCode" value={systemCd ?? undefined} disabled={!editable} style={{ width: 140 }} onChange={c => setSystemCd(c ?? null)} />
          <span style={{ width: 8 }} />
          <SystemCodeComboBox kindCd="SrType" value={srType ?? undefined} disabled={!editable} style={{ width: 160 }} onChange={c => setSrType(c ?? null)} />
        </div>
        {/* hlc02: 요청자 — [E3] corpName[요청자].TriggerClick (L192) → Sys15_Lookup_Corp.open(true, …): 고르면 요청사, [선택안함]이면 비운다 */}
        <div style={ROW}>
          <span style={LABEL}>요청자</span>
          <LookupInput value={corpNm} placeholder="요청사" width={140} disabled={!editable} onOpen={() => setCorpOpen(true)} onClear={() => { setCorpId(null); setCorpNm(''); }} />
          <span style={{ width: 8 }} />
          <Input value={requestor} placeholder="요청자" disabled={!editable} maxLength={50} style={{ width: 160 }} onChange={e => setRequestor(e.target.value)} />
        </div>
        {/* hlc03: 첨부파일 [파일업로드] ... 결재선 [결재선 설정] */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ ...ROW, width: 500 }}>
            <span style={LABEL}>첨부파일</span>
            {/* [E4] uploadFileButton[첨부파일].Select (L213) → fileUpload.click() */}
            <Button type="upload" disabled={!editable} onClick={() => fileForm.current?.click()}>파일업로드</Button>
            <FileUpdownForm ref={fileForm} onChange={() => undefined} onChangeFiles={files => void onFiles(files)} />
          </div>
          <div style={{ ...ROW, marginLeft: 70 }}>
            <span style={LABEL}>결재선</span>
            {/* [E5] apprStepButton[결재선].Select (L219) → stepList.open() */}
            <Button type="assign" disabled={!editable} onClick={() => void stepList.current?.open()}>결재선 설정</Button>
          </div>
        </div>
        {/* hlc04: 첨부파일 그리드 500×160 + 결재선 그리드 770×160 */}
        <div style={{ display: 'flex', gap: 70, paddingLeft: 10 }}>
          <div style={{ width: 500, height: 160, flex: 'none' }}>
            <Scm01_Grid_ApprFile ref={fileList} parentId={sr?.srId ?? null} editable={editable} />
          </div>
          <div style={{ flex: 1, minWidth: 560, maxWidth: 770, height: 160 }}>
            <Scm02_Grid_ApprStep ref={stepList} srId={sr?.srId ?? null} steps={steps} onChange={setSteps} />
          </div>
        </div>
      </div>
      {/* 버튼 줄(가운데, 60) */}
      <div style={{ borderTop: '1px solid #d9d9d9', height: 60, flex: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
        <Button type="save" disabled={!editable || busy} onClick={() => updateRow('temp')}>저장</Button>
        <Button type="register" disabled={!editable || busy} onClick={() => updateRow('real')}>결재요청</Button>
        <Button type="save" disabled={!turn || busy} onClick={() => confirmStep('20')}>승인</Button>
        <Button type="cancel" disabled={!turn || busy} onClick={() => confirmStep('30')}>반려</Button>
        <Button type="reset" disabled={!isOwner || busy} onClick={cancelRow}>전체 초기화</Button>
      </div>
      <Sys15_Lookup_Corp
        open={corpOpen}
        regYn
        onResult={corp => { setCorpId(corp?.corpId ?? null); setCorpNm(corp?.corpName ?? ''); setCorpOpen(false); }}
        onClose={() => setCorpOpen(false)}
      />
      <Scm01_Lookup_SrContent open={contentOpen} srContent={html} enabledYn={editable} srId={sr?.srId ?? null} onResult={onContentResult} onClose={() => setContentOpen(false)} />
    </div>
  );
};
