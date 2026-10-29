/**
 * 공용차량 예약정보 팝업 (T13) — Car03_Tab_DayofMonth([예약하기]·상세보기)와 Car03_Tab_List(상세보기)가 연다
 * AS-IS: myApp/client/vi/car/Car03_Popup_BookingReg.java (405줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L85-146: 모달 880×610 "공용차량 예약정보", 줄 = 차량·사용자 / 일시(시작일 ~ 종료일 시:분 ~ 시:분) / 행선지 / 목적 / 참석자 / 메모(높이 85) + 시간막대 300, 아래 가운데 [저장][변경][닫기]
 * 열기 3가지: open(date) L233-262 [저장]만 / retrieve(model, checkYn) L277-285 [저장]은 checkYn일 때 / getList(model, checkYn) L287-295 [변경]은 checkYn일 때
 * EditModal 규격(11 §4a). 저장은 이 창이 한다(update() L297-375)
 */
import React, { useEffect, useRef, useState } from 'react';
import { DatePicker, Input, message, Modal, Space } from 'antd';
import dayjs from 'dayjs';
import { carApi } from '@/api/car';
import { errorMessage } from '@/api/client';
import { CarBooking, CarBookingTimeline } from '@/types/car';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Car01_Lookup_Info } from '@/components/lookup/Car01_Lookup_Info';
import { Emp00_Lookup_SelectSingle } from '@/components/lookup/Emp00_Lookup_SelectSingle';
import { useLoginUser } from '@/hooks/useLoginUser';
import { Car03_TimelineChart } from './Car03_TimelineChart';

const FORMAT = 'YYYY-MM-DD';

export type BookingRegTarget =
  /** open(startDate, cb): 새 예약 (로그인 사원, 08:00 ~ 12:00) */
  | { mode: 'open'; date: string }
  /** retrieve(model, checkYn): 날짜별 그리드의 상세보기 — [저장]은 checkYn(관리자·예약자·등록자)일 때만 */
  | { mode: 'retrieve'; row: CarBooking; checkYn: boolean }
  /** getList(model, checkYn): 예약현황 그리드의 상세보기 — [변경]은 checkYn일 때만 */
  | { mode: 'list'; row: CarBooking; checkYn: boolean };

interface Props {
  target: BookingRegTarget | null;
  /** callback.execute() — 저장이 끝나면(창을 닫기 전) */
  onSaved: () => void;
  onClose: () => void;
}

const Field: React.FC<{ label: string; children: React.ReactNode; top?: boolean }> = ({ label, children, top }) => (
  <div style={{ display: 'flex', alignItems: top ? 'flex-start' : 'center', gap: 0 }}>
    <label style={{ width: 80, flexShrink: 0, textAlign: 'right', paddingRight: 10, paddingTop: top ? 4 : 0 }}>{label}</label>
    <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 4 }}>{children}</div>
  </div>
);

