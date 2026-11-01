/**
 * 외출 반복등록 창 (Y04) — Emp54_Tab_Errand의 [반복등록]에서 연다
 * AS-IS: myApp/client/vi/emp/Emp54_Edit_Errand.java (575줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L121-138: 모달 530×630 "반복등록", getEditor() L213-309: 라벨 폭 90, 외출일자 · 구분 · 외출시간 ~ · 사유 · 장소 · 주최자 · 반복주기(숫자 + 콤보) ·
 *   반복종료일 + 휴일제외 · 주기(주) 월~금 라디오 · 주기(월) 라디오 3개, 아래 가운데 [저장][닫기]. EditModal 규격(11 §4a).
 */
import React, { useEffect, useMemo, useState } from 'react';
import { DatePicker, Checkbox, Input, InputNumber, message, Modal, Radio, Select, Space, Typography } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { empMyErrandApi } from '@/api/emp';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { Code } from '@/types/sys';
import { Button } from '@/components/button';

const FORMAT = 'YYYY-MM-DD';
const WEEKDAYS = ['월', '화', '수', '목', '금'];           // radio01_01~05 → cycleOption 2~6
const KOR_DAY = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];

interface Props {
  open: boolean;
  /** insert(callback) L97-110: 저장하면 callback.execute() 뒤 hide() */
  onDone: () => void;
  onClose: () => void;
}

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
    <Typography.Text style={{ width: 90, flex: 'none', lineHeight: '32px', textAlign: 'right', paddingRight: 10 }}>{label}</Typography.Text>
    <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
  </div>
);

const n = (s: string) => (s === '' ? null : s);

