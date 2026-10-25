/**
 * 보고의견 창 (N23) — Tdm59_Tab_CheckAppr 그리드의 보고의견 아이콘이 연다.
 * AS-IS: myApp/client/vi/tdm/Tdm59_Edit_ReportCmnt.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L55-70: 모달 630×290, 아래 가운데 [등록][등록취소] … [닫기]. getEditor() L157-171: 보고 의견(150)
 * view(model) L72-80: 읽기 전용(등록·등록취소 숨김) / edit(model, stdDate, checkYm, cb) L82-91. setButton() L208-218: 상태 10(대기)면 [등록]만 켠다
 * UX보강(10): 해당 없음
 */
import React, { useEffect, useState } from 'react';
import { Input, Modal, Space, Typography, message } from 'antd';
import { errorMessage } from '@/api/client';
import { tdmApi } from '@/api/tdm';
import { TdmCheckApprCmnt } from '@/types/tdm';
import { Button } from '@/components/button';
import type { CmntEditTarget } from './Tdm59_Edit_Cmnt';

interface Props {
  target: CmntEditTarget | null;
  /** AS-IS callBack.execute(model) — 처리 뒤 서버에서 다시 읽은 승인 행. 부르는 쪽이 목록을 다시 조회한다 */
  onChanged: (model: TdmCheckApprCmnt) => void;
  onClose: () => void;
}

export const Tdm59_Edit_ReportCmnt: React.FC<Props> = ({ target, onChanged, onClose }) => {
  const edit = target?.mode === 'edit';
  const [model, setModel] = useState<TdmCheckApprCmnt | null>(null);   // apprModel
  const [reportCmnt, setReportCmnt] = useState('');
  const [busy, setBusy] = useState(false);

  // [E0] 화면 열림 (생성자 L55-70, open() L93-101): 모델을 폼에 채운다
  useEffect(() => {
    if (!target) { setModel(null); return; }
    setModel(target.model);
    setReportCmnt(target.model.reportCmnt ?? '');
  }, [target]);

  const waiting = model?.apprStatusCode === '10';                       // setButton() L208-218

  // updateApprStatus(actionType) L173-206: tdm.Tdm59_ChckApprCmnt.updateApprCmnt (승인 의견은 보내지 않는다 — 서버가 읽은 값 그대로)
  const updateApprStatus = async (actionType: 'A' | 'C') => {
    if (!model) return;
    setBusy(true);
    try {
      const updated = await tdmApi.updateCheckApprCmnt(model.chckApprCmntId, { actionType, checkYm: model.checkYm, reportCmnt });
      message.info(actionType === 'A' ? '승인 처리가 완료되었습니다' : '취소가 완료되었습니다');
      onChanged(updated);
      if (updated.apprStatusCode === '10') {
        setModel(updated);                                              // editDriver.edit(apprModel); setButton()
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

  // [E1] agreeButton[등록].Select (L106) → 보고의견 필수 → messageBox YES [E2] (L115) → updateApprStatus("A")
  const onAgree = () => {
    if (!reportCmnt) { message.warning('보고의견을 입력하세요'); return; }
    Modal.confirm({ title: '확인', content: '보고의견을 등록하시겠습니까?', width: 350, okText: '예', cancelText: '아니오', onOk: () => updateApprStatus('A') });
  };

  // [E3] cancelButton[등록취소].Select (L127) → messageBox YES [E4] (L131) → updateApprStatus("C")
  const onCancel = () => {
    Modal.confirm({ title: '확인', content: '보고의견 등록을 취소하시겠습니까?', width: 350, okText: '예', cancelText: '아니오', onOk: () => updateApprStatus('C') });
  };

  return (
    <Modal
      open={!!target}
      title={<b>보고의견</b>}
      width={630}
      maskClosable={false}
      keyboard={false}
      closable={false}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {edit && <Button type="register" disabled={!waiting || busy} onClick={onAgree}>등록</Button>}
            {edit && <Button type="cancel" disabled={waiting || busy} onClick={onCancel}>등록취소</Button>}
            {/* [E5] closeButton[닫기].Select (L149) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      {model && (
        <div style={{ paddingTop: 15, display: 'flex' }}>
          <Typography.Text strong style={{ width: 100, flex: 'none', paddingTop: 5, textAlign: 'right', paddingRight: 8 }}>보고 의견</Typography.Text>
          <Input.TextArea style={{ height: 150, resize: 'none' }} readOnly={!edit} value={reportCmnt} onChange={e => setReportCmnt(e.target.value)} />
        </div>
      )}
    </Modal>
  );
};
