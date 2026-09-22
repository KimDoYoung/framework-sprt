import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Button, Space } from 'antd';
import type { CellRenderInfo } from 'rc-picker/lib/interface';
import {
  DoubleLeftOutlined,
  LeftOutlined,
  RightOutlined,
  DoubleRightOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';

interface CalendarProps {
  selectedDate?: number;
  onSelectDate?: (day: number) => void;
  value?: Dayjs;
  onChange?: (date: Dayjs) => void;
}

interface EventItem {
  badge?: string;
  count?: string;
  holiday?: string;
}

// 2026-09 기준 목업 일정 데이터
const eventMap: Record<string, EventItem> = {
  '2026-09-02': { badge: '부서일정 1건' },
  '2026-09-03': { count: '+2 개' },
  '2026-09-04': { count: '+2 개' },
  '2026-09-06': { count: '+2 개' },
  '2026-09-07': { count: '+2 개' },
  '2026-09-08': { count: '+4 개' },
  '2026-09-09': { count: '+2 개' },
  '2026-09-10': { count: '+2 개' },
  '2026-09-11': { count: '+2 개' },
  '2026-09-13': { count: '+3 개' },
  '2026-09-15': { badge: '부서일정 1건' },
  '2026-09-16': { count: '+2 개' },
  '2026-09-17': { count: '+2 개' },
  '2026-09-18': { badge: '부서일정 1건' },
  '2026-09-20': { count: '+2 개' },
  '2026-09-22': { badge: '부서일정 1건' },
  '2026-09-23': { count: '+2 개' },
  '2026-09-24': { holiday: '휴일(추석연휴)' },
  '2026-09-25': { holiday: '휴일(추석)' },
  '2026-09-26': { holiday: '휴일(추석연휴)' },
  '2026-09-27': { count: '+2 개' },
  '2026-09-29': { count: '+2 개' },
  '2026-09-30': { badge: '부서일정 1건' },
};

export const MyPageCalendar: React.FC<CalendarProps> = ({
  selectedDate = 16,
  onSelectDate,
  value: propValue,
  onChange: propOnChange,
}) => {
  const [internalValue, setInternalValue] = useState<Dayjs>(() =>
    dayjs('2026-09-01').set('date', selectedDate)
  );

  const currentValue = propValue ?? internalValue;
  const calendarRef = useRef<HTMLDivElement>(null);

  // 이번 달(in-view) 날짜가 단 하루도 없는 다음 달 잉여 행(6번째 주 등) 자동 숨김
  useEffect(() => {
    const hideEmptyRows = () => {
      if (!calendarRef.current) return;
      const trList = calendarRef.current.querySelectorAll('.ant-picker-content tbody tr');
      trList.forEach((tr) => {
        const inViewCell = tr.querySelector('.ant-picker-cell-in-view');
        if (!inViewCell) {
          (tr as HTMLElement).style.display = 'none';
        } else {
          (tr as HTMLElement).style.display = '';
        }
      });
    };

    hideEmptyRows();
    const rafId = requestAnimationFrame(hideEmptyRows);
    return () => cancelAnimationFrame(rafId);
  }, [currentValue]);

  const handleDateSelect = (date: Dayjs) => {
    setInternalValue(date);
    onSelectDate?.(date.date());
    propOnChange?.(date);
  };

  // Ant Design Calendar 헤더 렌더러 (연/월 네비게이션 및 빠른 액션 버튼)
  const renderHeader = ({ value, onChange }: { value: Dayjs; onChange: (date: Dayjs) => void }) => {
    return (
      <div
        style={{
          padding: '8px 12px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 8,
          backgroundColor: '#fafbfc',
        }}
      >
        {/* Left: 연/월 표시 및 빠른 버튼들 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: '#1e293b' }}>
            {value.year()}년 {value.month() + 1}월
          </span>

          <Space size={4}>
            <Button size="small" style={{ fontSize: 12, padding: '0 8px', height: 25, borderRadius: 3 }}>
              <span style={{ color: '#eab308', marginRight: 2 }}>🔔</span> 일정표시
            </Button>
            <Button size="small" style={{ fontSize: 12, padding: '0 8px', height: 25, borderRadius: 3 }}>
              <span style={{ color: '#eab308', marginRight: 2 }}>⭐</span> 북마크
            </Button>
            <Button size="small" style={{ fontSize: 12, padding: '0 8px', height: 25, borderRadius: 3 }}>
              <span style={{ color: '#ef4444', marginRight: 2 }}>📅</span> 공모주
            </Button>
            <Button size="small" style={{ fontSize: 12, padding: '0 8px', height: 25, borderRadius: 3 }}>
              <span style={{ color: '#854d0e', marginRight: 2 }}>💼</span> 출퇴근(Beta)
            </Button>
          </Space>
        </div>

        {/* Right: 연/월 이동 버튼 그룹 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Button.Group size="small">
            <Button
              icon={<DoubleLeftOutlined style={{ fontSize: 10 }} />}
              onClick={() => onChange(value.subtract(1, 'year'))}
              style={{ height: 24, padding: '0 6px' }}
              title="이전 연도"
            />
            <Button
              icon={<LeftOutlined style={{ fontSize: 10 }} />}
              onClick={() => onChange(value.subtract(1, 'month'))}
              style={{ height: 24, padding: '0 6px' }}
              title="이전 달"
            />
            <Button
              icon={<RightOutlined style={{ fontSize: 10 }} />}
              onClick={() => onChange(value.add(1, 'month'))}
              style={{ height: 24, padding: '0 6px' }}
              title="다음 달"
            />
            <Button
              icon={<DoubleRightOutlined style={{ fontSize: 10 }} />}
              onClick={() => onChange(value.add(1, 'year'))}
              style={{ height: 24, padding: '0 6px' }}
              title="다음 연도"
            />
          </Button.Group>

          <Button
            size="small"
            style={{ fontSize: 11, height: 24, borderRadius: 3 }}
            onClick={() => {
              const today = dayjs('2026-09-16');
              onChange(today);
              handleDateSelect(today);
            }}
          >
            오늘
          </Button>

          <Button
            size="small"
            type="primary"
            style={{ fontSize: 11, height: 24, borderRadius: 3, backgroundColor: '#1e3a5f' }}
            icon={<ReloadOutlined style={{ fontSize: 10 }} />}
            onClick={() => {
              onChange(value.clone());
            }}
          >
            새로고침
          </Button>
        </div>
      </div>
    );
  };

  // Ant Design Calendar 커스텀 날짜 셀 렌더러
  const fullCellRender = (date: Dayjs, info: CellRenderInfo<Dayjs>) => {
    if (info.type !== 'date') return info.originNode;

    const isCurrentMonth = date.month() === currentValue.month();
    const isChosen = date.isSame(currentValue, 'day');
    const isToday = date.isSame(dayjs('2026-09-16'), 'day');
    const dayOfWeek = date.day(); // 0 = Sun, 6 = Sat
    const dateKey = date.format('YYYY-MM-DD');
    const event = eventMap[dateKey];
    const isHoliday = Boolean(event?.holiday);

    // 공휴일 및 일요일: 빨간색, 토요일: 파란색, 평일: 진한 텍스트
    const dayColor = !isCurrentMonth
      ? '#cbd5e1'
      : isHoliday || dayOfWeek === 0
      ? '#dc2626'
      : dayOfWeek === 6
      ? '#2563eb'
      : '#1e293b';

    return (
      <div
        style={{
          height: '100%',
          minHeight: 48,
          borderRight: '1px solid #e2e8f0',
          borderBottom: '1px solid #e2e8f0',
          padding: '4px 5px',
          boxSizing: 'border-box',
          // 선택된 셀은 짙은 빨간색 대신 눈이 편안한 소프트 블루 배경 + 2px 인셋 테두리 적용
          backgroundColor: isChosen
            ? '#eff6ff'
            : isToday
            ? '#f8fafc'
            : isCurrentMonth
            ? '#ffffff'
            : '#fafafa',
          boxShadow: isChosen ? 'inset 0 0 0 2px #1677ff' : 'none',
          color: '#334155',
          cursor: isCurrentMonth ? 'pointer' : 'default',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start', // 하단이 아닌 상단부터 차례대로 표시
          gap: 3,
          transition: 'background-color 0.12s, box-shadow 0.12s',
        }}
      >
        {/* 1. 셀 상단: 날짜 번호 + '오늘' 뱃지 + 건수 카운트 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', lineHeight: 1, marginBottom: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span
              style={{
                fontWeight: isChosen ? 800 : isHoliday || dayOfWeek === 0 ? 600 : 500,
                color: dayColor,
                fontSize: 12,
                lineHeight: '13px',
                display: 'inline-block',
              }}
            >
              {date.date()}
            </span>
            {isToday && (
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  color: '#1677ff',
                  backgroundColor: '#dbeafe',
                  padding: '1px 3px',
                  borderRadius: 2,
                  lineHeight: '11px',
                }}
              >
                오늘
              </span>
            )}
          </div>

          {event?.count && (
            <span
              style={{
                fontSize: 10,
                color: '#64748b',
                fontWeight: 500,
                lineHeight: '13px',
              }}
            >
              {event.count}
            </span>
          )}
        </div>

        {/* 2. 셀 상단 이어서 표시: 공휴일 배지 및 부서일정 항목들 */}
        {event?.holiday && (
          <div
            style={{
              backgroundColor: '#dc2626', // 공휴일 전용 빨간색 배경
              color: '#ffffff',
              fontSize: 10,
              fontWeight: 600,
              padding: '2px 4px',
              borderRadius: 3,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              lineHeight: '13px',
            }}
          >
            {event.holiday}
          </div>
        )}

        {event?.badge && (
          <div
            style={{
              backgroundColor: '#1d63b8',
              color: '#ffffff',
              fontSize: 10,
              fontWeight: 500,
              padding: '2px 4px',
              borderRadius: 3,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              lineHeight: '13px',
            }}
          >
            {event.badge}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      ref={calendarRef}
      className="mypage-calendar-container"
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #d9dfe8',
        borderRadius: 4,
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <style>{`
        /* 캘린더 전체 및 내부 테이블 높이 가변 100% 확장 */
        .mypage-calendar-container .ant-picker-calendar {
          height: 100% !important;
          display: flex !important;
          flex-direction: column !important;
          flex: 1 !important;
          min-height: 0 !important;
        }
        .mypage-calendar-container .ant-picker-panel {
          height: 100% !important;
          display: flex !important;
          flex-direction: column !important;
          flex: 1 !important;
          min-height: 0 !important;
        }
        .mypage-calendar-container .ant-picker-date-panel {
          height: 100% !important;
          display: flex !important;
          flex-direction: column !important;
          flex: 1 !important;
          min-height: 0 !important;
        }
        .mypage-calendar-container .ant-picker-body {
          flex: 1 !important;
          display: flex !important;
          flex-direction: column !important;
          min-height: 0 !important;
          padding: 0 !important;
        }
        .mypage-calendar-container .ant-picker-content {
          height: 100% !important;
          width: 100% !important;
          border-collapse: collapse !important;
        }
        .mypage-calendar-container .ant-picker-content thead tr {
          border-bottom: 2px solid #cbd5e1 !important;
        }
        .mypage-calendar-container .ant-picker-content th {
          padding: 5px 0 !important;
          color: #334155 !important;
          font-weight: 600 !important;
          font-size: 12px !important;
          background-color: #f8fafc !important;
          border-bottom: 1px solid #cbd5e1 !important;
        }
        .mypage-calendar-container .ant-picker-content th:first-child {
          color: #dc2626 !important;
        }
        .mypage-calendar-container .ant-picker-content th:last-child {
          color: #2563eb !important;
        }
        .mypage-calendar-container .ant-picker-content tbody {
          height: 100% !important;
        }
        .mypage-calendar-container .ant-picker-cell {
          padding: 0 !important;
          vertical-align: top !important;
          height: 1% !important; /* 남은 높이 균등 분할 */
        }
        .mypage-calendar-container .ant-picker-cell-inner {
          padding: 0 !important;
          border-radius: 0 !important;
          height: 100% !important;
          min-height: 48px !important;
          display: flex !important;
          flex-direction: column !important;
        }
        /* 이번 달 날짜가 단 하나도 없는 행(완전히 다음 달로만 채워진 6번째 주 등) 자동 숨김 */
        .mypage-calendar-container .ant-picker-content tbody tr:not(:has(.ant-picker-cell-in-view)) {
          display: none !important;
        }
      `}</style>
      <Calendar
        fullscreen={false}
        value={currentValue}
        onSelect={handleDateSelect}
        headerRender={renderHeader}
        fullCellRender={fullCellRender}
        style={{ height: '100%' }}
      />
    </div>
  );
};

export const MyPageCalender = MyPageCalendar;
export const DashboardCalendar = MyPageCalendar;