export const Emp54_Edit_Errand: React.FC<Props> = ({ open, onDone, onClose }) => {
  const [errandCodes, setErrandCodes] = useState<Code[]>([]);
  const [cycleCodes, setCycleCodes] = useState<Code[]>([]);
  const [date, setDate] = useState<Dayjs | null>(null);
  const [errandCode, setErrandCode] = useState<string | null>(null);
  const [departTime, setDepartTime] = useState('');
  const [returnTime, setReturnTime] = useState('');
  const [reason, setReason] = useState('');
  const [venue, setVenue] = useState('');
  const [host, setHost] = useState('');
  const [cycleNum, setCycleNum] = useState<number | null>(1);
  const [cycleName, setCycleName] = useState('none');
  const [cycleDate, setCycleDate] = useState<Dayjs | null>(null);
  const [holidayYn, setHolidayYn] = useState(false);
  const [weekOpt, setWeekOpt] = useState<number | null>(null);    // radio01: 2~6
  const [monthOpt, setMonthOpt] = useState<number | null>(null);  // radio02: 1~3
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    sysApi.searchCodes('ErrandCode').then(setErrandCodes).catch(() => {});
    sysApi.searchCodes('SimpleCycleCode').then(setCycleCodes).catch(() => {});
  }, []);

  // [E0] 화면 열림 (생성자 L121-138) → settings(), getEditor()
  // insert() L97-110 + init() L112-119: 일자 = 오늘, 반복 없음, 반복주기 1
  useEffect(() => {
    if (!open) return;
    setDate(dayjs()); setErrandCode(null); setDepartTime(''); setReturnTime(''); setReason(''); setVenue(''); setHost('');
    setCycleNum(1); setCycleName('none'); setCycleDate(null); setHolidayYn(false); setWeekOpt(null); setMonthOpt(null);
  }, [open]);

  const isNone = cycleName === 'none';
  const weekOn = cycleName === 'W';
  const monthOn = cycleName === 'M';

  // [E3] cycleName[SimpleCycleCode].Collapse (L164) → setDeafaults(), setMonthLabels()
  const onCycleChange = (code: string) => { setCycleName(code); setWeekOpt(null); setMonthOpt(null); };

  // setMonthLabels() L515-558 — 월 XX일 / 월 N번째 X요일 / 월 마지막주 X요일 (마지막주는 선택일 +7일이 오늘이 속한 달이 아닐 때만)
  const labels = useMemo(() => {
    if (!date) return { l1: '월 XX일', l2: '월 X번째 X요일', l3: '월 마지막주 X요일', last: false };
    const week = Math.floor((date.date() - 1) / 7) + 1;
    const dow = KOR_DAY[date.day()];
    const next = date.add(7, 'day');
    const now = dayjs();
    const last = next.month() !== now.month() || next.year() !== now.year();
    return { l1: `월 ${date.format('DD')}일`, l2: `월 ${week}번째 ${dow}`, l3: last ? `월 마지막주 ${dow}` : '월 마지막주 X요일', last };
  }, [date]);
  const lastEnabled = monthOn && labels.last;
  useEffect(() => { if (!lastEnabled && monthOpt === 3) setMonthOpt(null); }, [lastEnabled, monthOpt]);

  // [E4] updateButton[저장].Select (L199) → update() L311-409
  const update = async () => {
    if (!date) return void message.warning('외출일자는 필수입력 항목입니다');
    if (!errandCode) return void message.warning('구분은 필수선택 항목입니다');
    let cycleOption = 9999;
    if (!isNone) {
      if (cycleNum == null || !cycleDate) return void message.warning('반복조건값이 비어있습니다');
      if ((weekOn && weekOpt == null) || (monthOn && monthOpt == null)) return void message.warning('반복주기 선택을 해주세요');
      if (weekOn) cycleOption = weekOpt!;
      else if (monthOn) cycleOption = monthOpt!;
    }
    setSaving(true);
    try {
      await empMyErrandApi.createCycle({
        errandCode, date: date.format(FORMAT), departTime: n(departTime), returnTime: n(returnTime), reason: n(reason), venue: n(venue), host: n(host),
        cycleName, cycleNum: isNone ? null : cycleNum, cycleDate: isNone ? null : cycleDate!.format(FORMAT), holidayYn, cycleOption: isNone ? null : cycleOption,
      });
      if (!isNone) {
        Modal.info({ title: '확인', content: '반복등록은 등록시간이 몇초 소요될수있습니다', okText: '확인', onOk: () => { onDone(); onClose(); } });
      } else {
        onDone(); onClose();
      }
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  const box: React.CSSProperties = { border: '1px solid #d9d9d9', padding: '4px 8px', opacity: 1 };
  return (
    <Modal
      open={open}
      title="반복등록"
      width={560}
      maskClosable={false}
      onCancel={onClose}
      styles={{
        header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 0 },
        footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 0 },
      }}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={update} loading={saving}>저장</Button>
            {/* [E5] closeButton[닫기].Select (L205) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '12px 2px' }}>
        {/* [E1] date[외출일자].ValueChange (L152) → setMonthLabels() */}
        <Field label="외출일자"><DatePicker style={{ width: 210 }} allowClear={false} value={date} format={FORMAT} onChange={d => setDate(d)} /></Field>
        {/* [E2] errandName[구분].Collapse (L158) → errandCode */}
        <Field label="구분">
          <Select style={{ width: 210 }} value={errandCode} options={errandCodes.map(c => ({ value: c.code, label: c.name }))} onChange={setErrandCode} />
        </Field>
        <Field label="외출시간">
          <Space size={6}>
            <Input style={{ width: 120 }} value={departTime} onChange={e => setDepartTime(e.target.value)} />~
            <Input style={{ width: 120 }} value={returnTime} onChange={e => setReturnTime(e.target.value)} />
          </Space>
        </Field>
        <Field label="사유"><Input value={reason} onChange={e => setReason(e.target.value)} /></Field>
        <Field label="장소"><Input value={venue} onChange={e => setVenue(e.target.value)} /></Field>
        <Field label="주최자"><Input value={host} onChange={e => setHost(e.target.value)} /></Field>
        <Field label="반복주기">
          <Space>
            <InputNumber style={{ width: 120 }} precision={0} disabled={isNone} value={cycleNum} onChange={v => setCycleNum(v == null ? null : Number(v))} />
            <Select style={{ width: 100 }} value={cycleName} onChange={onCycleChange}
              options={[{ value: 'none', label: '없음' }, ...cycleCodes.map(c => ({ value: c.code, label: c.name }))]} />
          </Space>
        </Field>
        <Field label="반복종료일">
          <Space>
            <DatePicker style={{ width: 210 }} disabled={isNone} value={cycleDate} format={FORMAT} onChange={d => setCycleDate(d)} />
            <Checkbox disabled={isNone} checked={holidayYn} onChange={e => setHolidayYn(e.target.checked)}>휴일제외</Checkbox>
          </Space>
        </Field>
        <Field label="주기(주)">
          <div style={box}>
            <Radio.Group disabled={!weekOn} value={weekOpt} onChange={e => setWeekOpt(e.target.value)} style={{ display: 'flex', justifyContent: 'space-around' }}>
              {WEEKDAYS.map((w, i) => <Radio key={w} value={i + 2}>{w}</Radio>)}
            </Radio.Group>
          </div>
        </Field>
        <Field label="주기(월)">
          <div style={box}>
            <Radio.Group disabled={!monthOn} value={monthOpt} onChange={e => setMonthOpt(e.target.value)} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <Radio value={1}>{labels.l1}</Radio>
              <Radio value={2}>{labels.l2}</Radio>
              <Radio value={3} disabled={!lastEnabled}>{labels.l3}</Radio>
            </Radio.Group>
          </div>
        </Field>
      </div>
    </Modal>
  );
};
