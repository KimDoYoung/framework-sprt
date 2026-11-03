/**
 * 미사용ID 기록관리 선택내역 일괄반영 창 — Icam55_Tab_UserStopAuth의 [일괄저장]에서 연다 (EE32)
 * AS-IS: myApp/client/vi/icam/Icam55_Lookup_UserStopAuth.java (159줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open() L50-91: 모달 500×250 "선택내역 일괄반영", 삭제일자 · 권한정지 해제일자 · 비고(높이 60), 아래 가운데 [저장][닫기]. EditModal 규격(11 §4a).
 */
import React, { useEffect, useState } from 'react';
import { DatePicker, Input, message, Modal } from 'antd';
import { Dayjs } from 'dayjs';
import { icamUserApi } from '@/api/icam';
import { errorMessage } from '@/api/client';
import { Button } from '@/components/button';
import { StopAuthField } from './Icam55_Edit_UserStopAuth';

const FORMAT = 'YYYY-MM-DD';

interface Props {
  /** 일괄반영할 행 번호 — 값이 있으면 열림 (AS-IS open(list, callback)) */
  ids: number[] | null;
  /** 저장한 뒤 (AS-IS callback.execute() 뒤 hide) */
  onDone: () => void;
  onClose: () => void;
}

export const Icam55_Lookup_UserStopAuth: React.FC<Props> = ({ ids, onDone, onClose }) => {
  const [delDate, setDelDate] = useState<Dayjs | null>(null);
  const [unstopDate, setUnstopDate] = useState<Dayjs | null>(null);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  useEffect(() => { if (ids) { setDelDate(null); setUnstopDate(null); setNote(''); } }, [ids]);

  // [E1] delDate[삭제일자].Collapse (L95) → 인라인 L95-100: 삭제일자를 고르면 권한정지 해제일자를 비운다
  const onDelDate = (d: Dayjs | null) => { setDelDate(d); if (d) setUnstopDate(null); };
  // [E2] unstopDate[권한정지 해제일자].Collapse (L102) → 인라인 L102-107: 해제일자를 고르면 삭제일자를 비운다
  const onUnstopDate = (d: Dayjs | null) => { setUnstopDate(d); if (d) setDelDate(null); };

  // [E3] updateButton[저장].Select (L109) → update() L123-149: icam.Icam55_IcamUser.updateMultiAuth → callback.execute() → hide()
  //   (처리자는 서버가 정한다: 삭제일자·해제일자가 모두 비면 비움, 아니면 로그인 사원 — 원본은 클라이언트가 보냄)
  const update = async () => {
    if (!ids) return;
    setSaving(true);
    try {
      await icamUserApi.updateStopAuths({
        ids, delDate: delDate ? delDate.format(FORMAT) : null, unstopDate: unstopDate ? unstopDate.format(FORMAT) : null, note: note === '' ? null : note,
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
          {/* [E4] closeButton[닫기].Select (L115) → hide() */}
          <Button type="close" onClick={onClose} style={{ marginLeft: 8 }}>닫기</Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '12px 2px' }}>
        <StopAuthField label="삭제일자">
          <DatePicker style={{ width: 230 }} value={delDate} format={FORMAT} onChange={onDelDate} />
        </StopAuthField>
        <StopAuthField label="권한정지 해제일자">
          <DatePicker style={{ width: 230 }} value={unstopDate} format={FORMAT} onChange={onUnstopDate} />
        </StopAuthField>
        <StopAuthField label="비고">
          <Input.TextArea style={{ width: '100%', height: 60 }} value={note} onChange={e => setNote(e.target.value)} />
        </StopAuthField>
      </div>
    </Modal>
  );
};
