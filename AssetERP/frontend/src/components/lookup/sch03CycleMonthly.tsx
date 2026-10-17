/**
 * 분기·반기·년 탭이 같이 쓰는 몸체 (E01-1) — AS-IS Sch03_TabPage_Cycle04·05·06은 거의 같은 파일이다.
 * 다른 점만 설정으로 받는다: 주기 코드(04·05·06)·"말일" 라디오의 계산구분(07·08·09)·글자("분기의 말일" …)·월 콤보의 코드 출처
 * (04·05는 코드그룹 MonthCode0001, 06은 종류코드 MonthCode)·월이 "직접입력"(06은 11번 줄에서 "결산일"도)이면 숫자 칸을 켜는 이름.
 * 세 줄: ① 라디오(말일) + 영업일 구분 ② 라디오(11) + 월 + 숫자 + 월 구분 + 일 + 숫자 + 일 구분 + 영업일 구분
 *   ③ 라디오(12) + 월 + 숫자 + 월 구분 + 주 + 요일 + 영업일 구분. 라디오로 한 줄만 켠다(activeCode07~09·11·12)
 */
import { forwardRef, useImperativeHandle, useState } from 'react';
import { Sch03Deadline } from '@/types/sch';
import { BarRow, CodeCombo, NumField, RadioDot, Sch03TabHandle, Sch03TabProps, modelFor, useCodeNames } from './sch03CycleParts';

export interface Sch03MonthlyConfig {
  cycleCode: '04' | '05' | '06';
  /** "말일" 라디오의 계산구분 */
  endType: '07' | '08' | '09';
  endLabel: string;
  /** 월 콤보의 코드 출처 */
  monthSource: { kindGroupCd: string } | { kindCd: string };
  /** 11번 줄 월 이름이 이것이면 숫자 칸(num1)을 켠다 */
  monthNumNames11: string[];
  /** 12번 줄 월 이름이 이것이면 숫자 칸(num1)을 켠다 */
  monthNumNames12: string[];
}

type Calc = 'end' | '11' | '12';

