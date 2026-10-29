/**
 * 출퇴근 일괄수정 창 (T06) — Att02_Tab_CommuteAdmin의 [일괄수정]이 연다
 * AS-IS: myApp/client/vi/att/Att02_Edit_CommuteBatch.java (258줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L61-94: 라벨 폭 110, [체크] 확정 출근시간 {HH:mm} {출근일} · [체크] 확정 퇴근시간 {HH:mm} {퇴근일}, 아래 가운데 [적용][닫기]
 * open() L52-59: 고른 행들 + settings() + defaultInfo() L210-226 (사용 중인 근태정책이 한 건이면 그 출근·퇴근시각을 칸에 넣는다)
 */
import React, { useEffect, useState } from 'react';
import { Checkbox, DatePicker, Input, Modal, message, Space, Typography } from 'antd';
import dayjs from 'dayjs';
import { attApi } from '@/api/att';
import { errorMessage } from '@/api/client';
import { AttCommute } from '@/types/att';
import { Button } from '@/components/button';
import { formatTime, isValidTime, onlyTimeKey } from './attTime';

interface Props {
  /** 일괄수정할 출퇴근 행들 — 값이 있으면 열림 */
  rows: AttCommute[] | null;
  /** AS-IS callback.execute(): 적용한 뒤 부르는 쪽이 다시 조회한다 */
  onSaved: () => void;
  onClose: () => void;
}

const DATE = 'YYYY-MM-DD';

/** 라벨 폭 110 (form.setLabelWidth(110)) */
const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Typography.Text style={{ width: 110, flex: 'none', textAlign: 'right', paddingRight: 10 }}>{children}</Typography.Text>
);

export const Att02_Edit_CommuteBatch: React.FC<Props> = ({ rows, onSaved, onClose }) => {
  const [checkIn, setCheckIn] = useState(true);
  const [checkOut, setCheckOut] = useState(true);
  const [inDate, setInDate] = useState<string | null>(null);
  const [inTime, setInTime] = useState('');
  const [outDate, setOutDate] = useState<string | null>(null);
  const [outTime, setOutTime] = useState('');
  const [saving, setSaving] = useState(false);

  // [E0] 화면 열림 (생성자 L61-94) → show(). settings() L96-150: 두 날짜를 첫 행의 근무일자로, 체크박스 둘 다 켬. defaultInfo() L210-226
  useEffect(() => {
    if (!rows || rows.length === 0) return;
    setCheckIn(true);
    setCheckOut(true);
    setInDate(rows[0].workDate);
    setOutDate(rows[0].workDate);
    setInTime('');
    setOutTime('');
    attApi.searchActiveWorkPolicies().then(list => {
      if (list.length === 1) {
        setInTime(list[0].workStartTime ?? '');
        setOutTime(list[0].workEndTime ?? '');
      }
    }).catch(err => message.error(errorMessage(err, '조회 실패')));
  }, [rows]);

  // [E7] updateButton[적용].Select (L138) → update() L152-208: att.Att04_CommuteHist.insertList(commuteIdList, personId(서버), changeReason "일괄수정", 체크한 쪽만 시각)
  const update = async () => {
    if (!rows) return;
    if (checkIn && (inDate == null || !inTime)) { message.warning('출근시간을 입력해주세요'); return; }
    if (checkOut && (outDate == null || !outTime)) { message.warning('퇴근시간을 입력해주세요'); return; }
    if (checkIn && !isValidTime(inTime)) { message.warning('출근시간 형식은 HH:mm 입니다.'); return; }
    if (checkOut && !isValidTime(outTime)) { message.warning('퇴근시간 형식은 HH:mm 입니다.'); return; }
    setSaving(true);
    try {
      await attApi.updateCommuteTimes(rows.map(r => r.commuteId), {
        checkInTime: checkIn ? inDate : null, checkInTimeStr: checkIn ? inTime : null,
        checkOutTime: checkOut ? outDate : null, checkOutTimeStr: checkOut ? outTime : null,
      });
      onSaved();
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={rows != null}
      title="일괄수정"
      width={480}
      maskClosable={false}
      onCancel={onClose}
      styles={{
        header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 0 },
        footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 0 },
      }}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={update} loading={saving}>적용</Button>
            {/* [E8] closeButton[닫기].Select (L144) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '12px 2px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* [E1] checkBox01.ValueChange (L104) → 출근 시각·날짜 칸 사용 여부 */}
          <Checkbox checked={checkIn} onChange={e => setCheckIn(e.target.checked)} />
          <Label>확정 출근시간</Label>
          {/* [E3] checkInTimeStr.Blur (L114) → formatTime(), [E5] checkInTimeStr.KeyPress (L125) → 숫자와 ':'만 */}
          <Input style={{ width: 70 }} placeholder="24:59" disabled={!checkIn} value={inTime} onChange={e => setInTime(e.target.value)}
            onBlur={() => setInTime(formatTime(inTime) ?? '')} onKeyPress={onlyTimeKey} />
          <DatePicker style={{ width: 115 }} disabled={!checkIn} allowClear={false} format={DATE} value={inDate ? dayjs(inDate) : null}
            onChange={d => setInDate(d ? d.format(DATE) : null)} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* [E2] checkBox02.ValueChange (L109) → 퇴근 시각·날짜 칸 사용 여부 */}
          <Checkbox checked={checkOut} onChange={e => setCheckOut(e.target.checked)} />
          <Label>확정 퇴근시간</Label>
          {/* [E4] checkOutTimeStr.Blur (L119) → formatTime(), [E6] checkOutTimeStr.KeyPress (L131) → 숫자와 ':'만 */}
          <Input style={{ width: 70 }} placeholder="24:59" disabled={!checkOut} value={outTime} onChange={e => setOutTime(e.target.value)}
            onBlur={() => setOutTime(formatTime(outTime) ?? '')} onKeyPress={onlyTimeKey} />
          <DatePicker style={{ width: 115 }} disabled={!checkOut} allowClear={false} format={DATE} value={outDate ? dayjs(outDate) : null}
            onChange={d => setOutDate(d ? d.format(DATE) : null)} />
        </div>
      </div>
    </Modal>
  );
};
