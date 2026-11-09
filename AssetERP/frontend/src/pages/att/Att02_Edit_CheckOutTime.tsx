/**
 * 미등록 근태(이전) 퇴근시간 입력 창 (EE50) — Att02_Lookup_Commute가 지난 근무일의 퇴근이 비어 있을 때 연다
 * AS-IS: myApp/client/vi/att/Att02_Edit_CheckOutTime.java (177줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L67-97: 440×200, 닫기(X) 없음, 라벨 폭 120, 출근시간 {HH:mm 비활성} {출근일 비활성} · 퇴근시간 {HH:mm} {퇴근일(출근일 ~ 출근일+1)}, 아래 가운데 [제출]
 * 스타일: MF (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useEffect, useState } from 'react';
import { DatePicker, Input, message } from 'antd';
import { EditModal, EditField } from '@/components/form/EditForm';
import dayjs from 'dayjs';
import { attApi } from '@/api/att';
import { errorMessage } from '@/api/client';
import { AttMyCommute } from '@/types/att';
import { Button } from '@/components/button';
import { formatTime, isValidTime, onlyTimeKey } from './attTime';

interface Props {
  /** 퇴근시간이 비어 있는 지난 출퇴근 행 — null이면 닫힘 */
  target: AttMyCommute | null;
  /** AS-IS callback.execute(): 제출한 뒤 */
  onDone?: () => void;
  onClose: () => void;
}

const DATE = 'YYYY-MM-DD';

export const Att02_Edit_CheckOutTime: React.FC<Props> = ({ target, onDone, onClose }) => {
  const [outDate, setOutDate] = useState<string | null>(null);
  const [outTime, setOutTime] = useState('');
  const [saving, setSaving] = useState(false);
  const inDate = target?.checkInTime?.slice(0, 10) ?? null;

  // [E0] 화면 열림 (생성자 L67-97) → show(). edit() L48-65: 출근 칸은 비활성, 퇴근일은 출근일 ~ 출근일+1
  useEffect(() => {
    if (!target) return;
    setOutDate(target.checkOutTime?.slice(0, 10) ?? null);
    setOutTime(target.checkOutTimeStr ?? '');
  }, [target]);

  // [E3] updateButton[제출].Select (L112) → update() L120-145
  const update = async () => {
    if (!target) return;
    if (outDate == null || !outTime) { message.warning('퇴근시간을 입력해주세요'); return; }
    if (!isValidTime(outTime)) { message.warning('퇴근시간 형식은 HH:mm 입니다.'); return; }
    setSaving(true);
    try {
      await attApi.updateMyCheckOutTime(target.commuteId, outDate, outTime);
      onDone?.();
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  const minDate = inDate ? dayjs(inDate) : null;
  const maxDate = inDate ? dayjs(inDate).add(1, 'day') : null;

  return (
    <EditModal
      open={target != null}
      title="미등록 근태 (이전)"
      width={440}
      closable={false}
      keyboard={false}
      footer={<div style={{ textAlign: 'center' }}><Button type="save" onClick={update} loading={saving}>제출</Button></div>}
    >
      {/* AS-IS 라벨 폭 120 → 편집 폼 원칙: 가장 긴 라벨(4글자) 기준 70 */}
      <EditField label="출근시간" labelWidth={70}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* edit() L60-61: checkInTimeStr.setEnabled(false), checkInTime.setEnabled(false) */}
          <Input style={{ width: 70 }} disabled value={target?.checkInTimeStr ?? ''} />
          <DatePicker style={{ width: 115 }} disabled allowClear={false} format={DATE} value={inDate ? dayjs(inDate) : null} />
        </div>
      </EditField>
      <EditField label="퇴근시간" labelWidth={70}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* [E1] checkOutTimeStr.Blur (L101) → formatTime(), [E2] checkOutTimeStr.KeyPress (L106) → 숫자와 ':'만 */}
          <Input style={{ width: 70 }} placeholder="HH:mm" value={outTime} onChange={e => setOutTime(e.target.value)}
            onBlur={() => setOutTime(formatTime(outTime) ?? '')} onKeyPress={onlyTimeKey} />
          {/* edit() L63-64: checkOutTime.setMinValue(출근일), setMaxValue(출근일+1) */}
          <DatePicker style={{ width: 115 }} allowClear={false} format={DATE} value={outDate ? dayjs(outDate) : null}
            minDate={minDate ?? undefined} maxDate={maxDate ?? undefined}
            onChange={d => setOutDate(d ? d.format(DATE) : null)} />
        </div>
      </EditField>
    </EditModal>
  );
};
