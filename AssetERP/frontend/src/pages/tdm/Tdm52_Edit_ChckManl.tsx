/**
 * 점검상세 창 (N22) — Tdm52_TabPage_CheckManl의 점검 아이콘이 연다.
 * AS-IS: myApp/client/vi/tdm/Tdm52_Edit_ChckManl.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L83-99: 모달 1260×660(크기 고정), 아래 가운데 [증빙자료(n건)][점검완료][완료취소][저장][닫기]. getEditor() L255-320: 왼쪽 = 점검항목(80)·점검시기·점검방법(162)·증빙자료(80)·규정/양식(Tdm43_Page_Relate, 읽기 전용),
 *   오른쪽 = 점검상태·점검자·점검일자·점검결과(콤보 TdmCheckResult0001 + [조치계획등록] + [AI])·점검의견(310)
 * view(model) L101-114: 읽기 전용(점검완료·완료취소·저장·AI 숨김, 조치계획 단추 문구 "조치계획확인") / edit(model, cb) L116-130: 점검일자·점검결과·점검의견만 편집(점검일자가 비면 오늘)
 * [증빙자료(n건)]은 증빙자료 창(Tdm00_Lookup_RelateAppr "tdm52")을 연다(2026-11-05 연결, 13-누락대장 2번 — 창 안 [불러오기]는 보류, Com01_Lookup_RelateAppr 머리 참고).
 * [AI] 점검의견 자동 작성(BotService 외부 AI 서버)은 2026-11-10 연결 — 개발 서버는 AI 시뮬레이터(tools/run-ext-server.sh)가 답한다
 * UX보강(10): 해당 없음
 * 스타일: MF (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useEffect, useMemo, useState } from 'react';
import { DatePicker, Input, Modal, Space, Spin, Typography, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { errorMessage } from '@/api/client';
import { tdmApi } from '@/api/tdm';
import { TdmCheckManlDetail, TdmManlItem } from '@/types/tdm';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { Tdm00_Lookup_RelateAppr } from './Tdm00_Lookup_RelateAppr';
import { Tdm43_Page_Relate } from './Tdm43_Page_Relate';
import { Tdm54_Edit_ChckInsuff, ChckInsuffTarget } from './Tdm54_Edit_ChckInsuff';

const DATE_FORMAT = 'YYYY.MM.DD';

export interface CheckManlEditTarget {
  manl: TdmCheckManlDetail;
  /** view = 읽기 전용(마감·승인 단계) / edit = 점검 입력 */
  mode: 'view' | 'edit';
}

interface Props {
  target: CheckManlEditTarget | null;
  /** AS-IS callBack.execute(model) — 저장·점검완료·완료취소로 바뀐 점검항목(목록의 그 행을 바꾼다) */
  onChanged: (model: TdmCheckManlDetail) => void;
  onClose: () => void;
}

const Row: React.FC<{ label: React.ReactNode; blue?: boolean; children: React.ReactNode; top?: boolean }> = ({ label, blue, children, top }) => (
  <div style={{ display: 'flex', alignItems: top ? 'flex-start' : 'center', marginBottom: 8 }}>
    <Typography.Text strong style={{ width: 100, flex: 'none', paddingTop: top ? 5 : 0, textAlign: 'right', paddingRight: 8, color: blue ? '#0069B4' : undefined }}>{label}</Typography.Text>
    <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
  </div>
);