export const Car03_Popup_BookingReg: React.FC<Props> = ({ target, onSaved, onClose }) => {
  const user = useLoginUser();
  const [draft, setDraft] = useState<CarBooking>({});
  const [timeline, setTimeline] = useState<CarBookingTimeline[]>([]);
  const [infoOpen, setInfoOpen] = useState(false);
  const [personOpen, setPersonOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const timelineSeq = useRef(0);

  // retrieveTimeChart() L215-231: 시작일 기준 car.Car03_Booking.selectByDateUnion → 차트를 다시 그린다
  const retrieveTimeChart = async (date: string | null | undefined) => {
    if (!date) return;
    const my = ++timelineSeq.current;
    try {
      const list = await carApi.searchBookingTimeline(date);
      if (my === timelineSeq.current) setTimeline(list);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E0] 화면 열림 (생성자 L85-146) → settings() — 열릴 때마다 모델을 새로 만든다
  useEffect(() => {
    if (!target) return;
    setTimeline([]);
    if (target.mode === 'open') {
      setDraft({
        personId: user.userId, personNm: user.name, startDate: target.date, closeDate: target.date,
        startHour: '08', startMin: '00', closeHour: '12', closeMin: '00', parentId: 0, regEmpId: user.userId,
      });
      void retrieveTimeChart(target.date);
    } else {
      setDraft({ ...target.row });
      void retrieveTimeChart(target.row.startDate);
    }
  }, [target]);  // eslint-disable-line react-hooks/exhaustive-deps

  const set = (patch: Partial<CarBooking>) => setDraft(prev => ({ ...prev, ...patch }));

  /** update() L297-375: 필수 검사 → car.Car03_Booking.update(종료일 = 시작일) / updateList(다르면) → 겹침이면 서버 메시지, 아니면 callback + hide() */
  const update = async (changeUpdate: boolean) => {
    if (!draft.infoNm) { message.warning('차량을 선택해주세요'); return; }
    if (!draft.personNm) { message.warning('사용자를 선택해주세요'); return; }
    if (!draft.startHour) { message.warning('시작시를 입력해주세요'); return; }
    if (!draft.startMin) { message.warning('시작분을 입력해주세요'); return; }
    if (!draft.closeHour) { message.warning('종료시를 입력해주세요'); return; }
    if (!draft.closeMin) { message.warning('종료분을 입력해주세요'); return; }
    // 원본 그대로: 시가 같거나 시작시가 크면 분을 비교한다(L337-342)
    if (+draft.startHour >= +draft.closeHour && +draft.startMin >= +draft.closeMin) { message.warning('종료시간을 다시 설정해주세요.'); return; }
    if (draft.closeDate && draft.startDate && dayjs(draft.closeDate).isBefore(dayjs(draft.startDate))) { message.warning('예약종료일자를 다시 선택해주세요'); return; }
    setSaving(true);
    try {
      await carApi.saveBooking({ ...draft, closeDate: draft.closeDate ?? draft.startDate }, changeUpdate);
      onSaved();
      onClose();
    } catch (err) {
      message.warning(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  // [E3] changeButton[변경].Select (L176) → changeCheck() L377-396: 확인창 → [E6] 예 → update()
  const changeCheck = () => {
    Modal.confirm({
      title: '확인',
      content: '이미 생성된 공용차량 예약정보는 삭제됩니다. 진행하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      width: 400,
      onOk: () => update(true),
    });
  };

  const saveVisible = target?.mode === 'open' || (target?.mode === 'retrieve' && target.checkYn);
  const changeVisible = target?.mode === 'list' && target.checkYn;

  return (
    <>
      <Modal
        open={target != null}
        title="공용차량 예약정보"
        width={880}
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
              {/* [E1] updateButton[저장].Select (L163) → changeUpdateYn=false, update() */}
              {saveVisible && <Button type="save" loading={saving} onClick={() => update(false)}>저장</Button>}
              {changeVisible && <Button type="change" onClick={changeCheck}>변경</Button>}
              {/* [E2] closeButton[닫기].Select (L170) → hide() */}
              <Button type="close" onClick={onClose}>닫기</Button>
            </Space>
          </div>
        }
      >
        <div style={{ padding: '12px 2px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', gap: 10 }}>
            {/* [E4] infoName[차 량].TriggerClick (L184) → Car01_Lookup_Info.openAdmin("2") → infoId·infoName */}
            <Field label="차 량">
              <LookupInput width={230} value={draft.infoNm ?? ''} onOpen={() => setInfoOpen(true)} />
            </Field>
            {/* [E5] personName[사용자].TriggerClick (L199) → Emp00_Lookup_SelectSingle.open(오늘) → personId·personName */}
            <Field label="사용자">
              <LookupInput width={100} value={draft.personNm ?? ''} onOpen={() => setPersonOpen(true)} />
            </Field>
          </div>
          <Field label="일  시">
            {/* startDate 변경 시 시간막대는 다시 그리지 않는다(AS-IS는 열 때만 retrieveTimeChart) */}
            <DatePicker style={{ width: 110 }} format={FORMAT} allowClear={false} value={draft.startDate ? dayjs(draft.startDate) : null}
              onChange={(_, s) => set({ startDate: (s as string) || null })} />
            <span> ~ </span>
            <DatePicker style={{ width: 110 }} format={FORMAT} allowClear={false} value={draft.closeDate ? dayjs(draft.closeDate) : null}
              onChange={(_, s) => set({ closeDate: (s as string) || null })} />
            <span style={{ width: 6 }} />
            <SystemCodeComboBox kindCd="HourCode" style={{ width: 62 }} value={draft.startHour ?? undefined} onChange={c => set({ startHour: c ?? null })} />
            <SystemCodeComboBox kindCd="MinuteCode" style={{ width: 62 }} value={draft.startMin ?? undefined} onChange={c => set({ startMin: c ?? null })} />
            <span> ~ </span>
            <SystemCodeComboBox kindCd="HourCode" style={{ width: 62 }} value={draft.closeHour ?? undefined} onChange={c => set({ closeHour: c ?? null })} />
            <SystemCodeComboBox kindCd="MinuteCode" style={{ width: 62 }} value={draft.closeMin ?? undefined} onChange={c => set({ closeMin: c ?? null })} />
          </Field>
          <Field label="행선지"><Input maxLength={100} value={draft.destination ?? ''} onChange={e => set({ destination: e.target.value })} /></Field>
          <Field label="목 적"><Input maxLength={200} value={draft.reason ?? ''} onChange={e => set({ reason: e.target.value })} /></Field>
          <Field label="참석자"><Input maxLength={100} value={draft.attendance ?? ''} onChange={e => set({ attendance: e.target.value })} /></Field>
          <Field label="메 모" top>
            <Input.TextArea style={{ height: 85, resize: 'none' }} maxLength={200} value={draft.note ?? ''} onChange={e => set({ note: e.target.value })} />
          </Field>
          <div style={{ height: 300, margin: '10px 20px 0 20px' }}>
            <Car03_TimelineChart rows={timeline} />
          </div>
        </div>
      </Modal>
      <Car01_Lookup_Info
        open={infoOpen}
        carType="2"
        admin
        allButton
        onResult={r => {
          setInfoOpen(false);
          if (r) set({ infoId: r.infoId, infoNm: r.carNm });  // 전체(null)는 원본이 모델 null을 읽어 오류 — 무시
        }}
        onClose={() => setInfoOpen(false)}
      />
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
