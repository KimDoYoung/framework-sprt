/**
 * 미사용ID 기록관리 [변경] 편집 창 — Icam55_Tab_UserStopAuth의 행 [변경] 아이콘에서 연다 (EE32)
 * AS-IS: myApp/client/vi/icam/Icam55_Edit_UserStopAuth.java (160줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open() L53-97: 모달 500×250, 제목 "회사명 사용자(사용자ID)", 삭제일자 · 권한정지 해제일자 · 비고(높이 60), 아래 가운데 [저장][닫기]. EditModal 규격(11 §4a).
 * 스타일: MF (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useEffect, useState } from 'react';
import { DatePicker, Input, message, Typography } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { icamUserApi } from '@/api/icam';
import { errorMessage } from '@/api/client';
import { IcamStopAuth } from '@/types/icam';
import { Button } from '@/components/button';
import { EditModal, EditField } from '@/components/form/EditForm';

const FORMAT = 'YYYY-MM-DD';

export const StopAuthField: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
    <Typography.Text style={{ width: 130, flex: 'none', lineHeight: '32px', textAlign: 'right', paddingRight: 10 }}>{label}</Typography.Text>
    <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
  </div>
);

interface Props {
  /** 편집할 행 — 값이 있으면 열림 (AS-IS open(model, callback)) */
  model: IcamStopAuth | null;
  /** 저장한 뒤 (AS-IS callback.execute() 뒤 hide) */
  onDone: () => void;
  onClose: () => void;
}

const toDay = (s?: string | null) => (s ? dayjs(s) : null);

export const Icam55_Edit_UserStopAuth: React.FC<Props> = ({ model, onDone, onClose }) => {
  const [delDate, setDelDate] = useState<Dayjs | null>(null);
  const [unstopDate, setUnstopDate] = useState<Dayjs | null>(null);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  // editDriver.edit(model): 열 때 행의 값을 채운다
  useEffect(() => {
    if (model) { setDelDate(toDay(model.delDate)); setUnstopDate(toDay(model.unstopDate)); setNote(model.note ?? ''); }
  }, [model]);

  // [E1] delDate[삭제일자].Collapse (L101) → 인라인 L101-106: 삭제일자를 고르면 권한정지 해제일자를 비운다
  const onDelDate = (d: Dayjs | null) => { setDelDate(d); if (d) setUnstopDate(null); };
  // [E2] unstopDate[권한정지 해제일자].Collapse (L108) → 인라인 L108-113: 해제일자를 고르면 삭제일자를 비운다
  const onUnstopDate = (d: Dayjs | null) => { setUnstopDate(d); if (d) setDelDate(null); };

  // [E3] updateButton[저장].Select (L115) → update() L129-150: icam.Icam55_IcamUser.updateEachAuth → callback.execute() → hide()
  const update = async () => {
    if (!model) return;
    setSaving(true);
    try {
      await icamUserApi.updateStopAuth(model.icamUserId, {
        delDate: delDate ? delDate.format(FORMAT) : null, unstopDate: unstopDate ? unstopDate.format(FORMAT) : null, note: note === '' ? null : note,
      });
      onDone();
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <EditModal
      open={model != null}
      title={model ? `${model.companyName ?? ''} ${model.userName ?? ''}(${model.userId ?? ''})` : ''}
      width={500}
      onCancel={onClose}
      destroyOnClose
      styles={{ footer: { textAlign: 'center' } }}
      footer={
        <>
          <Button type="save" loading={saving} onClick={update}>저장</Button>
          {/* [E4] closeButton[닫기].Select (L121) → hide() */}
          <Button type="close" onClick={onClose} style={{ marginLeft: 8 }}>닫기</Button>
        </>
      }
    >
      <EditField label="삭제일자" labelWidth={125}>
        <DatePicker style={{ width: 230 }} value={delDate} format={FORMAT} onChange={onDelDate} />
      </EditField>
      <EditField label="권한정지 해제일자" labelWidth={125}>
        <DatePicker style={{ width: 230 }} value={unstopDate} format={FORMAT} onChange={onUnstopDate} />
      </EditField>
      <EditField label="비고" labelWidth={125}>
        <Input.TextArea style={{ width: '100%', height: 60 }} value={note} onChange={e => setNote(e.target.value)} />
      </EditField>
    </EditModal>
  );
};