export const Tdm52_Edit_ChckManl: React.FC<Props> = ({ target, onChanged, onClose }) => {
  const mode = target?.mode ?? 'view';
  const [model, setModel] = useState<TdmCheckManlDetail | null>(null);       // manlModel
  const [checkDate, setCheckDate] = useState<Dayjs | null>(null);
  const [resultCode, setResultCode] = useState<string | undefined>(undefined);
  const [resultName, setResultName] = useState('');
  const [cmnt, setCmnt] = useState('');
  const [insuff, setInsuff] = useState<ChckInsuffTarget | null>(null);
  const [evid, setEvid] = useState<{ id: number; mode: 'open' | 'view' } | null>(null);   // Tdm00_Lookup_RelateAppr
  const [busy, setBusy] = useState(false);

  // [E0] 화면 열림 (생성자 L83-99, open() L132-155): settings() → 모델을 폼에 채운다. edit()는 점검일자가 비면 오늘(L116-130)
  useEffect(() => {
    if (!target) { setModel(null); return; }
    const m = target.manl;
    setModel(m);
    setCheckDate(m.checkDate ? dayjs(m.checkDate, 'YYYY-MM-DD') : target.mode === 'edit' ? dayjs() : null);
    setResultCode(m.checkResultCode ?? undefined);
    setResultName(m.checkResultName ?? '');
    setCmnt(m.checkCmnt ?? '');
  }, [target]);

  // editDriver.flush(): 폼의 현재 값을 담은 점검항목
  const flush = (): TdmCheckManlDetail => ({
    ...(model as TdmCheckManlDetail),
    checkDate: checkDate ? checkDate.format('YYYY-MM-DD') : null,
    checkResultCode: resultCode ?? null,
    checkResultName: resultName,
    checkCmnt: cmnt,
  });

  const relateManl = useMemo(
    () => (model ? ({ manlId: model.manlId, manlOrgId: model.manlOrgId, refBasis: model.refBasis ?? '' } as TdmManlItem) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [model?.chckManlId],
  );

  const editable = mode === 'edit';
  // isReadOnly() L426-433: 편집 모드이고 점검진행(11)일 때만 쓸 수 있다
  const isReadOnly = !(mode === 'edit' && model?.checkStatusCode === '11');
  // setButton() L435-456
  const inProgress = model?.checkStatusCode === '11';
  const planEnabled = resultCode === '2' || resultCode === '3';   // [E1] checkResultName.Collapse (L177) · setButton

  // [E2] planButton[조치계획등록].Select (L190) → Tdm54_Edit_ChckInsuff.view / edit(stdDate = 점검년월 1일, model)
  const openPlan = () => {
    if (!model) return;
    const stdDate = `${model.checkYm.replace('.', '-')}-01`;
    setInsuff({ manl: flush(), mode: isReadOnly ? 'view' : 'edit', stdDate });
  };

  // [E3] botButton[AI].Select (L204) → callBot() L458-484: 점검결과가 없으면 안내, 있으면 점검의견 칸을 "작성중"으로 가리고
  //   tdm.Tdm52_ChckManl.getBotCheckCmnt(점검항목·점검방법·점검결과 이름) → 성공이면 점검의견 칸을 AI 글로 바꾼다(저장은 [저장]). 개발은 tools/ext-simulator
  const [botBusy, setBotBusy] = useState(false);
  const callBot = async () => {
    const m = flush();
    if (!m.checkResultCode) { message.warning('점검결과를 선택해주세요'); return; }
    setBotBusy(true);
    try {
      const text = await tdmApi.getBotCheckCmnt({ checkItem: m.checkItem ?? null, checkHow: m.checkHow ?? null, checkResultName: m.checkResultName ?? null });
      setCmnt(text ?? '');
    } catch (err) {
      message.warning(errorMessage(err, 'ai 점검의견 작성중 오류발생'));
    } finally {
      setBotBusy(false);
    }
  };

  // [E4] fileButton[증빙자료(n건)].Select (L212) → lookupFile() L400-424: 읽기 전용이면 view("tdm52", chckManlId, null),
  //   아니면 open("tdm52", chckManlId, callback → tdm.Tdm52_ChckManl.selectById → 버튼 글자 "증빙자료(" + fileCountStr + ")")
  const lookupFile = () => {
    if (!model) return;
    setEvid({ id: model.chckManlId, mode: isReadOnly ? 'view' : 'open' });
  };
  const onEvidChanged = () => {
    if (!model) return;
    tdmApi.getCheckManl(model.chckManlId)
      .then(m => setModel(prev => (prev ? { ...prev, fileCountStr: m.fileCountStr } : prev)))
      .catch(err => message.error(errorMessage(err, '조회 실패')));
  };

  // [E8] updateButton[저장].Select (L241) → update() L322-343: tdm.Tdm52_ChckManl.modelUpdate
  const update = async () => {
    if (!model) return;
    setBusy(true);
    try {
      const saved = await tdmApi.updateCheckManl(model.chckManlId, {
        checkDate: checkDate ? checkDate.format('YYYY-MM-DD') : null, checkResultCode: resultCode ?? null, checkCmnt: cmnt,
      });
      message.info('저장이 완료되었습니다');
      setModel(saved);
      onChanged(saved);
    } catch (err) {
      message.info(errorMessage(err, '저장 실패'));
    } finally {
      setBusy(false);
    }
  };

  // [E5] completeButton[점검완료].Select (L219) · [E6] cancelButton[완료취소].Select (L225) → [E7] messageBox.DialogHide [YES] (L229) → complete(actionType) L345-398
  const complete = async (actionType: 'P' | 'C') => {
    if (!model) return;
    if (actionType === 'P') {
      if (!checkDate) { message.warning('점검일자를 선택하세요'); return; }
      if (!resultCode) { message.warning('점검결과를 선택하세요'); return; }
      if (resultCode !== '9' && !cmnt) { message.warning('점검의견을 작성하세요'); return; }    // 점검결과가 '9:해당없음'이 아닌 경우
    }
    setBusy(true);
    try {
      const done = await tdmApi.completeCheckManl(model.chckManlId, {
        actionType, checkDate: checkDate ? checkDate.format('YYYY-MM-DD') : null, checkResultCode: resultCode ?? null, checkResultName: resultName, checkCmnt: cmnt,
      });
      setModel(done);
      onChanged(done);
      if (actionType === 'P') {
        message.info('점검이 완료되었습니다');
        onClose();                                                          // hide()
      } else {
        message.info('점검완료가 취소되었습니다');                              // 단추 상태는 setButton()이 새 상태로 다시 정한다
      }
    } catch (err) {
      message.info(errorMessage(err, '처리 실패'));
    } finally {
      setBusy(false);
    }
  };

  const cancelComplete = () => {
    Modal.confirm({ title: '확인', content: '점검완료를 취소하시겠습니까?', width: 350, okText: '예', cancelText: '아니오', onOk: () => complete('C') });
  };

  return (
    <Modal
      open={!!target}
      title={<b>점검상세</b>}
      width="min(1260px, calc(100vw - 32px))"
      style={{ top: 16 }}
      maskClosable={false}
      keyboard={false}
      closable={false}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="attach" style={{ width: 150 }} onClick={lookupFile}>{`증빙자료(${model?.fileCountStr ?? '0건'})`}</Button>
            {editable && <Button type="save" disabled={!inProgress || busy} onClick={() => complete('P')}>점검완료</Button>}
            {editable && <Button type="cancel" disabled={inProgress || busy} onClick={cancelComplete}>완료취소</Button>}
            {editable && <Button type="save" disabled={!inProgress || busy} onClick={update}>저장</Button>}
            {/* [E9] closeButton[닫기].Select (L247) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      {model && (
        <div style={{ display: 'flex', gap: 24, maxHeight: 'calc(100vh - 190px)', overflowY: 'auto', paddingRight: 4 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Row label="점검항목" top><Input.TextArea readOnly style={{ height: 80, resize: 'none' }} value={model.checkItem ?? ''} /></Row>
            <Row label="점검시기"><Input readOnly value={model.checkCycleInfo ?? ''} /></Row>
            <Row label="점검방법" top><Input.TextArea readOnly style={{ height: 162, resize: 'none' }} value={model.checkHow ?? ''} /></Row>
            <Row label="증빙자료" top><Input.TextArea readOnly style={{ height: 80, resize: 'none' }} value={model.checkEvidDocName ?? ''} /></Row>
            <Row label="규정/양식" top>
              {relateManl && <Tdm43_Page_Relate key={model.chckManlId} manl={relateManl} updateYn={false} />}
            </Row>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', gap: 24 }}>
              <div style={{ flex: 1 }}><Row label="점검상태"><Input readOnly value={model.checkStatusName ?? ''} /></Row></div>
              <div style={{ flex: 1 }}><Row label="점검자"><Input readOnly value={model.checkerName ?? ''} /></Row></div>
            </div>
            <Row label="점검일자" blue>
              <DatePicker style={{ width: 270 }} format={DATE_FORMAT} disabled={!editable} value={checkDate} onChange={setCheckDate} />
            </Row>
            <Row label="점검결과" blue>
              <Space>
                {/* CommonComboBoxField("sys.Sys00_Common.selectByKindGroupCode", TdmCheckResult0001) */}
                <SystemCodeComboBox kindGroupCd="TdmCheckResult0001" style={{ width: 270 }} placeholder="선택하세요" allowClear={false} disabled={!editable}
                  value={resultCode} onChange={(code, name) => { setResultCode(code); setResultName(name ?? ''); }} />
                <Button type="register" disabled={!planEnabled} onClick={openPlan}>{mode === 'view' ? '조치계획확인' : '조치계획등록'}</Button>
                {editable && <Button type="register" disabled={!inProgress} onClick={callBot}>AI</Button>}
              </Space>
            </Row>
            <Row label="점검의견" blue top>
              {/* checkCmnt.mask("작성중") L466 */}
              <Spin spinning={botBusy} tip="작성중">
                <Input.TextArea readOnly={!editable} style={{ height: 310, resize: 'none' }} value={cmnt} onChange={e => setCmnt(e.target.value)} />
              </Spin>
            </Row>
          </div>
        </div>
      )}
      <Tdm54_Edit_ChckInsuff target={insuff} onClose={() => setInsuff(null)} />
      <Tdm00_Lookup_RelateAppr open={evid != null} mode={evid?.mode} keyTable="tdm52" keyTableId={evid?.id ?? null}
        onChanged={evid?.mode === 'open' ? onEvidChanged : undefined} onClose={() => setEvid(null)} />
    </Modal>
  );
};
