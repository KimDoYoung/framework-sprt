import React, { useState } from 'react';
import { Button, Tag } from 'antd';
import {
  CalendarOutlined,
  LeftOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import {
  mockScheduleList,
  mockDayList,
  mockApprovalList,
  mockComplianceList,
} from '../mock/data';
import { ScheduleItem, DayListItem, ApprovalItem, ComplianceItem } from '../types';

// Register AG Grid Community modules once
ModuleRegistry.registerModules([AllCommunityModule]);

// ── 1. 기준일 상세 일정 박스 (좌측 하단) ──
interface ScheduleBoxProps {
  selectedDay: number;
}

export const ScheduleGridBox: React.FC<ScheduleBoxProps> = ({ selectedDay }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'dept' | 'away'>('dept');

  const tabs = [
    { key: 'my', label: '나의일정', count: 0 },
    { key: 'dept', label: '부서일정', count: 1 },
    { key: 'work', label: '업무활동', count: 0 },
    { key: 'alert', label: '알림', count: 0 },
    { key: 'away', label: '자리비움', count: 1 },
    { key: 'reserve', label: '예약', count: 0 },
  ];

  const filteredData = mockScheduleList.filter((item) => {
    if (activeTab === 'dept') return item.category === '부서일정';
    if (activeTab === 'away') return item.category === '자리비움';
    return true;
  });

  const columnDefs: ColDef<ScheduleItem>[] = [
    {
      field: 'category',
      headerName: '분류',
      width: 90,
      cellRenderer: (params: any) => (
        <Tag color={params.value === '부서일정' ? 'blue' : 'default'} style={{ margin: 0 }}>
          {params.value}
        </Tag>
      ),
    },
    { field: 'title', headerName: '나의일정명', flex: 1, minWidth: 220 },
    { field: 'registrant', headerName: '등록자', width: 90 },
    { field: 'dueDate', headerName: '마감일', width: 140 },
    { field: 'processedDate', headerName: '처리일', width: 85 },
    {
      field: 'detail',
      headerName: '상세보기',
      width: 85,
      cellRenderer: () => (
        <Button size="small" type="link" style={{ padding: 0 }}>
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
      }}
    >
      {/* Box Header */}
      <div
        style={{
          padding: '7px 12px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#fafbfc',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ color: '#1e3a5f', fontWeight: 700, fontSize: 13 }}>
            ▶ 기준일 : 2026년 09월 {String(selectedDay).padStart(2, '0')}일
          </span>
        </div>
        <Button size="small" style={{ fontSize: 11, borderRadius: 3 }}>
          ↪ 등록 바로가기
        </Button>
      </div>

      {/* Sub Filter Tabs */}
      <div
        style={{
          display: 'flex',
          backgroundColor: '#f1f5f9',
          borderBottom: '1px solid #e2e8f0',
          padding: '4px 6px',
          gap: 4,
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
              }}
            >
              {tab.label} <span style={{ opacity: 0.9 }}>[{tab.count}]</span>
            </button>
          );
        })}
      </div>

      {/* AG Grid Table */}
      <div className="ag-theme-alpine" style={{ height: 160, width: '100%' }}>
        <AgGridReact
          rowData={filteredData}
          columnDefs={columnDefs}
          headerHeight={30}
          rowHeight={30}
          defaultColDef={{ resizable: true, sortable: true }}
        />
      </div>
    </div>
  );
};

