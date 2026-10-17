/**
 * 반복주기 "년" 탭 (E01-1) — Sch03_Lookup_Cycle의 탭
 * AS-IS: myApp/client/vi/sch/Sch03_TabPage_Cycle06.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 몸체는 분기·반기·년이 같이 쓰는 `Sch03CycleMonthly`. 이 탭만의 설정: 주기 06, "년의 말일" 라디오(계산구분 09), 월 콤보 종류코드 MonthCode
 */
import { forwardRef } from 'react';
import { Sch03CycleMonthly, Sch03MonthlyConfig } from './sch03CycleMonthly';
import { Sch03TabHandle, Sch03TabProps } from './sch03CycleParts';

const CFG: Sch03MonthlyConfig = {
  cycleCode: '06',
  endType: '09',
  endLabel: '년의 말일',
  monthSource: { kindCd: 'MonthCode' },
  monthNumNames11: ['직접입력', '결산일'],
  monthNumNames12: ['직접입력'],
};

export const Sch03_TabPage_Cycle06 = forwardRef<Sch03TabHandle, Sch03TabProps>(({ model }, ref) => {
  // [E0] 화면 열림 (생성자 L74-82) → Settings(), getEditor(), activeCode09()
  // [E1] dayName01[DayCode].Collapse (L135): 일이 "직접입력"이면 숫자 칸(num201)을 켜고 아니면 끄고 비운다, "-"이면 일 구분을 끄고 비운다
  // [E2] monthName01.Collapse (L166): 월이 "직접입력"·"결산일"이면 숫자 칸(num101)을 켜고 아니면 끄고 비운다, "-"이면 월 구분을 끄고 비운다
  // [E3] monthName02.Collapse (L196): 12번 줄의 월 — "직접입력"이면 숫자 칸(num102)을 켜고 아니면 끄고 비운다, "-"이면 월 구분을 끄고 비운다
  // [E4] toggleGroup.ValueChange (L215) → activeCode09() / activeCode11() / activeCode12(): 라디오로 줄을 바꾼다
  // setModel(gridModel)·getModel(): 몸체(Sch03CycleMonthly) — 계산구분 09·11·12 중 켜진 줄의 값만 덮어쓴다
  return <Sch03CycleMonthly ref={ref} model={model} cfg={CFG} />;
});
Sch03_TabPage_Cycle06.displayName = 'Sch03_TabPage_Cycle06';
