import React, { useState } from 'react';
import { Button, Tag, Table, TableProps } from 'antd';
import { mockScheduleList } from '../../mock/data';
import { ScheduleItem } from '../../types';

interface ScheduleGridBoxProps {
  selectedDay: number;
}

export const ScheduleGridBox: React.FC<ScheduleGridBoxProps> = ({ selectedDay }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'dept' | 'my' | 'away'>('all');

  const tabs = [
    { key: 'all', label: '전체', count: mockScheduleList.length },
    { key: 'dept', label: '부서일정', count: mockScheduleList.filter((i) => i.category === '부서일정').length },
    { key: 'my', label: '나의일정', count: mockScheduleList.filter((i) => i.category === '나의일정').length },
    { key: 'away', label: '자리비움', count: mockScheduleList.filter((i) => i.category === '자리비움').length },
    { key: 'work', label: '업무활동', count: 0 },
    { key: 'alert', label: '알림', count: 0 },
  ];

  const filteredData = mockScheduleList.filter((item) => {
    if (activeTab === 'dept') return item.category === '부서일정';
    if (activeTab === 'my') return item.category === '나의일정';
    if (activeTab === 'away') return item.category === '자리비움';
    return true;
  });

  const columns: TableProps<ScheduleItem>['columns'] = [
    {
      title: '분류',
      dataIndex: 'category',
      key: 'category',
      width: 80,
      render: (val: string) => (
        <Tag
          color={val === '부서일정' ? 'blue' : val === '나의일정' ? 'cyan' : 'default'}
          style={{ margin: 0, fontSize: 11 }}
        >
          {val}
        </Tag>
      ),
    },
    {
      title: '일정명',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      render: (val: string) => <span style={{ fontWeight: 500 }}>{val}</span>,
    },
    {
      title: '등록자',
      dataIndex: 'registrant',
      key: 'registrant',
      width: 75,
      align: 'center',
    },
    {
      title: '마감일',
      dataIndex: 'dueDate',
      key: 'dueDate',
      width: 130,
      align: 'center',
      render: (val: string) => <span style={{ fontSize: 11, color: '#64748b' }}>{val}</span>,
    },
    {
      title: '처리일',
      dataIndex: 'processedDate',
      key: 'processedDate',
      width: 75,
      align: 'center',
      render: (val: string) => (
        <span
          style={{
            fontSize: 11,
            fontWeight: val === '완료' || val === '진행중' ? 600 : 400,
            color: val === '완료' ? '#22c55e' : val === '진행중' ? '#1677ff' : '#64748b',
          }}
        >
          {val || '-'}
        </span>
      ),
    },
    {
      title: '상세보기',
      dataIndex: 'detail',
      key: 'detail',
      width: 70,
      align: 'center',
      render: () => (
        <Button size="small" type="link" style={{ padding: 0, fontSize: 11 }}>
          보기
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
        height: '100%',
        minHeight: 0,
      }}
    >
      {/* Box Header */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ color: '#1e3a5f', fontWeight: 700, fontSize: 13 }}>
            ▶ 기준일 : 2026년 09월 {String(selectedDay).padStart(2, '0')}일 상세 일정
          </span>
          <Tag color="blue" style={{ margin: 0, fontSize: 11 }}>
            총 {filteredData.length}건
          </Tag>
        </div>
        <Button size="small" style={{ fontSize: 11, borderRadius: 3, height: 22 }}>
          ↪ 등록 바로가기
        </Button>
      </div>

      {/* Sub Filter Tabs */}
      <div
        style={{
          display: 'flex',
          backgroundColor: '#f1f5f9',
          borderBottom: '1px solid #e2e8f0',
          padding: '3px 6px',
          gap: 4,
          flexShrink: 0,
          flexWrap: 'wrap',
          alignItems: 'center',
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

      <style>{`
        /* 테이블 row 높이 미세 축소: y축 패딩을 2px 줄여 컴팩트한 행 높이 제공 (기본 8px -> 6px) */
        .schedule-table .ant-table-thead > tr > th {
          padding-top: 2px !important;
          padding-bottom: 2px !important;
        }
        .schedule-table .ant-table-tbody > tr > td {
          padding-top: 2px !important;
          padding-bottom: 2px !important;
        }
      `}</style>

      {/* Ant Design Table: y축 패딩 2px 축소(6px), 5개 행(약 175px) 기준 스크롤 뷰 */}
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <Table<ScheduleItem>
          className="schedule-table"
          rowKey="id"
          dataSource={filteredData}
          columns={columns}
          size="small"
          pagination={false}
          scroll={{ y: 175 }} // 5개 행(각 약 35px) 기준 스크롤 높이
          style={{ width: '100%' }}
        />
      </div>
    </div>
  );
};
