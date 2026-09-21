import React, { useState } from 'react';
import { Button, Tag, Table, TableProps } from 'antd';
import {
  CalendarOutlined,
  LeftOutlined,
  RightOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { mockDayList } from '../../mock/data';
import { DayListItem } from '../../types';

export const DayListBox: React.FC = () => {
  const [dayDate, setDayDate] = useState('2026-09-17');

  const columns: TableProps<DayListItem>['columns'] = [
    {
      title: '업무구분',
      dataIndex: 'workType',
      key: 'workType',
      width: 90,
      align: 'center',
      render: (val: string) => (
        <Tag color="cyan" style={{ margin: 0, fontSize: 11 }}>
          {val}
        </Tag>
      ),
    },
    {
      title: '등록(마감)일',
      dataIndex: 'regDueDate',
      key: 'regDueDate',
      width: 105,
      align: 'center',
      render: (val: string) => <span style={{ fontSize: 11, color: '#64748b' }}>{val}</span>,
    },
    {
      title: '제목',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      render: (val: string) => <span style={{ fontWeight: 500 }}>{val}</span>,
    },
    {
      title: '처리(완료)일',
      dataIndex: 'completedDate',
      key: 'completedDate',
      width: 95,
      align: 'center',
      render: (val: string) => <span style={{ fontSize: 11, color: '#64748b' }}>{val || '-'}</span>,
    },
    {
      title: '담당자',
      dataIndex: 'manager',
      key: 'manager',
      width: 85,
      align: 'center',
    },
    {
      title: '상세보기',
      dataIndex: 'detail',
      key: 'detail',
      width: 70,
      align: 'center',
      render: () => (
        <Button size="small" type="link" style={{ padding: 0, fontSize: 11 }}>
          상세
        </Button>
      ),
    },
  ];

  return (
    <div
      style={{
        backgroundColor: '#fff',
        border: '1px solid #d9dfe8',
        borderRadius: 4,
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minHeight: 0,
      }}
    >
      <div
        style={{
          padding: '6px 12px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#fafbfc',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 700, fontSize: 13, color: '#1e293b' }}>Day List</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Button
              size="small"
              icon={<LeftOutlined style={{ fontSize: 9 }} />}
              onClick={() => setDayDate('2026-09-16')}
              style={{ height: 22, padding: '0 4px' }}
            />
            <span style={{ fontSize: 12, fontWeight: 500, color: '#334155', fontFamily: 'monospace' }}>
              {dayDate}
            </span>
            <CalendarOutlined style={{ color: '#64748b', fontSize: 13 }} />
            <Button
              size="small"
              icon={<RightOutlined style={{ fontSize: 9 }} />}
              onClick={() => setDayDate('2026-09-18')}
              style={{ height: 22, padding: '0 4px' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Button size="small" icon={<ReloadOutlined style={{ fontSize: 10 }} />} style={{ fontSize: 11, height: 22, borderRadius: 3 }}>
            새로고침
          </Button>
          <Button size="small" style={{ fontSize: 11, height: 22, borderRadius: 3 }}>
            바로가기
          </Button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        <Table<DayListItem>
          rowKey="id"
          dataSource={mockDayList}
          columns={columns}
          size="small"
          pagination={false}
          style={{ width: '100%' }}
        />
      </div>
    </div>
  );
};
