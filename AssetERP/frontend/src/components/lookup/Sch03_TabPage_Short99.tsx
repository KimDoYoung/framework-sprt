/**
 * 수시 탭 (E01-1) — Sch03_Lookup_Short의 본문
 * AS-IS: myApp/client/vi/sch/Sch03_TabPage_Short99.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 getEditor() L107-165: 세 줄 — ① 라디오(10) "즉시" ② 라디오(01) + 일자 ③ 라디오(02) + 숫자 + 기간(PeriodCode) + 영업일 구분(HolidaySettleCode).
 *   scheduleCode가 "1"(스케줄)이면 ②만 보인다. 라디오로 한 줄만 켠다(activeCode10/01/02)
 */
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import { BarRow, CodeCombo, NumField, RadioDot, Sch03TabHandle, Sch03TabProps, modelFor, useCodeNames } from './sch03CycleParts';

type Calc = '10' | '01' | '02';

export const Sch03_TabPage_Short99 = forwardRef<Sch03TabHandle, Sch03TabProps & { scheduleCode: string }>(({ model, scheduleCode }, ref) => {
  // setModel(gridModel) L188-201: 계산구분이 "10"이면 ①, "01"이면 ②, 그 밖이면 ③. 새 기한(생성자 L67-71)은 scheduleCode "1"이면 ②, 아니면 ①
  const m = modelFor(model, '99');
  const [calc, setCalc] = useState<Calc>(m ? (m.cycleCalcType === '10' ? '10' : m.cycleCalcType === '01' ? '01' : '02') : scheduleCode === '1' ? '01' : '10');
  const [fixDate, setFixDate] = useState(m?.fixDate ?? null);
  const [num1, setNum1] = useState<number | null>(m?.num1 ?? null);
  const [periodCode, setPeriodCode] = useState(m?.periodCode ?? undefined);
  const [holidayCode, setHolidayCode] = useState(m?.holidayCode ?? undefined);
  const period = useCodeNames();
  const holiday = useCodeNames();

  // [E0] 화면 열림 (생성자 L57-72) → Settings(), getEditor(), activeCode01(), activeCode10()
  // [E1] toggleGroup.ValueChange (L91) → activeCode10() / activeCode01() / activeCode02(): 라디오로 줄을 바꾼다
  // [E2] periodName[PeriodCode].Collapse (L122) → periodCode.setValue(code) — 값 연결로 대신
  // [E3] holidayName01[HolidaySettleCode].Collapse (L128) → holidayCode01.setValue(code) — 값 연결로 대신
  // getModel() L167-186: 주기 "99", 켜진 줄의 계산구분과 값
  useImperativeHandle(ref, () => ({
    getModel: () => calc === '10'
      ? { cycleCode: '99', cycleCalcType: '10' }
      : calc === '01'
        ? { cycleCode: '99', cycleCalcType: '01', fixDate }
        : { cycleCode: '99', cycleCalcType: '02', num1, periodCode: periodCode ?? null, holidayCode: holidayCode ?? null },
  }), [calc, fixDate, num1, periodCode, holidayCode]);

  return (
    <div style={{ padding: '15px 10px 10px 30px', display: 'flex', flexDirection: 'column', gap: 5 }}>
      {scheduleCode !== '1' && (
        <BarRow enabled={calc === '10'}>
          <RadioDot checked={calc === '10'} onChange={() => setCalc('10')} />
          <span>즉시</span>
        </BarRow>
      )}
      <BarRow enabled={calc === '01'}>
        <RadioDot checked={calc === '01'} onChange={() => setCalc('01')} />
        <DatePicker style={{ width: 140 }} disabled={calc !== '01'} format="YYYY-MM-DD" value={fixDate ? dayjs(fixDate) : null}
          onChange={d => setFixDate(d ? d.format('YYYY-MM-DD') : null)} />
      </BarRow>
      {scheduleCode !== '1' && (
        <BarRow enabled={calc === '02'}>
          <RadioDot checked={calc === '02'} onChange={() => setCalc('02')} />
          <NumField value={num1} disabled={calc !== '02'} onChange={setNum1} />
          <CodeCombo kindCd="PeriodCode" value={periodCode} disabled={calc !== '02'} onChange={setPeriodCode} onLoad={period.onLoad} />
          <CodeCombo kindCd="HolidaySettleCode" value={holidayCode} disabled={calc !== '02'} onChange={setHolidayCode} onLoad={holiday.onLoad} />
        </BarRow>
      )}
    </div>
  );
});
Sch03_TabPage_Short99.displayName = 'Sch03_TabPage_Short99';
