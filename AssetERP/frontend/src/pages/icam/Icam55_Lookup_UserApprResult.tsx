/**
 * 선택내역 일괄반영 창 — Icam55_Tab_UserApprResult의 [일괄저장]에서 연다 (EE30)
 * AS-IS: myApp/client/vi/icam/Icam55_Lookup_UserApprResult.java (167줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open() L51-87: 모달 500×300 "선택내역 일괄반영", 라벨 100 + 처리결과 콤보(230) · 처리일자(230) · 처리상세(480×80), 아래 가운데 [저장][닫기]. EditModal 규격(11 §4a).
 */
import React, { useEffect, useState } from 'react';
import { DatePicker, Input, message, Modal, Typography } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { icamUserApi } from '@/api/icam';
import { errorMessage } from '@/api/client';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
    <Typography.Text style={{ width: 100, flex: 'none', lineHeight: '32px', textAlign: 'right', paddingRight: 10 }}>{label}</Typography.Text>
    <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
  </div>
);

interface Props {
  /** 일괄반영할 신청서 번호 — 값이 있으면 열림 (AS-IS open(list, callback)) */
  ids: number[] | null;
  /** 저장한 뒤 (AS-IS callback.execute() 뒤 hide) */
  onDone: () => void;
  onClose: () => void;
}

export const Icam55_Lookup_UserApprResult: React.FC<Props> = ({ ids, onDone, onClose }) => {
  const [code, setCode] = useState('');
  const [procDate, setProcDate] = useState<Dayjs | null>(null);
  const [procNote, setProcNote] = useState('');
  const [saving, setSaving] = useState(false);
  useEffect(() => { if (ids) { setCode(''); setProcDate(null); setProcNote(''); } }, [ids]);

  // [E1] procStateName[처리결과].Collapse (L93) → 인라인 L93-107: 선택안함이면 처리일자 비움, 1(완료)·9(이행불가)이고 처리일자가 비었으면 오늘
  const onState = (c: string | undefined) => {
    const next = c ?? '';
    setCode(next);
    if (next === '') setProcDate(null);
    else if ((next === '1' || next === '9') && !procDate) setProcDate(dayjs());
  };

  // [E2] updateButton[저장].Select (L109) → update() L123-157
  const update = async () => {
    if (!ids) return;
    if (code === '' && procDate) { message.warning('처리결과가 (선택안함)이면 처리일자는 세팅될 수 없습니다.'); return; }
    if (code !== '' && !procDate) { message.warning('처리일자를 세팅해주세요.'); return; }
    setSaving(true);
    try {
      await icamUserApi.updateResult({ ids, procStateCode: code || null, procDate: procDate ? procDate.format('YYYY-MM-DD') : null, procNote: procNote || null });
      message.success('저장이 완료되었습니다.');
      onDone();
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={ids != null}
      title="선택내역 일괄반영"
      width={500}
      maskClosable={false}
      onCancel={onClose}
      destroyOnClose
      styles={{
        header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 0 },
        footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 0, textAlign: 'center' },
      }}
      footer={
        <>
          <Button type="save" loading={saving} onClick={update}>저장</Button>
          {/* [E3] closeButton[닫기].Select (L115) → hide() */}
          <Button type="close" onClick={onClose} style={{ marginLeft: 8 }}>닫기</Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '12px 2px' }}>
        <Field label="처리결과">
          <SystemCodeComboBox kindCd="ProcStateCode" altCode={['', '(선택안함)']} placeholder="선택" style={{ width: 230 }} value={code === '' ? undefined : code} onChange={onState} />
        </Field>
        <Field label="처리일자">
          <DatePicker style={{ width: 230 }} value={procDate} format="YYYY-MM-DD" onChange={d => setProcDate(d)} />
        </Field>
        <Field label="처리상세">
          <Input.TextArea style={{ width: '100%', height: 80 }} value={procNote} onChange={e => setProcNote(e.target.value)} />
        </Field>
      </div>
    </Modal>
  );
};
