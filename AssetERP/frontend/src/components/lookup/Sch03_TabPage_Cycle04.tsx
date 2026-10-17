/**
 * 반복주기 "분기" 탭 (E01-1) — Sch03_Lookup_Cycle의 탭
 * AS-IS: myApp/client/vi/sch/Sch03_TabPage_Cycle04.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 몸체는 분기·반기·년이 같이 쓰는 `Sch03CycleMonthly`. 이 탭만의 설정: 주기 04, "분기의 말일" 라디오(계산구분 07), 월 콤보 코드그룹 MonthCode0001(sys.Sys00_Common.selectByKindGroupCode)
 */
import { forwardRef } from 'react';
import { Sch03CycleMonthly, Sch03MonthlyConfig } from './sch03CycleMonthly';
import { Sch03TabHandle, Sch03TabProps } from './sch03CycleParts';

const CFG: Sch03MonthlyConfig = {
  cycleCode: '04',
  endType: '07',
  endLabel: '분기의 말일',
  monthSource: { kindGroupCd: 'MonthCode0001' },
  monthNumNames11: ['직접입력'],
  monthNumNames12: ['직접입력'],
};

export const Sch03_TabPage_Cycle04 = forwardRef<Sch03TabHandle, Sch03TabProps>(({ model }, ref) => {
  // [E0] 화면 열림 (생성자 L84-92) → Settings(), getEditor(), activeCode07()
  // [E1] dayName01[DayCode].Collapse (L154): 일이 "직접입력"이면 숫자 칸(num201)을 켜고 아니면 끄고 비운다, "-"이면 일 구분을 끄고 비운다
  // [E2] monthName01.Collapse (L185): 월이 "직접입력"이면 숫자 칸(num101)을 켜고 아니면 끄고 비운다, "-"이면 월 구분을 끄고 비운다
  // [E3] monthName02.Collapse (L217): 12번 줄의 월 — "직접입력"이면 숫자 칸(num102)을 켜고 아니면 끄고 비운다, "-"이면 월 구분을 끄고 비운다
  // [E4] toggleGroup.ValueChange (L237) → activeCode07() / activeCode11() / activeCode12(): 라디오로 줄을 바꾼다
  // setModel(gridModel)·getModel(): 몸체(Sch03CycleMonthly) — 계산구분 07·11·12 중 켜진 줄의 값만 덮어쓴다
  return <Sch03CycleMonthly ref={ref} model={model} cfg={CFG} />;
});
Sch03_TabPage_Cycle04.displayName = 'Sch03_TabPage_Cycle04';
