import React, { useState } from 'react';
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
            <Button size="small" style={{ fontSize: 11, padding: '0 6px', height: 24, borderRadius: 3 }}>
              <span style={{ color: '#eab308', marginRight: 3 }}>🔔</span> 일정표시
            </Button>
            <Button size="small" style={{ fontSize: 11, padding: '0 6px', height: 24, borderRadius: 3 }}>
              <span style={{ color: '#eab308', marginRight: 3 }}>⭐</span> 북마크
            </Button>
            <Button size="small" style={{ fontSize: 11, padding: '0 6px', height: 24, borderRadius: 3 }}>
              <span style={{ color: '#ef4444', marginRight: 3 }}>📅</span> 공모주
            </Button>
            <Button size="small" style={{ fontSize: 11, padding: '0 6px', height: 24, borderRadius: 3 }}>
              <span style={{ color: '#854d0e', marginRight: 3 }}>💼</span> 출퇴근(Beta)
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
    const dayOfWeek = date.day(); // 0 = Sun, 6 = Sat
    const dateKey = date.format('YYYY-MM-DD');
    const event = eventMap[dateKey];

    const dayColor = !isCurrentMonth
      ? '#cbd5e1'
      : dayOfWeek === 0
      ? '#dc2626'
      : dayOfWeek === 6
      ? '#2563eb'
      : '#1e293b';

    return (
      <div
        style={{
          height: 48,
          borderRight: '1px solid #e2e8f0',
          borderBottom: '1px solid #e2e8f0',
          padding: 4,
          boxSizing: 'border-box',
          backgroundColor: isChosen ? '#e06666' : isCurrentMonth ? '#ffffff' : '#fcfcfc',
          color: isChosen ? '#ffffff' : '#334155',
          cursor: isCurrentMonth ? 'pointer' : 'default',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          transition: 'background-color 0.12s',
        }}
      >
        {/* 상단: 날짜 번호 및 개수 카운트 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <span
            style={{
              fontWeight: isChosen ? 700 : 500,
              color: isChosen ? '#ffffff' : dayColor,
              fontSize: 12,
            }}
          >
            {date.date()}
          </span>

          {event?.count && (
            <span
              style={{
                fontSize: 10,
                color: isChosen ? 'rgba(255,255,255,0.9)' : '#94a3b8',
                fontWeight: 400,
              }}
            >
              {event.count}
            </span>
          )}
        </div>

        {/* 하단: 일정 배지 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {event?.badge && (
            <div
              style={{
                backgroundColor: '#1d63b8',
                color: '#ffffff',
                fontSize: 10,
                padding: '1px 3px',
                borderRadius: 3,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                textAlign: 'center',
              }}
            >
              {event.badge}
            </div>
          )}
          {event?.holiday && (
            <div
              style={{
                backgroundColor: '#274b78',
                color: '#ffffff',
                fontSize: 10,
                padding: '1px 3px',
                borderRadius: 3,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                textAlign: 'center',
              }}
            >
              {event.holiday}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #d9dfe8',
        borderRadius: 4,
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}
    >
      <Calendar
        fullscreen={false}
        value={currentValue}
        onSelect={handleDateSelect}
        headerRender={renderHeader}
        fullCellRender={fullCellRender}
      />
    </div>
  );
};

export const MyPageCalender = MyPageCalendar;
export const DashboardCalendar = MyPageCalendar;
