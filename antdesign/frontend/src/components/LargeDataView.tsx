import React, { useState, useMemo, useCallback, useRef } from 'react';
import { Card, Button, Input, Select, Tag, Space, Statistic, Row, Col, message } from 'antd';
import {
  DownloadOutlined,
  ReloadOutlined,
  SearchOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  DatabaseOutlined,
} from '@ant-design/icons';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { generateLargeAssetData } from '../mock/data';
import { LargeAssetItem } from '../types';

interface LargeDataViewProps {
  title?: string;
  menuCode?: string;
}

let cached10kStats: {
  total: number;
  totalPrice: string;
  normalCount: number;
  repairCount: number;
  discardCount: number;
} | null = null;

export const LargeDataView: React.FC<LargeDataViewProps> = ({
  title = '대용량 자산 마스터 관리 (AgGrid Community)',
  menuCode = '1701',
}) => {
  const gridRef = useRef<AgGridReact<LargeAssetItem>>(null);
  const [dataCount, setDataCount] = useState<number>(10000);
  const [rowData, setRowData] = useState<LargeAssetItem[]>(() => generateLargeAssetData(10000));
  const [quickFilterText, setQuickFilterText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const handleRegenerate = (count: number) => {
    setDataCount(count);
    const newData = generateLargeAssetData(count);
    setRowData(newData);
    message.success(`${count.toLocaleString()}건의 대용량 데이터가 AgGrid에 로드되었습니다.`);
  };

  const handleExportCsv = useCallback(() => {
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.exportDataAsCsv({
        fileName: `asset-master-${new Date().toISOString().slice(0, 10)}.csv`,
      });
      message.info('CSV 내보내기가 완료되었습니다.');
    }
  }, []);

  const stats = useMemo(() => {
    const total = rowData.length;
    if (total === 10000 && cached10kStats) {
      return cached10kStats;
    }
    let totalPrice = 0;
    let normalCount = 0;
    let repairCount = 0;
    let discardCount = 0;

    for (let i = 0; i < total; i++) {
      totalPrice += rowData[i].price;
      if (rowData[i].status === '정상') normalCount++;
      else if (rowData[i].status === '수리중') repairCount++;
      else if (rowData[i].status === '폐기예정') discardCount++;
    }

    const calculated = {
      total,
      totalPrice: (totalPrice / 100000000).toFixed(1), // 억원 단위
      normalCount,
      repairCount,
      discardCount,
    };
    if (total === 10000) {
      cached10kStats = calculated;
    }
    return calculated;
  }, [rowData]);

  const filteredRowData = useMemo(() => {
    if (selectedCategory === 'all') return rowData;
    return rowData.filter((item) => item.category === selectedCategory);
  }, [rowData, selectedCategory]);

  const columnDefs: ColDef<LargeAssetItem>[] = useMemo(
    () => [
      {
        field: 'id',
        headerName: 'No',
        width: 75,
        pinned: 'left',
        sortable: true,
      },
      {
        field: 'assetNo',
        headerName: '자산번호',
        width: 155,
        pinned: 'left',
        cellStyle: { fontFamily: 'monospace', fontWeight: 600 } as Record<string, string | number>,
        sortable: true,
        filter: true,
      },
      {
        field: 'name',
        headerName: '자산명 / 모델규격',
        width: 260,
        sortable: true,
        filter: true,
      },
      {
        field: 'category',
        headerName: '자산분류',
        width: 140,
        sortable: true,
        filter: true,
      },
      {
        field: 'dept',
        headerName: '관리부서',
        width: 120,
        sortable: true,
        filter: true,
      },
      {
        field: 'manager',
        headerName: '담당자',
        width: 100,
        sortable: true,
        filter: true,
      },
      {
        field: 'status',
        headerName: '상태',
        width: 110,
        sortable: true,
        filter: true,
        cellRenderer: (params: any) => {
          const status = params.value;
          let color = 'green';
          let icon = <CheckCircleOutlined />;
          if (status === '수리중') {
            color = 'warning';
            icon = <ExclamationCircleOutlined />;
          } else if (status === '폐기예정') {
            color = 'error';
            icon = <CloseCircleOutlined />;
          } else if (status === '대여중') {
            color = 'blue';
          }
          return (
            <Tag color={color} icon={icon} style={{ margin: 0 }}>
              {status}
            </Tag>
          );
        },
      },
      {
        field: 'price',
        headerName: '취득원가 (원)',
        width: 130,
        sortable: true,
        cellStyle: { textAlign: 'right', fontFamily: 'monospace' } as Record<string, string | number>,
        valueFormatter: (params) => (params.value ? params.value.toLocaleString() : '0'),
      },
      {
        field: 'acquireDate',
        headerName: '취득일자',
        width: 120,
        sortable: true,
        filter: true,
      },
      {
        field: 'location',
        headerName: '설치위치',
        width: 180,
        sortable: true,
      },
      {
        field: 'complianceChecked',
        headerName: '책무점검',
        width: 100,
        cellRenderer: (params: any) =>
          params.value ? (
            <Tag color="cyan">점검완료</Tag>
          ) : (
            <Tag color="default">미점검</Tag>
          ),
      },
    ],
    []
  );

  return (
    <div
      style={{
        padding: '10px 14px',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 0,
        gap: 8,
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      {/* ── Summary Stats Cards ── */}
      <Row gutter={8} style={{ flexShrink: 0 }}>
        <Col span={6}>
          <Card
            size="small"
            style={{ backgroundColor: '#f0f9ff', borderColor: '#bae6fd' }}
            bodyStyle={{ padding: '6px 12px' }}
          >
            <Statistic
              title={<span style={{ fontSize: 11, color: '#0369a1' }}>총 로드된 자산 건수 (AgGrid)</span>}
              value={stats.total}
              suffix="건"
              valueStyle={{ color: '#0284c7', fontSize: 17, fontWeight: 700 }}
              prefix={<DatabaseOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card
            size="small"
            style={{ backgroundColor: '#fdf4ff', borderColor: '#f5d0fe' }}
            bodyStyle={{ padding: '6px 12px' }}
          >
            <Statistic
              title={<span style={{ fontSize: 11, color: '#86198f' }}>총 자산 가액 (취득가 합산)</span>}
              value={stats.totalPrice}
              suffix="억원"
              valueStyle={{ color: '#c026d3', fontSize: 17, fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card
            size="small"
            style={{ backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }}
            bodyStyle={{ padding: '6px 12px' }}
          >
            <Statistic
              title={<span style={{ fontSize: 11, color: '#15803d' }}>정상 가동 자산</span>}
              value={stats.normalCount}
              suffix="건"
              valueStyle={{ color: '#16a34a', fontSize: 17, fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card
            size="small"
            style={{ backgroundColor: '#fffbeb', borderColor: '#fde68a' }}
            bodyStyle={{ padding: '6px 12px' }}
          >
            <Statistic
              title={<span style={{ fontSize: 11, color: '#b45309' }}>점검/수리/폐기 대상</span>}
              value={stats.repairCount + stats.discardCount}
              suffix="건"
              valueStyle={{ color: '#d97706', fontSize: 17, fontWeight: 700 }}
            />
          </Card>
        </Col>
      </Row>

      {/* ── Action Toolbar ── */}
      <Card
        size="small"
        bodyStyle={{ padding: '6px 12px' }}
        style={{
          flexShrink: 0,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>
              [{menuCode}] {title}
            </span>
            <Tag color="purple" style={{ margin: 0, fontSize: 10 }}>
              가상 스크롤 60fps
            </Tag>
          </div>

          <Space size={6} wrap>
            <Input
              placeholder="빠른 통합 검색 (자산번호, 이름...)"
              prefix={<SearchOutlined />}
              value={quickFilterText}
              onChange={(e) => setQuickFilterText(e.target.value)}
              style={{ width: 200, fontSize: 12 }}
              size="small"
              allowClear
            />

            <Select
              value={selectedCategory}
              onChange={setSelectedCategory}
              style={{ width: 125 }}
              size="small"
              options={[
                { value: 'all', label: '전체 분류' },
                { value: 'IT전산장비', label: 'IT전산장비' },
                { value: '네트워크서버', label: '네트워크서버' },
                { value: '사무가구', label: '사무가구' },
                { value: '소프트웨어라이선스', label: '소프트웨어' },
                { value: '업무용차량', label: '업무용차량' },
              ]}
            />

            <Button.Group size="small">
              <Button
                type={dataCount === 10000 ? 'primary' : 'default'}
                onClick={() => handleRegenerate(10000)}
                icon={<ReloadOutlined />}
              >
                1만 건
              </Button>
              <Button
                type={dataCount === 30000 ? 'primary' : 'default'}
                onClick={() => handleRegenerate(30000)}
              >
                3만 건
              </Button>
            </Button.Group>

            <Button size="small" icon={<DownloadOutlined />} onClick={handleExportCsv}>
              CSV
            </Button>
          </Space>
        </div>
      </Card>

      {/* ── AG Grid Table (Viewport Fitted, Pure Internal Virtual Scrolling) ── */}
      <div
        className="ag-theme-alpine"
        style={{
          flex: 1,
          minHeight: 0,
          width: '100%',
          height: '100%',
          borderRadius: 4,
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        }}
      >
        <AgGridReact<LargeAssetItem>
          ref={gridRef}
          rowData={filteredRowData}
          columnDefs={columnDefs}
          quickFilterText={quickFilterText}
          rowSelection="multiple"
          headerHeight={34}
          rowHeight={32}
          defaultColDef={{
            resizable: true,
            sortable: true,
            filter: true,
          }}
          pagination={false} // Virtual DOM scrolling for extreme performance!
        />
      </div>
    </div>
  );
};
