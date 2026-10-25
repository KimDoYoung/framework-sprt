/**
 * 이행점검 승인상세 창 (N23) — Tdm59_TabPage_CheckAppr 점검상세 그리드의 승인처리 아이콘이 연다(미흡/개선 그리드에서 상태가 "발생"인 행도 이것을 연다).
 * AS-IS: myApp/client/vi/tdm/Tdm52_Edit_ChckManlCmnt.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L84-102: 모달 1300×820, 아래 가운데 [승인][반려][취소] … [임시저장][닫기]. getEditor() L256-336: 왼쪽 = 점검항목(80)·점검시기·점검방법(162)·증빙자료(80)·규정/양식(Tdm43_Page_Relate, 읽기 전용),
 *   오른쪽 = 점검상태/점검부서·점검일자/점검자·점검결과 + [미흡조치계획]·점검의견(375)·[증빙자료(n건)], 아래 = 승인상태(270)·승인(반려)의견(90)
 * view(model) L104-114: 읽기 전용(승인·반려·취소·임시저장 숨김) / edit(model, stdDate, cb) L116-125. setButton() L386-409: 상태 10(대기)이면 승인·반려·임시저장을 켜고 취소는 끈다
 * 다음 단계: [증빙자료(n건)] 증빙자료 창(Tdm00_Lookup_RelateAppr)은 안내만 (N22와 같다)
 * UX보강(10): 해당 없음
 */
import React, { useEffect, useMemo, useState } from 'react';
import { Input, Modal, Space, Typography, message } from 'antd';
import { errorMessage } from '@/api/client';
import { tdmApi } from '@/api/tdm';
import { TdmCheckApprManl, TdmCheckManlDetail, TdmManlItem } from '@/types/tdm';
import { Button } from '@/components/button';
import { Tdm43_Page_Relate } from './Tdm43_Page_Relate';
import { Tdm54_Edit_ChckInsuff, ChckInsuffTarget } from './Tdm54_Edit_ChckInsuff';

export interface ManlCmntTarget {
  mode: 'view' | 'edit';
  manl: TdmCheckApprManl;
  /** 이 점검항목이 속한 승인 행 (서버가 다시 읽는 데 쓴다) */
  chckApprCmntId: number;
}

interface Props {
  target: ManlCmntTarget | null;
  /** AS-IS callBack.execute(model) — 처리 뒤 서버에서 다시 읽은 점검항목(목록의 그 행을 바꾼다) */
  onChanged: (manl: TdmCheckApprManl) => void;
  onClose: () => void;
}

const Row: React.FC<{ label: React.ReactNode; blue?: boolean; top?: boolean; children: React.ReactNode }> = ({ label, blue, top, children }) => (
  <div style={{ display: 'flex', alignItems: top ? 'flex-start' : 'center', marginBottom: 12 }}>
    <Typography.Text strong style={{ width: 100, flex: 'none', paddingTop: top ? 5 : 0, textAlign: 'right', paddingRight: 8, color: blue ? '#0069B4' : undefined }}>{label}</Typography.Text>
    <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
  </div>
);

const MESSAGES: Record<'A' | 'R' | 'C', string> = {
  A: '승인 처리가 완료되었습니다',
  R: '반려 처리가 완료되었습니다',
  C: '취소가 완료되었습니다',
};

