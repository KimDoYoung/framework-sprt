/**
 * 메모 (J07) — Flt02_Tab_EmpInfo 그리드의 편집 아이콘에서 연다.
 * AS-IS: myApp/client/vi/flt/Flt15_Lookup_Note.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L41-62: 모달 710×390 "메모", 큰 글상자(700×300) + [저장][닫기]. open(empModel, callback) L64-82: 서비스 flt.Flt15_TrStatus.selectByPersonId(companyId, personId, stdDate=행의 noteDate) — 없으면 서버가 만든다
 * UX보강(10): 조회창 UX-05(열면 글상자에 커서)
 */
import React, { useEffect, useState } from 'react';
import { Input, message, Space } from 'antd';
import { fltApi } from '@/api/flt';
import { errorMessage } from '@/api/client';
import { FltEmpInfo, FltTrStatus } from '@/types/flt';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';

interface Props {
  /** AS-IS open(empModel, callback)의 empModel — 값이 있으면 열린다 */
  emp: FltEmpInfo | null;
  /** callback.execute(empModel): 저장된 메모 있음/없음("있음"/"")으로 바뀐 행을 부른 쪽이 반영한다 */
  onSaved: (personId: number, note: string) => void;
  onClose: () => void;
}

export const Flt15_Lookup_Note: React.FC<Props> = ({ emp, onSaved, onClose }) => {
  const [status, setStatus] = useState<FltTrStatus | null>(null);
  const [note, setNote] = useState('');

  // [E0] 화면 열림 (생성자 L41-62) → settings(), show() — open() L64-82
  useEffect(() => {
    setStatus(null);
    setNote('');
    if (!emp?.noteDate) return;
    let alive = true;
    fltApi.getEmpNote(emp.personId, emp.noteDate)
      .then(s => { if (alive) { setStatus(s); setNote(s.note ?? ''); } })
      .catch(err => message.error(errorMessage(err, '조회 실패')));
    return () => { alive = false; };
  }, [emp]);

  // [E1] updateButton[저장].Select (L85) → update() L99-121: 서비스 flt.Flt15_TrStatus.update → 메모가 있으면 "있음" → 콜백 → hide()
  const update = async () => {
    if (!emp || !status) return;
    try {
      const saved = await fltApi.updateEmpNote(status.trStatusId, note);
      onSaved(emp.personId, saved.note && saved.note.length > 0 ? '있음' : '');
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  return (
    <LookupModal
      open={!!emp}
      title="메모"
      width={730}
      maskClosable={false}
      onCancel={onClose}
      destroyOnClose
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={update}>저장</Button>
            {/* [E2] closeButton[닫기].Select (L91) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <Input.TextArea style={{ height: 300, resize: 'none' }} value={note} onChange={e => setNote(e.target.value)} disabled={!status} />
    </LookupModal>
  );
};
