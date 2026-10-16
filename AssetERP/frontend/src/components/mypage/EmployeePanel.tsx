import React, { useState } from 'react';
import { Input, Avatar, Tooltip, Button } from 'antd';
import {
  UserOutlined,
  InfoCircleFilled,
  ReloadOutlined,
  RightOutlined,
  LeftOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { employeeList } from '../../mock/data';
import { useAppSetting } from '../../hooks/useAppSetting';

interface EmployeePanelProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const EmployeePanel: React.FC<EmployeePanelProps> = ({
  collapsed: propCollapsed,
  onToggleCollapse: propOnToggleCollapse,
}) => {
  const [internalCollapsed, setInternalCollapsed] = useAppSetting(
    'mypage_employee_collapsed',
    false
  );
  const isCollapsed = propCollapsed !== undefined ? propCollapsed : internalCollapsed;
  const toggleCollapse = () => {
    if (propOnToggleCollapse) {
      propOnToggleCollapse();
    } else {
      setInternalCollapsed(!internalCollapsed);
    }
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'online' | 'busy'>('all');

  const onlineCount = employeeList.filter((e) => e.status === 'online').length;

  const filteredEmployees = employeeList.filter((emp) => {
    const matchesSearch =
      emp.name.includes(searchTerm) ||
      emp.position.includes(searchTerm) ||
      (emp.dept && emp.dept.includes(searchTerm));

    if (statusFilter === 'online') return matchesSearch && emp.status === 'online';
    if (statusFilter === 'busy') return matchesSearch && emp.status === 'busy';
    return matchesSearch;
  });

  // ── 접힘(Collapsed) 상태: 24px 슬림 바 ──
  if (isCollapsed) {
    return (
      <div
        onClick={toggleCollapse}
        title="임직원 접속 현황 펼치기"
        style={{
          width: 24,
          backgroundColor: '#f1f5f9',
          borderLeft: '1px solid #d9dfe8',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          height: '100%',
          flexShrink: 0,
          cursor: 'pointer',
          padding: '8px 0',
          userSelect: 'none',
          transition: 'background-color 0.15s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e2e8f0')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
      >
        <Tooltip title="임직원 패널 펼치기" placement="left">
          <Button
            type="text"
            size="small"
            icon={<LeftOutlined style={{ fontSize: 10, color: '#1677ff' }} />}
            style={{ width: 20, height: 20, padding: 0, marginBottom: 8 }}
          />
        </Tooltip>

        <TeamOutlined style={{ color: '#64748b', fontSize: 13, marginBottom: 8 }} />

        {/* 온라인 인원 수 뱃지 */}
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            backgroundColor: '#22c55e',
            boxShadow: '0 0 4px #22c55e',
            marginBottom: 8,
          }}
        />

        {/* 세로 쓰기 텍스트 */}
        <div
          style={{
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            letterSpacing: 2,
            fontSize: 11,
            fontWeight: 600,
            color: '#475569',
          }}
        >
          임직원 ({onlineCount})
        </div>
      </div>
    );
  }

  // ── 펼침(Expanded) 상태: 190px 패널 ──
  return (
    <div
      style={{
        width: 190,
        backgroundColor: '#f8fafc',
        borderLeft: '1px solid #d9dfe8',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        flexShrink: 0,
        transition: 'width 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* Panel Header with Collapse Toggle */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '5px 8px',
          borderBottom: '1px solid #e2e8f0',
          backgroundColor: '#fafbfc',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <TeamOutlined style={{ color: '#1677ff', fontSize: 13 }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: '#1e293b' }}>
            임직원 현황
          </span>
          <span style={{ fontSize: 10, color: '#22c55e', fontWeight: 600 }}>
            ({onlineCount}명)
          </span>
        </div>

        <Tooltip title="임직원 패널 접기" placement="left">
          <Button
            type="text"
            size="small"
            icon={<RightOutlined style={{ fontSize: 10, color: '#64748b' }} />}
            onClick={toggleCollapse}
            style={{ width: 20, height: 20, padding: 0 }}
          />
        </Tooltip>
      </div>

      {/* Employee List */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '6px 8px',
        }}
      >
        {filteredEmployees.map((emp) => (
          <div
            key={emp.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '6px 8px',
              margin: '3px 0',
              borderRadius: 6,
              backgroundColor: '#ffffff',
              border: '1px solid #eef2f7',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f1f5f9';
              e.currentTarget.style.borderColor = '#cbd5e1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
              e.currentTarget.style.borderColor = '#eef2f7';
            }}
          >
            {/* Avatar with info icon badge */}
            <div style={{ position: 'relative' }}>
              <Avatar
                size={28}
                style={{ backgroundColor: '#94a3b8', color: '#fff' }}
                icon={<UserOutlined />}
              />
              <InfoCircleFilled
                style={{
                  position: 'absolute',
                  right: -2,
                  bottom: -2,
                  fontSize: 10,
                  color: '#3b82f6',
                  backgroundColor: '#fff',
                  borderRadius: '50%',
                }}
              />
            </div>

            {/* Name and Position */}
            <div style={{ flex: 1, marginLeft: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>
                {emp.name} <span style={{ fontSize: 11, fontWeight: 400, color: '#64748b' }}>{emp.position}</span>
              </div>
            </div>

            {/* Status dot (Green = online, Red = busy/away) */}
            <div
              style={{
                width: 9,
                height: 9,
                borderRadius: '50%',
                backgroundColor: emp.status === 'online' ? '#22c55e' : '#ef4444',
                boxShadow: emp.status === 'online' ? '0 0 4px #22c55e' : '0 0 4px #ef4444',
              }}
              title={emp.status === 'online' ? '온라인 / 대화가능' : '자리비움 / 회의중'}
            />
          </div>
        ))}
      </div>

      {/* Bottom Search & Filter Bar */}
      <div
        style={{
          borderTop: '1px solid #e2e8f0',
          backgroundColor: '#ffffff',
          padding: '6px 8px',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        {/* Status indicator buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Tooltip title="온라인" placement="top">
            <span
              onClick={() => setStatusFilter(statusFilter === 'online' ? 'all' : 'online')}
              style={{
                width: 9,
                height: 9,
                borderRadius: '50%',
                backgroundColor: '#22c55e',
                cursor: 'pointer',
                opacity: statusFilter === 'busy' ? 0.3 : 1,
              }}
            />
          </Tooltip>
          <Tooltip title="자리비움" placement="top">
            <span
              onClick={() => setStatusFilter(statusFilter === 'busy' ? 'all' : 'busy')}
              style={{
                width: 9,
                height: 9,
                borderRadius: '50%',
                backgroundColor: '#ef4444',
                cursor: 'pointer',
                opacity: statusFilter === 'online' ? 0.3 : 1,
              }}
            />
          </Tooltip>
        </div>

        {/* Search input */}
        <Input
          placeholder="사원/부서명 검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          style={{ fontSize: 11, borderRadius: 4 }}
        />

        <Tooltip title="새로고침" placement="left">
          <span style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
            <ReloadOutlined
              style={{ fontSize: 12, color: '#64748b' }}
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
            />
          </span>
        </Tooltip>
      </div>
    </div>
  );
};

export const RightMessengerSidebar = EmployeePanel;
