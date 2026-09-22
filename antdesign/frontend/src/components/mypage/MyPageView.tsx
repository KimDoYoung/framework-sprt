import React, { useState } from 'react';
import { MyPageCalendar } from './MyPageCalendar';
import { ScheduleGridBox } from './ScheduleGridBox';
import { DayListBox } from './DayListBox';
import { ApprovalGridBox } from './ApprovalGridBox';
import { ComplianceGridBox } from './ComplianceGridBox';
import { EmployeePanel } from './EmployeePanel';

export const MyPageView: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<number>(16);

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        padding: 6,
        gap: 6,
        backgroundColor: '#f0f2f5',
        boxSizing: 'border-box',
      }}
    >
      {/* ── 1. 좌측 컬럼 (48% 가용 너비): 캘린더 & 기준일 상세 일정 ── */}
      <div
        style={{
          flex: '0 0 48%',
          minWidth: 380,
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          height: '100%',
          minHeight: 0,
          overflow: 'hidden',
        }}
      >
        {/* 상단: 월간 캘린더 (남은 높이를 유연하게 채우는 가변 셀 뷰 flex: 1) */}
        <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <MyPageCalendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
        </div>

        {/* 하단: 기준일 상세 일정 그리드 (y축 패딩 축소 5개 행 기준 약 280px 고정) */}
        <div style={{ height: 280, flexShrink: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <ScheduleGridBox selectedDay={selectedDate} />
        </div>
      </div>

      {/* ── 2. 중앙 컬럼 (52% 가용 너비): Day List & 전자결재 & 법규공시 ── */}
      <div
        style={{
          flex: 1,
          minWidth: 420,
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          height: '100%',
          minHeight: 0,
          overflow: 'hidden',
        }}
      >
        {/* 상단: Day List 박스 */}
        <div style={{ flex: 1.1, minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <DayListBox />
        </div>

        {/* 중단: 전자결재 박스 */}
        <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <ApprovalGridBox />
        </div>

        {/* 하단: 법규보고공시 및 내규정보 박스 */}
        <div style={{ flex: 0.9, minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <ComplianceGridBox />
        </div>
      </div>

      {/* ── 3. 우측 컬럼 (190px 고정 / 접이식 토글 A안): 임직원 현황 ── */}
      <EmployeePanel />
    </div>
  );
};
