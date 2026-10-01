import React from 'react';
import { Button, Tag, Table, TableProps } from 'antd';
import { mockComplianceList } from '../../mock/data';
import { ComplianceItem } from '../../types';

export const ComplianceGridBox: React.FC = () => {
  const columns: TableProps<ComplianceItem>['columns'] = [
    {
      title: '구분',
      dataIndex: 'category',
      key: 'category',
      width: 90,
      align: 'center',
      render: (val: string) => (
        <Tag color="geekblue" style={{ margin: 0, fontSize: 11 }}>
          {val}
        </Tag>
      ),
    },
    {
      title: '마감일',
      dataIndex: 'dueDate',
      key: 'dueDate',
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
      title: '상세보기',
      dataIndex: 'detail',
      key: 'detail',
      width: 70,
      align: 'center',
      render: () => (
        <Button size="small" type="link" style={{ padding: 0, fontSize: 11 }}>
          열람
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
          backgroundColor: '#fafbfc',
          fontWeight: 700,
          fontSize: 13,
          color: '#1e293b',
          flexShrink: 0,
        }}
      >
        법규보고공시 및 내규정보
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        <Table<ComplianceItem>
          rowKey="id"
          dataSource={mockComplianceList}
          columns={columns}
          size="small"
          pagination={false}
          style={{ width: '100%' }}
        />
      </div>
    </div>
  );
};
