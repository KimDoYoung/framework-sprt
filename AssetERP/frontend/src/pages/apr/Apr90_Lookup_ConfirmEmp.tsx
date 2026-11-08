/**
 * 승인자 지정 창 (V09) — [문서폐기 신청]의 사유를 쓴 뒤 폐기 승인자를 정한다.
 * AS-IS: myApp/client/vi/apr/Apr90_Lookup_ConfirmEmp.java (151줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L51-69: 모달 "승인자 지정"(AS-IS 100×150은 안쪽 칸에 맞춘 값 — 380폭으로 둔다), 읽기 전용 칸(돋보기 → Emp00_Lookup_SelectSingle) , 푸터 [확인][닫기]
 * 스타일: MF (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useEffect, useState } from 'react';
import { message, Modal } from 'antd';
import dayjs from 'dayjs';
import { aprExtraApi } from '@/api/apr';
import { errorMessage } from '@/api/client';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Emp00_Lookup_SelectSingle } from '@/components/lookup/Emp00_Lookup_SelectSingle';

interface Props {
  open: boolean;
  /** callback.execute(confirmEmpId) — [확인] 뒤 부르는 쪽이 이어서 한다 */
  onResult: (confirmEmpId: number) => void;
  onClose: () => void;
}

export const Apr90_Lookup_ConfirmEmp: React.FC<Props> = ({ open, onResult, onClose }) => {
  const [empId, setEmpId] = useState<number | null>(null);
  const [empName, setEmpName] = useState('');
  const [lookupOpen, setLookupOpen] = useState(false);

  // settings() L81-111 → getApprStep() L113-132: 내 조직의 결재 단계 조직장을 처음 값으로
  useEffect(() => {
    if (!open) { setEmpId(null); setEmpName(''); return; }
    let alive = true;
    aprExtraApi.getDisposalConfirmEmp().then(e => {
      if (alive && e) { setEmpId(e.personId); setEmpName(e.korName); }
    }).catch(err => message.error(errorMessage(err, '조회 실패')));
    return () => { alive = false; };
  }, [open]);

  // [E2] updateButton[확인].Select (L99) → updateChk() L134-141 → update() L143-146: callback.execute(confirmEmpId), hide()
  const updateChk = () => {
    if (empId == null) {
      Modal.info({ title: '확인', content: '승인자는 필수선택항목입니다', okText: '확인' });
      return;
    }
    onResult(empId);
  };

  return (
    <>
      <LookupModal
        open={open}
        title="승인자 지정"
        width={380}
        maskClosable={false}
        onCancel={onClose}
        destroyOnClose
        focusFirst={false}
        styles={{ header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 12 } }}
        footer={
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
            <Button type="save" onClick={updateChk}>확인</Button>
            {/* [E3] closeButton[닫기].Select (L105) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </div>
        }
      >
        <div style={{ padding: '12px 2px' }}>
          {/* [E1] confirmEmpName.TriggerClick (L85) → Emp00_Lookup_SelectSingle.open(오늘, cb) */}
          <LookupInput value={empName} width={340} onOpen={() => setLookupOpen(true)} />
        </div>
      </LookupModal>
      <Emp00_Lookup_SelectSingle
        open={lookupOpen}
        noneLabel={null}
        transDate={dayjs().format('YYYY-MM-DD')}
        onResult={r => { setLookupOpen(false); if (r) { setEmpId(r.personId); setEmpName(r.korNm ?? ''); } }}
        onClose={() => setLookupOpen(false)}
      />
    </>
  );
};
