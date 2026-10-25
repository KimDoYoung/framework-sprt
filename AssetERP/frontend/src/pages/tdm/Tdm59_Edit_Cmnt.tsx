/**
 * 승인(반려) 의견 창 (N23) — Tdm59_Tab_CheckAppr 그리드의 승인의견 아이콘이 연다.
 * AS-IS: myApp/client/vi/tdm/Tdm59_Edit_Cmnt.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L62-78: 모달 630×(SUB 320 / SELF 470), 아래 가운데 [등록][반려][등록취소] … [닫기]. getEditor() L233-259: 점검부서(읽기)·승인(반려) 의견(150)·(SELF만) 보고 의견(150)
 * view(model) L80-90: 읽기 전용(등록·반려·등록취소 숨김) / edit(model, stdDate, checkYm, cb) L92-120: 반려된 점검항목이 있으면 [반려], 없으면 [등록]을 보인다
 * 점검항목이 0건인 SELF 행은 승인(반려) 의견 칸이 꺼진다 (L133-137). setButton() L299-328: 상태 10(대기)면 등록(반려)만 켜고 취소는 끈다
 * UX보강(10): 해당 없음
 */
import React, { useEffect, useState } from 'react';
import { Input, Modal, Space, Typography, message } from 'antd';
import { errorMessage } from '@/api/client';
import { tdmApi } from '@/api/tdm';
import { TdmCheckApprCmnt } from '@/types/tdm';
import { Button } from '@/components/button';

export interface CmntEditTarget {
  mode: 'view' | 'edit';
  model: TdmCheckApprCmnt;
}

interface Props {
  target: CmntEditTarget | null;
  /** AS-IS callBack.execute(model) — 처리 뒤 서버에서 다시 읽은 승인 행. 부르는 쪽이 목록을 다시 조회한다 */
  onChanged: (model: TdmCheckApprCmnt) => void;
  onClose: () => void;
}

const Row: React.FC<{ label: React.ReactNode; top?: boolean; children: React.ReactNode }> = ({ label, top, children }) => (
  <div style={{ display: 'flex', alignItems: top ? 'flex-start' : 'center', marginBottom: 12 }}>
    <Typography.Text strong style={{ width: 120, flex: 'none', paddingTop: top ? 5 : 0, textAlign: 'right', paddingRight: 8 }}>{label}</Typography.Text>
    <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
  </div>
);

const MESSAGES: Record<'A' | 'R' | 'C', string> = {
  A: '승인 처리가 완료되었습니다',
  R: '반려 처리가 완료되었습니다',
  C: '취소가 완료되었습니다',
};

export const Tdm59_Edit_Cmnt: React.FC<Props> = ({ target, onChanged, onClose }) => {
  const mode = target?.mode ?? 'view';
  const [model, setModel] = useState<TdmCheckApprCmnt | null>(null);   // apprModel
  const [apprCmnt, setApprCmnt] = useState('');
  const [reportCmnt, setReportCmnt] = useState('');
  const [isReject, setIsReject] = useState(false);
  const [busy, setBusy] = useState(false);

  // [E0] 화면 열림 (생성자 L62-78, edit() L92-120, open() L122-144): edit면 반려 점검항목 수(statusType 2)를 먼저 읽고 연다
  useEffect(() => {
    if (!target) { setModel(null); return; }
    const m = target.model;
    setModel(m);
    setApprCmnt(m.apprCmnt ?? '');
    setReportCmnt(m.reportCmnt ?? '');
    setIsReject(false);
    if (target.mode === 'edit') {
      tdmApi.countCheckApprRejected(m.chckApprCmntId).then(n => setIsReject(n > 0)).catch(err => message.error(errorMessage(err, '조회 실패')));
    }
  }, [target]);

  const self = model?.cmntType === 'SELF';
  const edit = mode === 'edit';
  const noCheck = self && (model?.monthCheckCnt ?? 0) === 0;            // 점검항목이 0건인 SELF → apprCmnt.setEnabled(false)
  const waiting = model?.apprStatusCode === '10';                       // setButton() L299-328
  const apprReadOnly = !edit || !waiting;                               // 승인(반려) 의견: view이거나 대기가 아니면 읽기 전용
  const reportReadOnly = !edit;                                         // 보고 의견: edit()가 읽기 전용을 풀고 setButton()은 건드리지 않는다

  // updateApprStatus(actionType) L261-297: tdm.Tdm59_ChckApprCmnt.updateApprCmnt
  const updateApprStatus = async (actionType: 'A' | 'R' | 'C') => {
    if (!model || !target) return;
    setBusy(true);
    try {
      const updated = await tdmApi.updateCheckApprCmnt(model.chckApprCmntId, {
        actionType, checkYm: model.checkYm, apprCmnt, ...(self ? { reportCmnt } : {}),
      });
      message.info(MESSAGES[actionType]);
      onChanged(updated);
      if (updated.apprStatusCode === '10') {
        setModel(updated);                                              // editDriver.edit(apprModel); setButton()
        setApprCmnt(updated.apprCmnt ?? '');
        setReportCmnt(updated.reportCmnt ?? '');
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
    Modal.confirm({ title: '확인', content, width: 350, okText: '예', cancelText: '아니오', onOk: () => updateApprStatus(action) });
  };

  // [E1] agreeButton[등록].Select [apprCmnt.isEnabled()] (L151) → 승인(반려)의견·종합의견 필수 → messageBox YES [E2] (L170) → updateApprStatus("A")
  const onAgree = () => {
    if (!noCheck && !apprCmnt) { message.warning('승인(반려)의견을 입력하세요'); return; }
    if (self && !reportCmnt) { message.warning('종합의견을 입력하세요'); return; }
    confirm('등록하시겠습니까?', 'A');
  };

  // [E3] rejectButton[반려].Select (L182) → 반려사유 필수 → messageBox YES [E4] (L191) → updateApprStatus("R")
  const onReject = () => {
    if (!apprCmnt) { message.warning('반려사유를 입력하세요'); return; }
    confirm('반려하시겠습니까?', 'R');
  };

  // [E5] cancelButton[등록취소].Select (L203) → messageBox YES [E6] (L207) → updateApprStatus("C")
  const onCancel = () => confirm('승인(반려)를 취소하시겠습니까?', 'C');

  return (
    <Modal
      open={!!target}
      title={<b>승인(반려) 의견</b>}
      width={630}
      maskClosable={false}
      keyboard={false}
      closable={false}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {edit && !isReject && <Button type="register" disabled={!waiting || busy} onClick={onAgree}>등록</Button>}
            {edit && isReject && <Button type="cancel" disabled={!waiting || busy} onClick={onReject}>반려</Button>}
            {edit && <Button type="cancel" disabled={waiting || busy} onClick={onCancel}>등록취소</Button>}
            {/* [E7] closeButton[닫기].Select (L225) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      {model && (
        <div style={{ paddingTop: 15 }}>
          <Row label="점검부서"><Input readOnly value={model.checkOrgName ?? ''} /></Row>
          <Row label="승인(반려) 의견" top>
            <Input.TextArea style={{ height: 150, resize: 'none' }} readOnly={apprReadOnly} disabled={noCheck} value={apprCmnt} onChange={e => setApprCmnt(e.target.value)} />
          </Row>
          {self && (
            <Row label="보고 의견" top>
              <Input.TextArea style={{ height: 150, resize: 'none' }} readOnly={reportReadOnly} value={reportCmnt} onChange={e => setReportCmnt(e.target.value)} />
            </Row>
          )}
        </div>
      )}
    </Modal>
  );
};
