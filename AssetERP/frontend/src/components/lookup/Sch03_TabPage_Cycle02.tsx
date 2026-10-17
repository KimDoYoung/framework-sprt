/**
 * 반복주기 "주" 탭 (E01-1) — Sch03_Lookup_Cycle의 둘째 탭
 * AS-IS: myApp/client/vi/sch/Sch03_TabPage_Cycle02.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 getEditor() L53-83: 라디오(04) + 요일(DayOfWeekCode) + 영업일 구분(HolidaySettleCode) 한 줄
 */
import { forwardRef, useImperativeHandle, useState } from 'react';
import { BarRow, CodeCombo, RadioDot, Sch03TabHandle, Sch03TabProps, modelFor, useCodeNames } from './sch03CycleParts';

export const Sch03_TabPage_Cycle02 = forwardRef<Sch03TabHandle, Sch03TabProps>(({ model }, ref) => {
  // setModel(gridModel) L98-108: 읽어 온 기한이 "04"면 값을 채운다
  const m = modelFor(model, '02');
  const [dayWeekCode, setDayWeekCode] = useState(m?.dayWeekCode ?? undefined);
  const [holidayCode, setHolidayCode] = useState(m?.holidayCode ?? undefined);
  const dayWeek = useCodeNames();
  const holiday = useCodeNames();

  // [E0] 화면 열림 (생성자 L35-41) → Settings(), getEditor()
  // [E1] dayWeekName01[DayOfWeekCode].Collapse (L55) → dayWeekCode01.setValue(code) — 값 연결로 대신
  // [E2] holidayName01[HolidaySettleCode].Collapse (L61) → holidayCode01.setValue(code) — 값 연결로 대신
  // getModel() L85-96: 주기 "02", 계산구분 "04", 요일·영업일 구분
  useImperativeHandle(ref, () => ({
    getModel: () => ({ cycleCode: '02', cycleCalcType: '04', dayWeekCode: dayWeekCode ?? null, holidayCode: holidayCode ?? null }),
  }), [dayWeekCode, holidayCode]);

  return (
    <div style={{ padding: '25px 10px 10px 20px' }}>
      <BarRow>
        <RadioDot checked onChange={() => undefined} />
        <CodeCombo kindCd="DayOfWeekCode" value={dayWeekCode} onChange={setDayWeekCode} onLoad={dayWeek.onLoad} />
        <CodeCombo kindCd="HolidaySettleCode" value={holidayCode} onChange={setHolidayCode} onLoad={holiday.onLoad} />
      </BarRow>
    </div>
  );
});
Sch03_TabPage_Cycle02.displayName = 'Sch03_TabPage_Cycle02';
