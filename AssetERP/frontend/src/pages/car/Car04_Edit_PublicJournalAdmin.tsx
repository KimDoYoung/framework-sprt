/**
 * 공용차량 운행일지 변경창 (T15) — Car04_Tab_PublicJournalAdmin의 그리드 [변경] 아이콘이 연다 (예약과 운행일지를 함께 고친다)
 * AS-IS: myApp/client/vi/car/Car04_Edit_PublicJournalAdmin.java (385줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L85-102: 모달 780×480 "공용차량 운행일지 변경", 아래 가운데 [저장][닫기]. getEditor() L207-271: 라벨 폭 140, 줄 = 사용일시(날짜 읽기 전용 + 시:분 ~ 시:분) / 사용자·업무용 사용거리(읽기 전용) / (출퇴근용) / (일반업무용) / 주행거리(읽기 전용)·비업무용 / 행선지 / 목적 / 참석자
 * EditModal 규격(11 §4a). 저장은 이 창이 한다(update() L322-376)
 */
import React, { useEffect, useState } from 'react';
import { DatePicker, Input, InputNumber, message, Modal, Space } from 'antd';
import dayjs from 'dayjs';
import { carApi } from '@/api/car';
import { errorMessage } from '@/api/client';
import { CarPublicAdminJournal } from '@/types/car';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Emp00_Lookup_SelectSingle } from '@/components/lookup/Emp00_Lookup_SelectSingle';

