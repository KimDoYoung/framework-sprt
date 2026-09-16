import React, { useState } from 'react';
import { Input, Avatar, Tooltip } from 'antd';
import {
  UserOutlined,
  InfoCircleFilled,
  ReloadOutlined,
} from '@ant-design/icons';
import { employeeList } from '../mock/data';

export const RightMessengerSidebar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'online' | 'busy'>('all');

  const filteredEmployees = employeeList.filter((emp) => {
    const matchesSearch =
      emp.name.includes(searchTerm) ||
      emp.position.includes(searchTerm) ||
      (emp.dept && emp.dept.includes(searchTerm));

    if (statusFilter === 'online') return matchesSearch && emp.status === 'online';
    if (statusFilter === 'busy') return matchesSearch && emp.status === 'busy';
    return matchesSearch;
  });

  return (
    <div
      style={{
        width: 190,
        backgroundColor: '#f8fafc',
        borderLeft: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        flexShrink: 0,
      }}
    >
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
                size={30}
                style={{ backgroundColor: '#94a3b8', color: '#fff' }}
                icon={<UserOutlined />}
              />
              <InfoCircleFilled
                style={{
                  position: 'absolute',
                  right: -2,
                  bottom: -2,
                  fontSize: 11,
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

            {/* Status dot (Green = online, Red = busy/away) matching screenshot */}
            <div
              style={{
                width: 10,
                height: 10,
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
          <Tooltip title="온라인">
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
          <Tooltip title="자리비움">
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

        {/* Search input matching main1.png */}
        <Input
          placeholder="사원/부서명 검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          style={{ fontSize: 11, borderRadius: 4 }}
        />

        <Tooltip title="새로고침">
          <ReloadOutlined
            style={{ fontSize: 12, color: '#64748b', cursor: 'pointer' }}
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
            }}
          />
        </Tooltip>
      </div>
    </div>
  );
};
