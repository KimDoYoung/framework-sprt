/**
 * 공용차량 운행일지 등록창 (T15) — Car04_Tab_PublicJournalAdmin의 [등록]이 연다 (예약과 운행일지를 함께 만든다)
 * AS-IS: myApp/client/vi/car/Car04_Lookup_PublicJournalAdmin.java (475줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L90-107: 모달 780×480 "공용차량 운행일지", 아래 가운데 [저장][닫기]. getEditor() L214-282: 라벨 폭 140, 줄 = 일시(시작일 ~ 종료일 시:분 ~ 시:분) / 사용자·업무용 사용거리(읽기 전용) / (출퇴근용) / (일반업무용) / 주행거리(읽기 전용)·비업무용 사용거리 / 행선지 / 목적 / 참석자
 * EditModal 규격(11 §4a). 저장은 이 창이 한다(updateChk() L333-397 → update() L399-466)
 */
import React, { useEffect, useState } from 'react';
import { DatePicker, Input, InputNumber, message, Modal, Space } from 'antd';
import dayjs from 'dayjs';
import { carApi } from '@/api/car';
import { errorMessage } from '@/api/client';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Emp00_Lookup_SelectSingle } from '@/components/lookup/Emp00_Lookup_SelectSingle';

const FORMAT = 'YYYY-MM-DD';
/** NumberFormat "###,###,###" */
const fmtLong = (v: string | number | undefined) => (v == null || v === '' ? '' : `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','));
const parseNum = (v: string | undefined) => (v ?? '').replace(/,/g, '');
const num = (v: number | null | undefined) => v ?? 0;

/** 칸 하나: 라벨(폭 140) + 입력 + 뒤 글자(km) */
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

interface Draft {
  personId: number | null;
  personName: string;
  startDate: string;
  closeDate: string;
  startHour: string | null;
  startMin: string | null;
  closeHour: string | null;
  closeMin: string | null;
  commuteMileage: number | null;
  bizMileage: number | null;
  unBizMileage: number | null;
  destination: string;
  reason: string;
  attendance: string;
}

interface Props {
  /** insert(infoId, callBack): 차량 ID가 있으면 열림 */
  infoId: number | null;
  /** callBack.execute() — 저장이 끝나면 */
  onDone: () => void;
  onClose: () => void;
}

export const Car04_Lookup_PublicJournalAdmin: React.FC<Props> = ({ infoId, onDone, onClose }) => {
  const [draft, setDraft] = useState<Draft>({} as Draft);
  const [personOpen, setPersonOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // insert() L76-88: 시작일·종료일 오늘, 08:00 ~ 12:00
  useEffect(() => {
    if (infoId == null) return;
    const today = dayjs().format(FORMAT);
    setDraft({ personId: null, personName: '', startDate: today, closeDate: today, startHour: '08', startMin: '00', closeHour: '12', closeMin: '00',
      commuteMileage: null, bizMileage: null, unBizMileage: null, destination: '', reason: '', attendance: '' });
  }, [infoId]);

  const set = (patch: Partial<Draft>) => setDraft(prev => ({ ...prev, ...patch }));
  // calculation() L284-323: 업무용 = 출퇴근 + 일반업무, 주행거리 = 업무용 + 비업무
  const businessMileage = num(draft.commuteMileage) + num(draft.bizMileage);
  const mileage = businessMileage + num(draft.unBizMileage);

  // updateChk() L333-397 → update() L399-466: 필수 검사 → getSeq → updateAdmin(종료일 = 시작일) / updateListAdmin
  const updateChk = async () => {
    if (!draft.personName) { message.warning('사용자는 필수입력 항목입니다'); return; }
    if (mileage === 0) { message.warning('주행거리는 필수입력 항목입니다'); return; }
    if (!draft.destination) { message.warning('행선지는 필수입력 항목입니다'); return; }
    if (!draft.reason) { message.warning('목적은 필수입력 항목입니다'); return; }
    if (!draft.startHour) { message.warning('시작시를 입력해주세요'); return; }
    if (!draft.startMin) { message.warning('시작분을 입력해주세요'); return; }
    if (!draft.closeHour) { message.warning('종료시를 입력해주세요'); return; }
    if (!draft.closeMin) { message.warning('종료분을 입력해주세요'); return; }
    // 원본 그대로: 시가 같거나 시작시가 크면 분을 비교한다(L360-365)
    if (+draft.startHour >= +draft.closeHour && +draft.startMin >= +draft.closeMin) { message.warning('종료시간을 다시 설정해주세요.'); return; }
    if (dayjs(draft.closeDate).isBefore(dayjs(draft.startDate))) { message.warning('예약종료일자를 다시 선택해주세요'); return; }
    setSaving(true);
    try {
      await carApi.createAdminBooking({
        infoId: infoId as number, personId: draft.personId as number, startDate: draft.startDate, closeDate: draft.closeDate,
        startHour: draft.startHour, startMin: draft.startMin as string, closeHour: draft.closeHour, closeMin: draft.closeMin,
        destination: draft.destination, reason: draft.reason, attendance: draft.attendance,
        mileage, commuteMileage: draft.commuteMileage, bizMileage: draft.bizMileage, unBizMileage: draft.unBizMileage,
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
        open={infoId != null}
        title="공용차량 운행일지"
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
              {/* [E2] updateButton[저장].Select (L135) → updateChk() */}
              <Button type="save" loading={saving} onClick={updateChk}>저장</Button>
              {/* [E3] closeButton[닫기].Select (L141) → hide() */}
              <Button type="close" onClick={onClose}>닫기</Button>
            </Space>
          </div>
        }
      >
        {/* [E0] 화면 열림 (생성자 L90-107) → settings(), show() */}
        <div style={{ padding: '12px 2px 0' }}>
          <Row>
            <Cell label="일 시" width={680}>
              <Space size={4}>
                <DatePicker style={{ width: 110 }} format={FORMAT} allowClear={false} value={draft.startDate ? dayjs(draft.startDate) : null} onChange={(_, s) => set({ startDate: s as string })} />
                <span>~</span>
                <DatePicker style={{ width: 110 }} format={FORMAT} allowClear={false} value={draft.closeDate ? dayjs(draft.closeDate) : null} onChange={(_, s) => set({ closeDate: s as string })} />
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
            {/* [E1] personName[사용자].TriggerClick (L119) → Emp00_Lookup_SelectSingle.open(오늘) → personId·personName */}
            <Cell label="사용자" width={330}><LookupInput width={150} value={draft.personName} onOpen={() => setPersonOpen(true)} /></Cell>
            <div style={{ width: 20 }} />
            <Cell label="업무용  사용거리" width={330} unit>{km(businessMileage, true)}</Cell>
          </Row>
          <Row>
            <div style={{ width: 350 }} />
            {/* [E4] commuteMileage.KeyUp (L194) → calculation() */}
            <Cell label="(출퇴근용)" width={330} unit>{km(draft.commuteMileage, false, v => set({ commuteMileage: v }))}</Cell>
          </Row>
          <Row>
            <div style={{ width: 350 }} />
            {/* [E5] bizMileage.KeyUp (L200) → calculation() */}
            <Cell label="(일반업무용)" width={330} unit>{km(draft.bizMileage, false, v => set({ bizMileage: v }))}</Cell>
          </Row>
          <Row>
            <Cell label="주행거리" width={330} unit>{km(mileage, true)}</Cell>
            <div style={{ width: 20 }} />
            {/* [E6] unBizMileage[비업무용 사용거리].KeyUp (L206) → calculation() */}
            <Cell label="비업무용 사용거리" width={330} unit>{km(draft.unBizMileage, false, v => set({ unBizMileage: v }))}</Cell>
          </Row>
          <Row><Cell label="행선지" width={680}><Input maxLength={100} value={draft.destination} onChange={e => set({ destination: e.target.value })} /></Cell></Row>
          <Row><Cell label="목적" width={680}><Input maxLength={200} value={draft.reason} onChange={e => set({ reason: e.target.value })} /></Cell></Row>
          <Row><Cell label="참석자" width={680}><Input maxLength={100} value={draft.attendance} onChange={e => set({ attendance: e.target.value })} /></Cell></Row>
        </div>
      </Modal>
      <Emp00_Lookup_SelectSingle
        open={personOpen}
        noneLabel={null}
        transDate={dayjs().format(FORMAT)}
        onResult={r => {
          setPersonOpen(false);
          if (r) set({ personId: r.personId, personName: r.korNm ?? '' });
        }}
        onClose={() => setPersonOpen(false)}
      />
    </>
  );
};
