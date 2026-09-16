import React, { useState } from 'react';
import { Button, Space } from 'antd';
import {
  DoubleLeftOutlined,
  LeftOutlined,
  RightOutlined,
  DoubleRightOutlined,
  ReloadOutlined,
} from '@ant-design/icons';

interface CalendarCell {
  day: number;
  isCurrentMonth: boolean;
  isSunday?: boolean;
  badge?: string;
  count?: string;
  holiday?: string;
  isSelected?: boolean;
}

interface CalendarProps {
  selectedDate: number;
  onSelectDate: (day: number) => void;
}

export const DashboardCalendar: React.FC<CalendarProps> = ({
  selectedDate,
  onSelectDate,
}) => {
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(9);

  // Calendar cells definition matching main1.png & main2.png
  const weeks: CalendarCell[][] = [
    // Week 1
    [
      { day: 30, isCurrentMonth: false, isSunday: true },
      { day: 31, isCurrentMonth: false },
      { day: 1, isCurrentMonth: true },
      { day: 2, isCurrentMonth: true, badge: '부서일정 1건' },
      { day: 3, isCurrentMonth: true, count: '+2 개' },
      { day: 4, isCurrentMonth: true, count: '+2 개' },
      { day: 5, isCurrentMonth: true },
    ],
    // Week 2
    [
      { day: 6, isCurrentMonth: true, isSunday: true, count: '+2 개' },
      { day: 7, isCurrentMonth: true, count: '+2 개' },
      { day: 8, isCurrentMonth: true, count: '+4 개' },
      { day: 9, isCurrentMonth: true, count: '+2 개' },
      { day: 10, isCurrentMonth: true, count: '+2 개' },
      { day: 11, isCurrentMonth: true, count: '+2 개' },
      { day: 12, isCurrentMonth: true },
    ],
    // Week 3
    [
      { day: 13, isCurrentMonth: true, isSunday: true, count: '+3 개' },
      { day: 14, isCurrentMonth: true },
      { day: 15, isCurrentMonth: true, badge: '부서일정 1건' },
      { day: 16, isCurrentMonth: true, isSelected: true, count: '+2 개' }, // 16일: 선택된 날짜
      { day: 17, isCurrentMonth: true, count: '+2 개' },
      { day: 18, isCurrentMonth: true, badge: '부서일정 1건' },
      { day: 19, isCurrentMonth: true },
    ],
    // Week 4
    [
      { day: 20, isCurrentMonth: true, isSunday: true, count: '+2 개' },
      { day: 21, isCurrentMonth: true },
      { day: 22, isCurrentMonth: true, badge: '부서일정 1건' },
      { day: 23, isCurrentMonth: true, count: '+2 개' },
      { day: 24, isCurrentMonth: true, holiday: '휴일(추석연휴)' },
      { day: 25, isCurrentMonth: true, holiday: '휴일(추석)' },
      { day: 26, isCurrentMonth: true },
    ],
    // Week 5
    [
      { day: 27, isCurrentMonth: true, isSunday: true, count: '+2 개' },
      { day: 28, isCurrentMonth: true },
      { day: 29, isCurrentMonth: true, count: '+2 개' },
      { day: 30, isCurrentMonth: true, badge: '부서일정 1건' },
      { day: 1, isCurrentMonth: false },
      { day: 2, isCurrentMonth: false },
      { day: 3, isCurrentMonth: false },
    ],
    // Week 6 (faded bottom row)
    [
      { day: 4, isCurrentMonth: false, isSunday: true },
      { day: 5, isCurrentMonth: false },
      { day: 6, isCurrentMonth: false },
      { day: 7, isCurrentMonth: false },
      { day: 8, isCurrentMonth: false },
      { day: 9, isCurrentMonth: false },
      { day: 10, isCurrentMonth: false },
    ],
  ];

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
      {/* ── Calendar Header ── */}
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
        {/* Left: Year/Month and Quick Action Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: '#1e293b' }}>
            {year}년 {month}월
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

        {/* Right: Navigation buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Button.Group size="small">
            <Button
              icon={<DoubleLeftOutlined style={{ fontSize: 10 }} />}
              onClick={() => setYear((y) => y - 1)}
              style={{ height: 24, padding: '0 6px' }}
            />
            <Button
              icon={<LeftOutlined style={{ fontSize: 10 }} />}
              onClick={() => setMonth((m) => (m === 1 ? 12 : m - 1))}
              style={{ height: 24, padding: '0 6px' }}
            />
            <Button
              icon={<RightOutlined style={{ fontSize: 10 }} />}
              onClick={() => setMonth((m) => (m === 12 ? 1 : m + 1))}
              style={{ height: 24, padding: '0 6px' }}
            />
            <Button
              icon={<DoubleRightOutlined style={{ fontSize: 10 }} />}
              onClick={() => setYear((y) => y + 1)}
              style={{ height: 24, padding: '0 6px' }}
            />
          </Button.Group>

          <Button
            size="small"
            style={{ fontSize: 11, height: 24, borderRadius: 3 }}
            onClick={() => {
              setYear(2026);
              setMonth(9);
              onSelectDate(16);
            }}
          >
            오늘
          </Button>

          <Button
            size="small"
            type="primary"
            style={{ fontSize: 11, height: 24, borderRadius: 3, backgroundColor: '#1e3a5f' }}
            icon={<ReloadOutlined style={{ fontSize: 10 }} />}
          >
            새로고침
          </Button>
        </div>
      </div>

      {/* ── Calendar Table Grid ── */}
      <div style={{ width: '100%', overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'center',
            fontSize: 12,
          }}
        >
          <thead>
            <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid #cbd5e1' }}>
              <th style={{ width: '14.28%', padding: '6px 0', color: '#dc2626', fontWeight: 600 }}>일</th>
              <th style={{ width: '14.28%', padding: '6px 0', color: '#334155', fontWeight: 600 }}>월</th>
              <th style={{ width: '14.28%', padding: '6px 0', color: '#334155', fontWeight: 600 }}>화</th>
              <th style={{ width: '14.28%', padding: '6px 0', color: '#334155', fontWeight: 600 }}>수</th>
              <th style={{ width: '14.28%', padding: '6px 0', color: '#334155', fontWeight: 600 }}>목</th>
              <th style={{ width: '14.28%', padding: '6px 0', color: '#334155', fontWeight: 600 }}>금</th>
              <th style={{ width: '14.28%', padding: '6px 0', color: '#2563eb', fontWeight: 600 }}>토</th>
            </tr>
          </thead>
          <tbody>
            {weeks.map((week, wIdx) => (
              <tr key={wIdx} style={{ height: 48, borderBottom: '1px solid #e2e8f0' }}>
                {week.map((cell, dIdx) => {
                  const isCurrent = cell.isCurrentMonth;
                  const isChosen = isCurrent && cell.day === selectedDate;
                  const dayColor = !isCurrent
                    ? '#cbd5e1'
                    : cell.isSunday
                    ? '#dc2626'
                    : dIdx === 6
                    ? '#2563eb'
                    : '#1e293b';

                  return (
                    <td
                      key={dIdx}
                      onClick={() => isCurrent && onSelectDate(cell.day)}
                      style={{
                        borderRight: '1px solid #e2e8f0',
                        padding: '4px',
                        verticalAlign: 'top',
                        backgroundColor: isChosen ? '#e06666' : isCurrent ? '#ffffff' : '#fcfcfc',
                        color: isChosen ? '#ffffff' : '#334155',
                        cursor: isCurrent ? 'pointer' : 'default',
                        position: 'relative',
                        transition: 'background-color 0.12s',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                        }}
                      >
                        <span
                          style={{
                            fontWeight: isChosen ? 700 : 500,
                            color: isChosen ? '#ffffff' : dayColor,
                            fontSize: 12,
                          }}
                        >
                          {cell.day}
                        </span>

                        {/* Count text e.g. +2 개 */}
                        {cell.count && (
                          <span
                            style={{
                              fontSize: 10,
                              color: isChosen ? 'rgba(255,255,255,0.9)' : '#94a3b8',
                              fontWeight: 400,
                            }}
                          >
                            {cell.count}
                          </span>
                        )}
                      </div>

                      {/* Event badge pills */}
                      <div style={{ marginTop: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {cell.badge && (
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
                            {cell.badge}
                          </div>
                        )}
                        {cell.holiday && (
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
                            {cell.holiday}
                          </div>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