export const Sch03CycleMonthly = forwardRef<Sch03TabHandle, Sch03TabProps & { cfg: Sch03MonthlyConfig }>(({ model, cfg }, ref) => {
  // setModel(gridModel): 읽어 온 기한이 이 주기면 계산구분으로 줄을 고르고, 값은 모델에서 모든 줄에 채운다(AS-IS editDriver.edit — *01·*02 속성이 같은 값을 가리킨다)
  const m: Sch03Deadline | null = modelFor(model, cfg.cycleCode);
  const [calc, setCalc] = useState<Calc>(!m ? 'end' : m.cycleCalcType === cfg.endType ? 'end' : m.cycleCalcType === '11' ? '11' : '12');
  const [holidayEnd, setHolidayEnd] = useState(m?.holidayCode ?? undefined);
  // 11번 줄
  const [monthCode1, setMonthCode1] = useState(m?.monthCode ?? undefined);
  const [num101, setNum101] = useState<number | null>(m?.num1 ?? null);
  const [monthTypeCode1, setMonthTypeCode1] = useState(m?.monthTypeCode ?? undefined);
  const [dayCode1, setDayCode1] = useState(m?.dayCode ?? undefined);
  const [num201, setNum201] = useState<number | null>(m?.num2 ?? null);
  const [dayTypeCode1, setDayTypeCode1] = useState(m?.dayTypeCode ?? undefined);
  const [holiday1, setHoliday1] = useState(m?.holidayCode ?? undefined);
  // 12번 줄
  const [monthCode2, setMonthCode2] = useState(m?.monthCode ?? undefined);
  const [num102, setNum102] = useState<number | null>(m?.num1 ?? null);
  const [monthTypeCode2, setMonthTypeCode2] = useState(m?.monthTypeCode ?? undefined);
  const [weekCode2, setWeekCode2] = useState(m?.weekCode ?? undefined);
  const [dayWeekCode2, setDayWeekCode2] = useState(m?.dayWeekCode ?? undefined);
  const [holiday2, setHoliday2] = useState(m?.holidayCode ?? undefined);
  const holidayEndNames = useCodeNames();
  const month1 = useCodeNames();
  const monthType1 = useCodeNames();
  const day1 = useCodeNames();
  const dayType1 = useCodeNames();
  const holiday1Names = useCodeNames();
  const month2 = useCodeNames();
  const monthType2 = useCodeNames();
  const week2 = useCodeNames();
  const dayWeek2 = useCodeNames();
  const holiday2Names = useCodeNames();

  const isNum = (names: string[], name?: string) => name != null && names.includes(name);

  // dayName01.Collapse: "직접입력"이면 숫자 칸을 켜고 아니면 끄고 비운다. "-"이면 일 구분을 끄고 비운다
  const onDay1 = (code?: string, name?: string) => {
    setDayCode1(code);
    if (name !== '직접입력') setNum201(null);
    if (name === '-') setDayTypeCode1(undefined);
  };
  // monthName01.Collapse
  const onMonth1 = (code?: string, name?: string) => {
    setMonthCode1(code);
    if (!isNum(cfg.monthNumNames11, name)) setNum101(null);
    if (name === '-') setMonthTypeCode1(undefined);
  };
  // monthName02.Collapse
  const onMonth2 = (code?: string, name?: string) => {
    setMonthCode2(code);
    if (!isNum(cfg.monthNumNames12, name)) setNum102(null);
    if (name === '-') setMonthTypeCode2(undefined);
  };

  const dayName1 = day1.nameOf(dayCode1);
  const monthName1 = month1.nameOf(monthCode1);
  const monthName2 = month2.nameOf(monthCode2);

  // getModel(): 켜진 줄의 계산구분과 값만 덮어쓴다 (06의 12번 줄도 같은 위치의 num1)
  useImperativeHandle(ref, () => ({
    getModel: () => {
      if (calc === 'end') return { cycleCode: cfg.cycleCode, cycleCalcType: cfg.endType, holidayCode: holidayEnd ?? null };
      if (calc === '11') {
        return {
          cycleCode: cfg.cycleCode, cycleCalcType: '11', monthCode: monthCode1 ?? null, num1: num101, monthTypeCode: monthTypeCode1 ?? null,
          dayCode: dayCode1 ?? null, num2: num201, dayTypeCode: dayTypeCode1 ?? null, holidayCode: holiday1 ?? null,
        };
      }
      return {
        cycleCode: cfg.cycleCode, cycleCalcType: '12', monthCode: monthCode2 ?? null, num1: num102, monthTypeCode: monthTypeCode2 ?? null,
        weekCode: weekCode2 ?? null, dayWeekCode: dayWeekCode2 ?? null, holidayCode: holiday2 ?? null,
      };
    },
  }), [calc, cfg, holidayEnd, monthCode1, num101, monthTypeCode1, dayCode1, num201, dayTypeCode1, holiday1,
    monthCode2, num102, monthTypeCode2, weekCode2, dayWeekCode2, holiday2]);

  const monthProps = cfg.monthSource;
  return (
    <div style={{ padding: '25px 10px 10px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <BarRow enabled={calc === 'end'}>
        <RadioDot checked={calc === 'end'} onChange={() => setCalc('end')} />
        <span>{cfg.endLabel}</span>
        <CodeCombo kindCd="HolidaySettleCode" value={holidayEnd} disabled={calc !== 'end'} onChange={setHolidayEnd} onLoad={holidayEndNames.onLoad} />
      </BarRow>
      <BarRow enabled={calc === '11'}>
        <RadioDot checked={calc === '11'} onChange={() => setCalc('11')} />
        <CodeCombo {...monthProps} value={monthCode1} disabled={calc !== '11'} onChange={onMonth1} onLoad={month1.onLoad} />
        <NumField value={num101} disabled={calc !== '11' || !isNum(cfg.monthNumNames11, monthName1)} onChange={setNum101} />
        <CodeCombo kindCd="MonthTypeCode" value={monthTypeCode1} disabled={calc !== '11' || monthName1 === '-'} onChange={setMonthTypeCode1} onLoad={monthType1.onLoad} />
        <CodeCombo kindCd="DayCode" value={dayCode1} disabled={calc !== '11'} onChange={onDay1} onLoad={day1.onLoad} />
        <NumField value={num201} disabled={calc !== '11' || dayName1 !== '직접입력'} onChange={setNum201} />
        <CodeCombo kindCd="DsCode" value={dayTypeCode1} disabled={calc !== '11' || dayName1 === '-'} onChange={setDayTypeCode1} onLoad={dayType1.onLoad} />
        <CodeCombo kindCd="HolidaySettleCode" value={holiday1} disabled={calc !== '11'} onChange={setHoliday1} onLoad={holiday1Names.onLoad} />
      </BarRow>
      <BarRow enabled={calc === '12'}>
        <RadioDot checked={calc === '12'} onChange={() => setCalc('12')} />
        <CodeCombo {...monthProps} value={monthCode2} disabled={calc !== '12'} onChange={onMonth2} onLoad={month2.onLoad} />
        <NumField value={num102} disabled={calc !== '12' || !isNum(cfg.monthNumNames12, monthName2)} onChange={setNum102} />
        <CodeCombo kindCd="MonthTypeCode" value={monthTypeCode2} disabled={calc !== '12' || monthName2 === '-'} onChange={setMonthTypeCode2} onLoad={monthType2.onLoad} />
        <CodeCombo kindCd="WeekOfMonth" value={weekCode2} disabled={calc !== '12'} onChange={setWeekCode2} onLoad={week2.onLoad} />
        <CodeCombo kindCd="DayOfWeekCode" value={dayWeekCode2} disabled={calc !== '12'} onChange={setDayWeekCode2} onLoad={dayWeek2.onLoad} />
        <CodeCombo kindCd="HolidaySettleCode" value={holiday2} disabled={calc !== '12'} onChange={setHoliday2} onLoad={holiday2Names.onLoad} />
      </BarRow>
    </div>
  );
});
Sch03CycleMonthly.displayName = 'Sch03CycleMonthly';