const FORMAT = 'YYYY-MM-DD';
/** NumberFormat "###,###,###" */
const fmtLong = (v: string | number | undefined) => (v == null || v === '' ? '' : `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','));
const parseNum = (v: string | undefined) => (v ?? '').replace(/,/g, '');
const num = (v: number | null | undefined) => v ?? 0;

const Cell: React.FC<{ label: string; width: number; unit?: boolean; children: React.ReactNode }> = ({ label, width, unit, children }) => (
  <div style={{ width, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
    <label style={{ width: 140, flexShrink: 0, textAlign: 'right', paddingRight: 10 }}>{label}</label>
    <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
    {unit && <span style={{ width: 50, paddingLeft: 5 }}>km</span>}
  </div>
);

const Row: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div style={{ display: 'flex', margin: '0 10px 20px 10px' }}>{children}</div>
);

interface Props {
  /** edit(selectModel, callBack): 값이 있으면 열림 */
  target: CarPublicAdminJournal | null;
  /** callBack.execute() — 저장이 끝나면 */
  onDone: () => void;
  onClose: () => void;
}

export const Car04_Edit_PublicJournalAdmin: React.FC<Props> = ({ target, onDone, onClose }) => {
  const [draft, setDraft] = useState<CarPublicAdminJournal>({});
  const [personOpen, setPersonOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // edit() L75-83: 열릴 때마다 선택 행으로 모델을 만든다
  useEffect(() => {
    if (target) setDraft({ ...target });
  }, [target]);

  const set = (patch: Partial<CarPublicAdminJournal>) => setDraft(prev => ({ ...prev, ...patch }));
  // calculation() L273-312: 업무용 = 출퇴근 + 일반업무, 주행거리 = 업무용 + 비업무 ([E3]~[E5] 세 거리칸 KeyUp L169-186)
  const calculate = (d: CarPublicAdminJournal): CarPublicAdminJournal => ({
    ...d,
    businessMileage: num(d.commuteMileage) + num(d.bizMileage),
    mileage: num(d.commuteMileage) + num(d.bizMileage) + num(d.unBizMileage),
  });
  const setKm = (key: 'commuteMileage' | 'bizMileage' | 'unBizMileage', v: number | null) => setDraft(prev => calculate({ ...prev, [key]: v }));
  const businessMileage = draft.businessMileage ?? 0;
  const mileage = draft.mileage ?? 0;

  // [E1] updateButton[저장].Select (L110) → update() L322-376: 시간·필수 검사 → car.Car03_Booking.updateJournalModel(겹치면 서버 메시지) → callBack, hide()
  const update = async () => {
    if (+(draft.startHour ?? 0) >= +(draft.closeHour ?? 0) && +(draft.startMin ?? 0) >= +(draft.closeMin ?? 0)) { message.warning('종료시간을 다시 설정해주세요.'); return; }
    if (mileage === 0) { message.warning('주행거리는 필수입력 항목입니다'); return; }
    if (!draft.destination) { message.warning('행선지는 필수입력 항목입니다'); return; }
    if (!draft.reason) { message.warning('목적은 필수입력 항목입니다'); return; }
    setSaving(true);
    try {
      await carApi.updateBookingJournal({
        bookingId: draft.bookingId as number, journalId: draft.journalId, infoId: draft.infoId as number, date: draft.date as string,
        personId: draft.personId as number, startHour: draft.startHour as string, startMin: draft.startMin as string,
        closeHour: draft.closeHour as string, closeMin: draft.closeMin as string, mileage,
        commuteMileage: draft.commuteMileage, bizMileage: draft.bizMileage, unBizMileage: draft.unBizMileage,
        destination: draft.destination, reason: draft.reason, attendance: draft.attendance, note: draft.note,
      });
      onDone();
      onClose();
    } catch (err) {
      message.warning(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  const km = (value: number | null | undefined, disabled: boolean, onChange?: (v: number | null) => void) => (
    <InputNumber style={{ width: '100%' }} controls={false} precision={0} formatter={fmtLong} parser={parseNum as never}
      disabled={disabled} value={value ?? null} onChange={v => onChange?.(v == null ? null : Number(v))} />
  );

  return (
    <>
      <Modal
        open={target != null}
        title="공용차량 운행일지 변경"
        width={780}
        maskClosable={false}
        destroyOnHidden
        onCancel={onClose}
        styles={{
          header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 0 },
          footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 0 },
        }}
        footer={
          <div style={{ textAlign: 'center' }}>
            <Space>
              <Button type="save" loading={saving} onClick={update}>저장</Button>
              {/* [E2] closeButton[닫기].Select (L116) → hide() */}
              <Button type="close" onClick={onClose}>닫기</Button>
            </Space>
          </div>
        }
      >
        {/* [E0] 화면 열림 (생성자 L85-102) → settings(), show() */}
        <div style={{ padding: '12px 2px 0' }}>
          <Row>
            <Cell label="사용일시" width={680}>
              <Space size={4}>
                <DatePicker style={{ width: 130 }} format={FORMAT} disabled allowClear={false} value={draft.date ? dayjs(draft.date) : null} />
                <span style={{ width: 6 }} />
                <SystemCodeComboBox kindCd="HourCode" style={{ width: 62 }} value={draft.startHour ?? undefined} onChange={c => set({ startHour: c ?? null })} />
                <SystemCodeComboBox kindCd="MinuteCode" style={{ width: 62 }} value={draft.startMin ?? undefined} onChange={c => set({ startMin: c ?? null })} />
                <span>~</span>
                <SystemCodeComboBox kindCd="HourCode" style={{ width: 62 }} value={draft.closeHour ?? undefined} onChange={c => set({ closeHour: c ?? null })} />
                <SystemCodeComboBox kindCd="MinuteCode" style={{ width: 62 }} value={draft.closeMin ?? undefined} onChange={c => set({ closeMin: c ?? null })} />
              </Space>
            </Cell>
          </Row>
          <Row>
            {/* [E6] personName[사용자].TriggerClick (L189) → Emp00_Lookup_SelectSingle.open(오늘) → personId·personName */}
            <Cell label="사용자" width={330}><LookupInput width={150} value={draft.personNm ?? ''} onOpen={() => setPersonOpen(true)} /></Cell>
            <div style={{ width: 20 }} />
            <Cell label="업무용  사용거리" width={330} unit>{km(businessMileage, true)}</Cell>
          </Row>
          <Row>
            <div style={{ width: 350 }} />
            <Cell label="(출퇴근용)" width={330} unit>{km(draft.commuteMileage, false, v => setKm('commuteMileage', v))}</Cell>
          </Row>
          <Row>
            <div style={{ width: 350 }} />
            <Cell label="(일반업무용)" width={330} unit>{km(draft.bizMileage, false, v => setKm('bizMileage', v))}</Cell>
          </Row>
          <Row>
            <Cell label="주행거리" width={330} unit>{km(mileage, true)}</Cell>
            <div style={{ width: 20 }} />
            <Cell label="비업무용 사용거리" width={330} unit>{km(draft.unBizMileage, false, v => setKm('unBizMileage', v))}</Cell>
          </Row>
          <Row><Cell label="행선지" width={680}><Input maxLength={100} value={draft.destination ?? ''} onChange={e => set({ destination: e.target.value })} /></Cell></Row>
          <Row><Cell label="목적" width={680}><Input maxLength={200} value={draft.reason ?? ''} onChange={e => set({ reason: e.target.value })} /></Cell></Row>
          <Row><Cell label="참석자" width={680}><Input maxLength={100} value={draft.attendance ?? ''} onChange={e => set({ attendance: e.target.value })} /></Cell></Row>
        </div>
      </Modal>
      <Emp00_Lookup_SelectSingle
        open={personOpen}
        noneLabel={null}
        transDate={dayjs().format(FORMAT)}
        onResult={r => {
          setPersonOpen(false);
          if (r) set({ personId: r.personId, personNm: r.korNm ?? null });
        }}
        onClose={() => setPersonOpen(false)}
      />
    </>
  );
};
