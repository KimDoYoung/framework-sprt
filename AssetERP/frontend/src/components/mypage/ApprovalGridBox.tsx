import React, { useState } from 'react';
import { Button, Tag, Table, TableProps } from 'antd';
import { mockApprovalList } from '../../mock/data';
import { ApprovalItem } from '../../types';

export const ApprovalGridBox: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'requested' | 'draft'>('requested');

  const tabs = [
    { key: 'pending', label: '미결함', count: 0 },
    { key: 'requested', label: '결재요청함 (완료/반려건은 최대 7일까지 표시)', count: 2 },
    { key: 'draft', label: '임시저장함', count: 0 },
  ];

  const columns: TableProps<ApprovalItem>['columns'] = [
    {
      title: '진행상태',
      dataIndex: 'status',
      key: 'status',
      width: 90,
      align: 'center',
      render: (val: string) => (
        <Tag color={val === '결재대기' ? 'orange' : 'blue'} style={{ margin: 0, fontSize: 11 }}>
          {val}
        </Tag>
      ),
    },
    {
      title: '등록일',
      dataIndex: 'regDate',
      key: 'regDate',
      width: 95,
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
      title: '상신자',
      dataIndex: 'applicant',
      key: 'applicant',
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
          결재
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
          display: 'flex',
          backgroundColor: '#f1f5f9',
          borderBottom: '1px solid #e2e8f0',
          padding: '3px 8px',
          gap: 6,
          flexShrink: 0,
          flexWrap: 'wrap',
        }}
      >
        {tabs.map((tab) => {
          const isSelected = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              style={{
                border: '1px solid',
                borderColor: isSelected ? '#1677ff' : '#cbd5e1',
                backgroundColor: isSelected ? '#1677ff' : '#ffffff',
                color: isSelected ? '#ffffff' : '#334155',
                borderRadius: 3,
                padding: '2px 8px',
                fontSize: 11,
                fontWeight: isSelected ? 600 : 400,
                cursor: 'pointer',
                transition: 'all 0.12s',
              }}
            >
              {tab.label} <span style={{ opacity: 0.85 }}>[{tab.count}]</span>
            </button>
          );
        })}
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        <Table<ApprovalItem>
          rowKey="id"
          dataSource={mockApprovalList}
          columns={columns}
          size="small"
          pagination={false}
          style={{ width: '100%' }}
        />
      </div>
    </div>
  );
};