export const Tdm52_Edit_ChckManlCmnt: React.FC<Props> = ({ target, onChanged, onClose }) => {
  const edit = target?.mode === 'edit';
  const [model, setModel] = useState<TdmCheckApprManl | null>(null);   // manlModel
  const [apprCmnt, setApprCmnt] = useState('');
  const [insuff, setInsuff] = useState<ChckInsuffTarget | null>(null);
  const [busy, setBusy] = useState(false);

  // [E0] 화면 열림 (생성자 L84-102, open() L127-145): 모델을 폼에 채우고 점검항목의 규정/양식 탭을 채운다(Tdm43_Page_Relate가 스스로 읽는다)
  useEffect(() => {
    if (!target) { setModel(null); return; }
    setModel(target.manl);
    setApprCmnt(target.manl.apprCmnt ?? '');
  }, [target]);

  const relateManl = useMemo(
    () => (model ? ({ manlId: model.manlId, manlOrgId: model.manlOrgId, refBasis: model.refBasis ?? '' } as TdmManlItem) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [model?.chckManlId],
  );

  const waiting = model?.apprStatusCode === '10';                       // setButton() L386-409
  const planVisible = model?.checkResultCode === '2' || model?.checkResultCode === '3';

  // [E1] planButton[미흡조치계획].Select (L166) → Tdm54_Edit_ChckInsuff.view(manlModel) — 조치계획 창은 점검항목(TdmCheckManlDetail)을 받는다
  const openPlan = async () => {
    if (!model) return;
    try {
      const detail: TdmCheckManlDetail = await tdmApi.getCheckManl(model.chckManlId);
      setInsuff({ manl: detail, mode: 'view', stdDate: `${model.checkYm.replace('.', '-')}-01` });
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E2] fileButton[증빙자료(n건)].Select (L175) → Tdm00_Lookup_RelateAppr.view("tdm52", chckManlId, null) — 다음 단계
  const lookupFile = () => { message.info('증빙자료 창(Tdm00_Lookup_RelateAppr)은 다음 단계에서 연결됩니다'); };

  // updateApprStatus(actionType) L352-384: tdm.Tdm60_ChckManlAppr.updateApprStatus
  const updateApprStatus = async (actionType: 'A' | 'R' | 'C') => {
    if (!model || !target || model.chckManlApprId == null) return;
    setBusy(true);
    try {
      const updated = await tdmApi.updateCheckApprManlStatus(target.chckApprCmntId, model.chckManlApprId, { actionType, checkYm: model.checkYm, apprCmnt });
      message.info(MESSAGES[actionType]);
      onChanged(updated);
      if (updated.apprStatusCode === '10') {
        setModel(updated);                                              // editDriver.edit(manlModel); setButton()
        setApprCmnt(updated.apprCmnt ?? '');
      } else {
        onClose();                                                      // hide()
      }
    } catch (err) {
      message.info(errorMessage(err, '처리 실패'));
    } finally {
      setBusy(false);
    }
  };

  const confirm = (content: string, action: 'A' | 'R' | 'C') => {
    Modal.confirm({ title: '확인', content, width: 300, okText: '예', cancelText: '아니오', onOk: () => updateApprStatus(action) });
  };

  // [E3] agreeButton[승인].Select (L182) → 미흡·개선이면 승인의견 필수 → messageBox YES [E4] (L193) → updateApprStatus("A")
  const onAgree = () => {
    if ((model?.checkResultName === '미흡' || model?.checkResultName === '개선') && !apprCmnt) {
      message.warning('점검결과가 "미흡"인 경우 승인의견은 필수입니다');
      return;
    }
    confirm('승인하시겠습니까?', 'A');
  };

  // [E5] rejectButton[반려].Select (L205) → 반려사유 필수 → messageBox YES [E6] (L214) → updateApprStatus("R")
  const onReject = () => {
    if (!apprCmnt) { message.warning('반려사유를 입력하세요'); return; }
    confirm('반려하시겠습니까?', 'R');
  };

  // [E7] cancelButton[취소].Select (L226) → messageBox YES [E8] (L230) → updateApprStatus("C")
  const onCancel = () => confirm('승인(반려)를 취소하시겠습니까?', 'C');

  // [E9] updateButton[임시저장].Select (L242) → update() L338-350: tdm.Tdm60_ChckManlAppr.updateApprCmnt
  const update = async () => {
    if (!model || !target || model.chckManlApprId == null) return;
    setBusy(true);
    try {
      await tdmApi.saveCheckApprManlCmnt(target.chckApprCmntId, model.chckManlApprId, apprCmnt);
      message.info('저장이 완료되었습니다');
    } catch (err) {
      message.info(errorMessage(err, '저장 실패'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      open={!!target}
      title={<b>이행점검 승인상세</b>}
      width="min(1300px, calc(100vw - 32px))"
      style={{ top: 16 }}
      maskClosable={false}
      keyboard={false}
      closable={false}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {edit && <Button type="save" disabled={!waiting || busy} onClick={onAgree}>승인</Button>}
            {edit && <Button type="cancel" disabled={!waiting || busy} onClick={onReject}>반려</Button>}
            {edit && <Button type="cancel" disabled={waiting || busy} onClick={onCancel}>취소</Button>}
            {edit && <Button type="save" disabled={!waiting || busy} onClick={update}>임시저장</Button>}
            {/* [E10] closeButton[닫기].Select (L248) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      {model && (
        <div style={{ maxHeight: 'calc(100vh - 190px)', overflowY: 'auto', paddingRight: 4 }}>
          <div style={{ display: 'flex', gap: 24 }}>
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
                <div style={{ flex: 1 }}><Row label="점검부서"><Input readOnly value={model.orgName ?? ''} /></Row></div>
              </div>
              <div style={{ display: 'flex', gap: 24 }}>
                <div style={{ flex: 1 }}><Row label="점검일자"><Input readOnly value={model.checkDate ? model.checkDate.replace(/-/g, '.') : ''} /></Row></div>
                <div style={{ flex: 1 }}><Row label="점검자"><Input readOnly value={model.checkerName ?? ''} /></Row></div>
              </div>
              <Row label="점검결과">
                <Space>
                  <Input readOnly style={{ width: 270 }} value={model.checkResultName ?? ''} />
                  {planVisible && <Button type="register" onClick={openPlan}>미흡조치계획</Button>}
                </Space>
              </Row>
              <Row label="점검의견" top><Input.TextArea readOnly style={{ height: 300, resize: 'none' }} value={model.checkCmnt ?? ''} /></Row>
              <Row label=" "><Button type="attach" style={{ width: 150 }} onClick={lookupFile}>{`증빙자료(${model.fileCountStr ?? '0건'})`}</Button></Row>
            </div>
          </div>
          <div style={{ borderTop: '1px solid #d9d9d9', marginTop: 4, paddingTop: 12 }}>
            <Row label="승인상태" blue><Input readOnly style={{ width: 270 }} value={model.apprStatusName ?? ''} /></Row>
            <Row label="승인(반려)의견" blue top>
              <Input.TextArea style={{ height: 90, resize: 'none' }} readOnly={!edit || !waiting} value={apprCmnt} onChange={e => setApprCmnt(e.target.value)} />
            </Row>
          </div>
        </div>
      )}
      <Tdm54_Edit_ChckInsuff target={insuff} onClose={() => setInsuff(null)} />
    </Modal>
  );
};
