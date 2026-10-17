/**
 * 반복주기 "월" 탭 (E01-1) — Sch03_Lookup_Cycle의 셋째 탭
 * AS-IS: myApp/client/vi/sch/Sch03_TabPage_Cycle03.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 getEditor() L128-196: 두 줄 — ① 라디오(05) + 일(DayCode) + 직접입력 숫자 + 일 구분(DsCode) + 영업일 구분
 *   ② 라디오(06) + 주(WeekOfMonth) + 요일(DayOfWeekCode) + 영업일 구분. 라디오로 한 줄만 켠다(activeCode05/06)
 */
import { forwardRef, useImperativeHandle, useState } from 'react';
import { BarRow, CodeCombo, NumField, RadioDot, Sch03TabHandle, Sch03TabProps, modelFor, useCodeNames } from './sch03CycleParts';

export const Sch03_TabPage_Cycle03 = forwardRef<Sch03TabHandle, Sch03TabProps>(({ model }, ref) => {
  // setModel(gridModel) L219-236: 계산구분 "05"면 첫 줄, "06"이면 둘째 줄을 켜고, 값은 모델에서 두 줄 모두에 채운다(AS-IS editDriver.edit)
  const m = modelFor(model, '03');
  const [calc, setCalc] = useState<'05' | '06'>(m?.cycleCalcType === '06' ? '06' : '05');
  const [dayCode, setDayCode] = useState(m?.dayCode ?? undefined);
  const [num1, setNum1] = useState<number | null>(m?.num1 ?? null);
  const [dayTypeCode, setDayTypeCode] = useState(m?.dayTypeCode ?? undefined);
  const [holidayCode01, setHolidayCode01] = useState(m?.holidayCode ?? undefined);
  const [weekCode, setWeekCode] = useState(m?.weekCode ?? undefined);
  const [dayWeekCode, setDayWeekCode] = useState(m?.dayWeekCode ?? undefined);
  const [holidayCode02, setHolidayCode02] = useState(m?.holidayCode ?? undefined);
  const day = useCodeNames();
  const dayType = useCodeNames();
  const week = useCodeNames();
  const dayWeek = useCodeNames();
  const holiday01 = useCodeNames();
  const holiday02 = useCodeNames();

  // [E1] dayName01[DayCode].Collapse (L102) → 일이 "직접입력"이면 숫자 칸을 켜고 아니면 끄고 비운다
  const onDayChange = (code?: string, name?: string) => {
    setDayCode(code);
    if ('직접입력' !== name) setNum1(null);
  };
  const num1Enabled = calc === '05' && '직접입력' === day.nameOf(dayCode);

  // [E0] 화면 열림 (생성자 L56-64) → Settings(), getEditor(), activeCode05()
  // [E2] toggleGroup.ValueChange (L114) → activeCode05() / activeCode06(): 라디오로 줄을 바꾼다
  // getModel() L198-217: 주기 "03", 켜진 줄의 계산구분과 값
  useImperativeHandle(ref, () => ({
    getModel: () => calc === '05'
      ? { cycleCode: '03', cycleCalcType: '05', dayCode: dayCode ?? null, num1, dayTypeCode: dayTypeCode ?? null, holidayCode: holidayCode01 ?? null }
      : { cycleCode: '03', cycleCalcType: '06', weekCode: weekCode ?? null, dayWeekCode: dayWeekCode ?? null, holidayCode: holidayCode02 ?? null },
  }), [calc, dayCode, num1, dayTypeCode, holidayCode01, weekCode, dayWeekCode, holidayCode02]);

  return (
    <div style={{ padding: '25px 10px 10px 20px', display: 'flex', flexDirection: 'column', gap: 18 }}>
      <BarRow enabled={calc === '05'}>
        <RadioDot checked={calc === '05'} onChange={() => setCalc('05')} />
        <CodeCombo kindCd="DayCode" value={dayCode} disabled={calc !== '05'} onChange={onDayChange} onLoad={day.onLoad} />
        <NumField value={num1} disabled={!num1Enabled} onChange={setNum1} />
        <CodeCombo kindCd="DsCode" value={dayTypeCode} disabled={calc !== '05'} onChange={setDayTypeCode} onLoad={dayType.onLoad} />
        <CodeCombo kindCd="HolidaySettleCode" value={holidayCode01} disabled={calc !== '05'} onChange={setHolidayCode01} onLoad={holiday01.onLoad} />
      </BarRow>
      <BarRow enabled={calc === '06'}>
        <RadioDot checked={calc === '06'} onChange={() => setCalc('06')} />
        <CodeCombo kindCd="WeekOfMonth" value={weekCode} disabled={calc !== '06'} onChange={setWeekCode} onLoad={week.onLoad} />
        <CodeCombo kindCd="DayOfWeekCode" value={dayWeekCode} disabled={calc !== '06'} onChange={setDayWeekCode} onLoad={dayWeek.onLoad} />
        <CodeCombo kindCd="HolidaySettleCode" value={holidayCode02} disabled={calc !== '06'} onChange={setHolidayCode02} onLoad={holiday02.onLoad} />
      </BarRow>
    </div>
  );
});
Sch03_TabPage_Cycle03.displayName = 'Sch03_TabPage_Cycle03';
