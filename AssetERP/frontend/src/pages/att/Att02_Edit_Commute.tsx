/**
 * 출퇴근 개별수정 창 (T06) — Att02_Tab_CommuteAdmin 그리드의 수정 아이콘 열이 연다
 * AS-IS: myApp/client/vi/att/Att02_Edit_Commute.java (223줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L61-91: 400×210, 라벨 폭 130, 확정 출근시간 {HH:mm} {출근일(비활성)} · 확정 퇴근시간 {HH:mm} {퇴근일}, 아래 가운데 [저장][닫기]
 */
import React, { useEffect, useState } from 'react';
import { DatePicker, Input, Modal, message, Space, Typography } from 'antd';
import dayjs from 'dayjs';
import { attApi } from '@/api/att';
import { errorMessage } from '@/api/client';
import { AttCommute } from '@/types/att';
import { Button } from '@/components/button';
import { formatTime, isValidTime, onlyTimeKey } from './attTime';

interface Props {
  /** 수정할 출퇴근 행 — null이면 닫힘 */
  target: AttCommute | null;
  /** AS-IS callback.execute(updateModel): 저장한 뒤 부르는 쪽이 다시 조회한다 */
  onSaved: () => void;
  onClose: () => void;
}

const DATE = 'YYYY-MM-DD';

/** 라벨 폭 130 (form.setLabelWidth(130)) */
const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Typography.Text style={{ width: 130, flex: 'none', textAlign: 'right', paddingRight: 10 }}>{children}</Typography.Text>
);

export const Att02_Edit_Commute: React.FC<Props> = ({ target, onSaved, onClose }) => {
  const [inDate, setInDate] = useState<string | null>(null);
  const [inTime, setInTime] = useState('');
  const [outDate, setOutDate] = useState<string | null>(null);
  const [outTime, setOutTime] = useState('');
  const [saving, setSaving] = useState(false);

  // [E0] 화면 열림 (생성자 L61-91) → show(). edit() L51-59: editDriver.edit(commuteModel)
  useEffect(() => {
    if (!target) return;
    setInDate(target.checkInTime ?? null);
    setInTime(target.checkInTimeStr ?? '');
    setOutDate(target.checkOutTime ?? null);
    setOutTime(target.checkOutTimeStr ?? '');
  }, [target]);

  // update() L175-191: att.Att04_CommuteHist.insert(updateModel, personId(서버), changeReason "개별수정") → callback.execute() → hide()
  const update = async () => {
    if (!target) return;
    setSaving(true);
    try {
      await attApi.updateCommuteTime(target.commuteId, { checkInTime: inDate, checkInTimeStr: inTime, checkOutTime: outDate, checkOutTimeStr: outTime });
      onSaved();
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  // [E5] updateButton[저장].Select (L123) → updateChk() L137-173
  const updateChk = () => {
    if (inDate == null || !inTime) { message.warning('출근시간을 입력해주세요'); return; }
    if (outDate == null || !outTime) { message.warning('퇴근시간을 입력해주세요'); return; }
    if (!isValidTime(inTime)) { message.warning('출근시간 형식은 HH:mm 입니다.'); return; }
    if (!isValidTime(outTime)) { message.warning('퇴근시간 형식은 HH:mm 입니다.'); return; }
    Modal.confirm({
      title: '확인',
      content: '해당 내용을 수정하시겠습니까?',
      width: 300,
      okText: '예',
      cancelText: '아니오',
      // [E7] msgBox.DialogHide [YES] (L158) → update()
      onOk: update,
    });
  };

  return (
    <Modal
      open={target != null}
      title="수정"
      width={400}
      maskClosable={false}
      onCancel={onClose}
      styles={{
        header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 0 },
        footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 0 },
      }}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={updateChk} loading={saving}>저장</Button>
            {/* [E6] closeButton[닫기].Select (L129) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '12px 2px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Label>확정 출근시간</Label>
          {/* [E1] checkInTimeStr.Blur (L99) → formatTime(), [E3] checkInTimeStr.KeyPress (L110) → 숫자와 ':'만 */}
          <Input style={{ width: 70 }} placeholder="24:59" value={inTime} onChange={e => setInTime(e.target.value)}
            onBlur={() => setInTime(formatTime(inTime) ?? '')} onKeyPress={onlyTimeKey} />
          {/* settings() L93: checkInTime.setEnabled(false) */}
          <DatePicker style={{ width: 115 }} disabled allowClear={false} format={DATE} value={inDate ? dayjs(inDate) : null} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Label>확정 퇴근시간</Label>
          {/* [E2] checkOutTimeStr.Blur (L104) → formatTime(), [E4] checkOutTimeStr.KeyPress (L116) → 숫자와 ':'만 */}
          <Input style={{ width: 70 }} placeholder="24:59" value={outTime} onChange={e => setOutTime(e.target.value)}
            onBlur={() => setOutTime(formatTime(outTime) ?? '')} onKeyPress={onlyTimeKey} />
          <DatePicker style={{ width: 115 }} allowClear={false} format={DATE} value={outDate ? dayjs(outDate) : null}
            onChange={d => setOutDate(d ? d.format(DATE) : null)} />
        </div>
      </div>
    </Modal>
  );
};
