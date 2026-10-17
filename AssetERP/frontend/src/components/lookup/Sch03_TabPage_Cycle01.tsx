/**
 * 반복주기 "일" 탭 (E01-1) — Sch03_Lookup_Cycle의 첫 탭
 * AS-IS: myApp/client/vi/sch/Sch03_TabPage_Cycle01.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 getEditor() L42-59: 라디오(03) + "매일" 한 줄
 */
import { forwardRef, useImperativeHandle } from 'react';
import { BarRow, RadioDot, Sch03TabHandle, Sch03TabProps } from './sch03CycleParts';

export const Sch03_TabPage_Cycle01 = forwardRef<Sch03TabHandle, Sch03TabProps>((_props, ref) => {
  // [E0] 화면 열림 (생성자 L29-35) → Settings(), getEditor()
  // getModel() L61-70: 주기 "01", 계산구분 "03"(매일)
  useImperativeHandle(ref, () => ({ getModel: () => ({ cycleCode: '01', cycleCalcType: '03' }) }), []);
  return (
    <div style={{ padding: '25px 10px 10px 20px' }}>
      <BarRow>
        <RadioDot checked onChange={() => undefined} />
        <span>매일</span>
      </BarRow>
    </div>
  );
});
Sch03_TabPage_Cycle01.displayName = 'Sch03_TabPage_Cycle01';
