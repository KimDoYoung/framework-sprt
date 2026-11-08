/**
 * 문서폐기 신청 (사유) 창 (V09) — 완료·반려된 내 문서의 [문서폐기 신청]. 사유를 쓰고 승인자를 정해 신청서를 제출한다.
 * AS-IS: myApp/client/vi/apr/Apr90_Lookup_DisposalList.java (163줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L63-81: 520×270 모달 "문서폐기 신청 (사유)", 사유 입력(510×210), 푸터 [제출][닫기]
 * 스타일: MF (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useEffect, useState } from 'react';
import { Input, message, Modal } from 'antd';
import { aprExtraApi } from '@/api/apr';
import { errorMessage } from '@/api/client';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Apr90_Lookup_ConfirmEmp } from './Apr90_Lookup_ConfirmEmp';

interface Props {
  /** open(apprModel, callback) — 값이 있으면 열린다 */
  apprId: number | null;
  /** 제출이 끝난 뒤 (AS-IS callback.execute() — "문서 폐기신청이 완료되었습니다") */
  onSubmitted: () => void;
  onClose: () => void;
}

export const Apr90_Lookup_DisposalList: React.FC<Props> = ({ apprId, onSubmitted, onClose }) => {
  const [reason, setReason] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => { if (apprId == null) { setReason(''); setConfirmOpen(false); } }, [apprId]);

  // [E1] updateButton[제출].Select (L94) → updateChk() L108-123: 사유가 비면 "사유는 필수입력항목입니다", 아니면 Apr90_Lookup_ConfirmEmp
  const updateChk = () => {
    if (reason.length === 0) {
      Modal.info({ title: '확인', content: '사유는 필수입력항목입니다', okText: '확인' });
      return;
    }
    setConfirmOpen(true);
  };

  // update(confirmEmpId) L125-158: "문서폐기 신청서를 제출하시겠습니까?" [E3] [YES] (L131) → apr.Apr90_DisposalList.modelUpdate → callback(), hide()
  const update = (confirmEmpId: number) => {
    setConfirmOpen(false);
    Modal.confirm({
      title: '확인',
      content: '문서폐기 신청서를 제출하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      width: 350,
      onOk: async () => {
        if (apprId == null) return;
        try {
          await aprExtraApi.submitDisposal(apprId, reason, confirmEmpId);
          onSubmitted();
          onClose();
        } catch (err) {
          message.error(errorMessage(err, '제출 실패'));
        }
      },
    });
  };

  return (
    <>
      <LookupModal
        open={apprId != null}
        title="문서폐기 신청 (사유)"
        width={560}
        maskClosable={false}
        onCancel={onClose}
        destroyOnClose
        styles={{ header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 12 } }}
        footer={
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
            <Button type="save" onClick={updateChk}>제출</Button>
            {/* [E2] closeButton[닫기].Select (L100) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </div>
        }
      >
        <div style={{ padding: '4px 2px 8px' }}>
          <Input.TextArea value={reason} maxLength={500} onChange={e => setReason(e.target.value)} style={{ height: 210, resize: 'none' }} />
        </div>
      </LookupModal>
      <Apr90_Lookup_ConfirmEmp open={confirmOpen} onResult={update} onClose={() => setConfirmOpen(false)} />
    </>
  );
};