// ── 2. Day List 박스 (중앙 상단) ──
export const DayListBox: React.FC = () => {
  const [dayDate, setDayDate] = useState('2026-09-17');

  const columnDefs: ColDef<DayListItem>[] = [
    { field: 'workType', headerName: '업무구분', width: 95 },
    { field: 'regDueDate', headerName: '등록(마감)일', width: 110 },
    { field: 'title', headerName: '제목', flex: 1, minWidth: 200 },
    { field: 'completedDate', headerName: '처리(완료)일', width: 100 },
    { field: 'manager', headerName: '담당자', width: 100 },
    {
      field: 'detail',
      headerName: '상세보기',
      width: 85,
      cellRenderer: () => (
        <Button size="small" type="link" style={{ padding: 0 }}>
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
          <Button size="small" style={{ fontSize: 11, height: 24, borderRadius: 3 }}>
            새로고침
          </Button>
          <Button size="small" style={{ fontSize: 11, height: 24, borderRadius: 3 }}>
            바로가기
          </Button>
        </div>
      </div>

      <div className="ag-theme-alpine" style={{ height: 140, width: '100%' }}>
        <AgGridReact
          rowData={mockDayList}
          columnDefs={columnDefs}
          headerHeight={28}
          rowHeight={28}
          defaultColDef={{ resizable: true, sortable: true }}
        />
      </div>
    </div>
  );
};

// ── 3. 결재요청함 박스 (중앙 중간) ──
export const ApprovalGridBox: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'requested' | 'draft'>('requested');

  const tabs = [
    { key: 'pending', label: '미결함', count: 0 },
    { key: 'requested', label: '결재요청함 (완료/반려건은 최대 7일까지 표시)', count: 2 },
    { key: 'draft', label: '임시저장함', count: 0 },
  ];

  const columnDefs: ColDef<ApprovalItem>[] = [
    {
      field: 'status',
      headerName: '진행상태',
      width: 90,
      cellRenderer: (params: any) => (
        <Tag color={params.value === '결재대기' ? 'orange' : 'blue'} style={{ margin: 0 }}>
          {params.value}
        </Tag>
      ),
    },
    { field: 'regDate', headerName: '등록일', width: 100 },
    { field: 'title', headerName: '제목', flex: 1, minWidth: 220 },
    { field: 'applicant', headerName: '상신자', width: 100 },
    {
      field: 'detail',
      headerName: '상세보기',
      width: 85,
      cellRenderer: () => (
        <Button size="small" type="link" style={{ padding: 0 }}>
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
      }}
    >
      <div
        style={{
          display: 'flex',
          backgroundColor: '#f1f5f9',
          borderBottom: '1px solid #e2e8f0',
          padding: '4px 8px',
          gap: 6,
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
                padding: '3px 8px',
                fontSize: 11,
                fontWeight: isSelected ? 600 : 400,
                cursor: 'pointer',
              }}
            >
              {tab.label} <span style={{ opacity: 0.9 }}>[{tab.count}]</span>
            </button>
          );
        })}
      </div>

      <div className="ag-theme-alpine" style={{ height: 140, width: '100%' }}>
        <AgGridReact
          rowData={mockApprovalList}
          columnDefs={columnDefs}
          headerHeight={28}
          rowHeight={28}
          defaultColDef={{ resizable: true, sortable: true }}
        />
      </div>
    </div>
  );
};

// ── 4. 법규보고공시 및 내규정보 박스 (중앙 하단) ──
export const ComplianceGridBox: React.FC = () => {
  const columnDefs: ColDef<ComplianceItem>[] = [
    {
      field: 'category',
      headerName: '구분',
      width: 100,
      cellRenderer: (params: any) => (
        <Tag color="geekblue" style={{ margin: 0 }}>
          {params.value}
        </Tag>
      ),
    },
    { field: 'dueDate', headerName: '마감일', width: 100 },
    { field: 'title', headerName: '제목', flex: 1, minWidth: 240 },
    {
      field: 'detail',
      headerName: '상세보기',
      width: 85,
      cellRenderer: () => (
        <Button size="small" type="link" style={{ padding: 0 }}>
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
        }}
      >
        법규보고공시 및 내규정보
      </div>

      <div className="ag-theme-alpine" style={{ height: 140, width: '100%' }}>
        <AgGridReact
          rowData={mockComplianceList}
          columnDefs={columnDefs}
          headerHeight={28}
          rowHeight={28}
          defaultColDef={{ resizable: true, sortable: true }}
        />
      </div>
    </div>
  );
};
