import React, { useState, useRef, useMemo, useCallback } from 'react';
import { Card, Button, Input, Tag, Space, message, Popconfirm, Statistic, Row, Col, Badge } from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  SaveOutlined,
  DeleteOutlined,
  ReloadOutlined,
  DownloadOutlined,
  DollarCircleOutlined,
  EditOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, CellValueChangedEvent } from 'ag-grid-community';
import { mockExpenseDocList } from '../../mock/data';
import { ExpenseDocItem } from '../../types';

export const DocExpenseManageView: React.FC = () => {
  const gridRef = useRef<AgGridReact<ExpenseDocItem>>(null);
  const [rowData, setRowData] = useState<ExpenseDocItem[]>(() => [...mockExpenseDocList]);
  const [quickFilterText, setQuickFilterText] = useState('');
  const [hasDirtyRows, setHasDirtyRows] = useState(false);

  // 상단 집계 통계
  const stats = useMemo(() => {
    let totalSupply = 0;
    let totalTax = 0;
    let totalSum = 0;
    for (const item of rowData) {
      totalSupply += Number(item.supplyAmount || 0);
      totalTax += Number(item.taxAmount || 0);
      totalSum += Number(item.totalAmount || 0);
    }
    return {
      count: rowData.length,
      totalSupply,
      totalTax,
      totalSum,
    };
  }, [rowData]);

  // AgGrid 하단 고정 집계 행 (Pinned Bottom Row Data: 실시간 합계 자동 계산)
  const pinnedBottomRowData = useMemo(() => {
    return [
      {
        id: 'pinned-summary',
        expenseDate: '',
        accountName: '【 총 합계 】',
        description: `총 ${stats.count}건 비용 집행`,
        merchant: '',
        supplyAmount: stats.totalSupply,
        taxAmount: stats.totalTax,
        totalAmount: stats.totalSum,
        paymentMethod: '' as any,
        evidenceStatus: '' as any,
        dept: '',
      },
    ];
  }, [stats]);

  // 1. [조회] 핸들러 (사용법 1)
  const handleReload = () => {
    setRowData([...mockExpenseDocList]);
    setHasDirtyRows(false);
    setQuickFilterText('');
    message.success('비용 품의서 데이터가 초기화 및 재조회되었습니다.');
  };

  // 2. [등록 / 행 추가] 핸들러 (사용법 1: 인라인 빈 행 생성 및 셀 편집 시작)
  const handleAddRow = () => {
    const today = new Date().toISOString().slice(0, 10);
    const newId = `exp-new-${Date.now()}`;
    const newRow: ExpenseDocItem = {
      id: newId,
      expenseDate: today,
      accountName: '지급수수료',
      description: '신규 비용 지출 내역을 입력하세요',
      merchant: '신규 거래처',
      supplyAmount: 100000,
      taxAmount: 10000,
      totalAmount: 110000,
      paymentMethod: '법인카드',
      evidenceStatus: '미첨부',
      dept: 'IT개발실',
      isDirty: true,
    };

    setRowData((prev) => [newRow, ...prev]);
    setHasDirtyRows(true);
    message.info('신규 비용 행이 최상단에 추가되었습니다. 각 셀을 더블클릭하여 바로 수정하십시오.');
  };

  // 3. [저장] 핸들러 (사용법 1: 인라인 변경사항 일괄 저장)
  const handleSave = () => {
    setRowData((prev) => prev.map((r) => ({ ...r, isDirty: false })));
    setHasDirtyRows(false);
    message.success(`총 ${rowData.length}건의 비용 품의 내역이 데이터베이스에 성공적으로 저장되었습니다.`);
  };

  // 4. [삭제] 핸들러 (사용법 1: 선택 행 삭제)
  const handleDeleteSelected = () => {
    const selectedNodes = gridRef.current?.api?.getSelectedNodes();
    if (!selectedNodes || selectedNodes.length === 0) {
      message.warning('삭제할 비용 항목을 선택해 주세요.');
      return;
    }
    const selectedIds = new Set(selectedNodes.map((n) => n.data?.id));
    setRowData((prev) => prev.filter((item) => !selectedIds.has(item.id)));
    setHasDirtyRows(true);
    message.success(`${selectedNodes.length}건의 항목이 삭제되었습니다. [저장]을 눌러 반영하십시오.`);
  };

  // 5. [CSV 내보내기]
  const handleExportCsv = useCallback(() => {
    if (gridRef.current?.api) {
      gridRef.current.api.exportDataAsCsv({
        fileName: `비용품의서내역_${new Date().toISOString().slice(0, 10)}.csv`,
        exportedRows: 'all',
      });
      message.info('CSV 내보내기가 완료되었습니다.');
    }
  }, []);

  // 셀 값 변경 시 자동 계산 (공급가액 변경 시 부가세 10% 및 합계 실시간 반영)
  const handleCellValueChanged = (event: CellValueChangedEvent<ExpenseDocItem>) => {
    const field = event.colDef.field;
    const row = event.data;
    if (!row) return;

    if (field === 'supplyAmount') {
      const supply = Math.max(0, Number(row.supplyAmount) || 0);
      const tax = Math.round(supply * 0.1);
      const total = supply + tax;

      row.supplyAmount = supply;
      row.taxAmount = tax;
      row.totalAmount = total;
    }
    row.isDirty = true;
    setHasDirtyRows(true);

    // 그리드 갱신
    setRowData((prev) => [...prev]);
  };

  // 컬럼 정의
  const columnDefs: ColDef<ExpenseDocItem>[] = useMemo(
    () => [
      {
        field: 'id',
        headerName: 'No',
        width: 60,
        pinned: 'left',
        checkboxSelection: (params: any) => !params.node.rowPinned,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        valueGetter: (params: any) => {
          if (params.node.rowPinned) return '∑';
          return (params.node.rowIndex ?? 0) + 1;
        },
        cellStyle: () => ({ textAlign: 'center' }),
      },
      {
        field: 'expenseDate',
        headerName: '집행일자',
        width: 120,
        editable: (params: any) => !params.node.rowPinned,
        sortable: true,
        cellClass: 'editable-cell',
      },
      {
        field: 'accountName',
        headerName: '계정과목 (선택)',
        width: 130,
        editable: (params: any) => !params.node.rowPinned,
        sortable: true,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
          values: ['지급수수료', '회의비', '도서인쇄비', '소모품비', '여비교통비', '교육훈련비', '복리후생비'],
        },
        cellClass: 'editable-cell',
        cellRenderer: (params: any) => {
          if (params.node.rowPinned) return <strong>{params.value}</strong>;
          return <span style={{ fontWeight: 600, color: '#1e3a5f' }}>{params.value}</span>;
        },
      },
      {
        field: 'description',
        headerName: '적요 / 상세 사용 내역 (인라인 입력)',
        flex: 1,
        minWidth: 240,
        editable: (params: any) => !params.node.rowPinned,
        sortable: true,
        cellClass: 'editable-cell',
        cellRenderer: (params: any) => {
          if (params.node.rowPinned) return <strong>{params.value}</strong>;
          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {params.data?.isDirty && (
                <Badge status="processing" title="수정됨 (미저장)" />
              )}
              <span>{params.value}</span>
            </div>
          );
        },
      },
      {
        field: 'merchant',
        headerName: '가맹점 / 거래처',
        width: 160,
        editable: (params: any) => !params.node.rowPinned,
        sortable: true,
        cellClass: 'editable-cell',
      },
      {
        field: 'supplyAmount',
        headerName: '공급가액 (원)',
        width: 130,
        editable: (params: any) => !params.node.rowPinned,
        sortable: true,
        type: 'numericColumn',
        cellClass: 'editable-cell',
        valueFormatter: (params: any) => {
          const val = params.value;
          return val != null ? `${Number(val).toLocaleString()}원` : '0원';
        },
        cellStyle: () => ({ textAlign: 'right' }),
      },
      {
        field: 'taxAmount',
        headerName: '부가세 (10%)',
        width: 110,
        editable: false,
        sortable: true,
        type: 'numericColumn',
        valueFormatter: (params: any) => {
          const val = params.value;
          return val != null ? `${Number(val).toLocaleString()}원` : '0원';
        },
        cellStyle: () => ({ textAlign: 'right', color: '#64748b' }),
      },
      {
        field: 'totalAmount',
        headerName: '합계금액 (원)',
        width: 140,
        editable: false,
        sortable: true,
        type: 'numericColumn',
        valueFormatter: (params: any) => {
          const val = params.value;
          return val != null ? `${Number(val).toLocaleString()}원` : '0원';
        },
        cellStyle: (params: any): Record<string, string | number> => {
          if (params.node.rowPinned) {
            return { textAlign: 'right', fontWeight: 800, color: '#dc2626', fontSize: 13 };
          }
          return { textAlign: 'right', fontWeight: 700, color: '#1677ff' };
        },
      },
      {
        field: 'paymentMethod',
        headerName: '결제수단',
        width: 110,
        editable: (params: any) => !params.node.rowPinned,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
          values: ['법인카드', '세금계산서', '개인카드', '현금영수증'],
        },
        cellClass: 'editable-cell',
        cellStyle: () => ({ textAlign: 'center' }),
      },
      {
        field: 'evidenceStatus',
        headerName: '증빙상태',
        width: 100,
        editable: (params: any) => !params.node.rowPinned,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
          values: ['첨부완료', '미첨부'],
        },
        cellClass: 'editable-cell',
        cellRenderer: (params: any) => {
          if (params.node.rowPinned) return null;
          const val = params.value;
          return (
            <Tag color={val === '첨부완료' ? 'success' : 'warning'} style={{ margin: 0, fontSize: 11 }}>
              {val}
            </Tag>
          );
        },
      },
      {
        field: 'dept',
        headerName: '귀속부서',
        width: 110,
        sortable: true,
        cellStyle: () => ({ textAlign: 'center' }),
      },
    ],
    []
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        boxSizing: 'border-box',
        backgroundColor: '#f0f2f5',
        padding: 6,
        gap: 6,
      }}
    >
      {/* ── 1. Header Toolbar (사용법 1: 조회 / 저장 / 등록 / 삭제 4대 버튼) ── */}
      <Card
        size="small"
        bodyStyle={{ padding: '8px 12px' }}
        style={{
          flexShrink: 0,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          borderRadius: 4,
          border: '1px solid #d9dfe8',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          {/* 좌측 타이틀 및 저장 상태 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <DollarCircleOutlined style={{ color: '#059669', fontSize: 16 }} />
              <span style={{ fontSize: 14, fontWeight: 700, color: '#1e3a5f' }}>
                [1102] 비용 품의서 작성 (인라인 편집 그리드)
              </span>
            </div>

            {hasDirtyRows ? (
              <Tag color="error" icon={<EditOutlined />} style={{ margin: 0, fontSize: 11 }}>
                수정된 내역 있음 (저장 필요)
              </Tag>
            ) : (
              <Tag color="success" icon={<CheckOutlined />} style={{ margin: 0, fontSize: 11 }}>
                모든 변경사항 저장됨
              </Tag>
            )}
          </div>

          {/* 우측 4대 핵심 버튼: 조회, 저장, 등록(행추가), 삭제 (사용법 1) */}
          <Space size={6} wrap>
            <Input
              placeholder="적요 / 계정과목 빠른 검색"
              prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
              value={quickFilterText}
              onChange={(e) => setQuickFilterText(e.target.value)}
              style={{ width: 180, fontSize: 12 }}
              size="small"
              allowClear
            />

            {/* 1. 조회 버튼 */}
            <Button
              size="small"
              icon={<ReloadOutlined />}
              onClick={handleReload}
              title="데이터 새로고침"
            >
              조회
            </Button>

            {/* 2. 저장 버튼 (사용법 1) */}
            <Button
              size="small"
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleSave}
              style={{ backgroundColor: hasDirtyRows ? '#16a34a' : '#1e3a5f' }}
            >
              저장
            </Button>

            {/* 3. 등록(행추가) 버튼 (사용법 1) */}
            <Button
              size="small"
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddRow}
              style={{ backgroundColor: '#2563eb' }}
            >
              등록 (행추가)
            </Button>

            {/* 4. 삭제 버튼 (사용법 1) */}
            <Popconfirm
              title="선택한 비용 항목을 삭제하시겠습니까?"
              okText="삭제"
              cancelText="취소"
              onConfirm={handleDeleteSelected}
            >
              <Button size="small" danger icon={<DeleteOutlined />}>
                삭제
              </Button>
            </Popconfirm>

            <Button
              size="small"
              icon={<DownloadOutlined />}
              onClick={handleExportCsv}
            >
              CSV
            </Button>
          </Space>
        </div>
      </Card>

      {/* ── 2. 비용 집계 통계 대시보드 바 ── */}
      <Row gutter={6} style={{ flexShrink: 0 }}>
        <Col span={6}>
          <Card size="small" bodyStyle={{ padding: '6px 12px' }} style={{ backgroundColor: '#ffffff', borderColor: '#d9dfe8' }}>
            <Statistic
              title={<span style={{ fontSize: 11, color: '#64748b' }}>비용 품의 총 건수</span>}
              value={stats.count}
              suffix="건"
              valueStyle={{ fontSize: 16, fontWeight: 700, color: '#1e293b' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small" bodyStyle={{ padding: '6px 12px' }} style={{ backgroundColor: '#ffffff', borderColor: '#d9dfe8' }}>
            <Statistic
              title={<span style={{ fontSize: 11, color: '#64748b' }}>공급가액 소계</span>}
              value={stats.totalSupply}
              suffix="원"
              valueStyle={{ fontSize: 16, fontWeight: 700, color: '#334155' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small" bodyStyle={{ padding: '6px 12px' }} style={{ backgroundColor: '#ffffff', borderColor: '#d9dfe8' }}>
            <Statistic
              title={<span style={{ fontSize: 11, color: '#64748b' }}>부가세 세액 합계</span>}
              value={stats.totalTax}
              suffix="원"
              valueStyle={{ fontSize: 16, fontWeight: 700, color: '#64748b' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small" bodyStyle={{ padding: '6px 12px' }} style={{ backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }}>
            <Statistic
              title={<span style={{ fontSize: 11, color: '#15803d', fontWeight: 600 }}>총 품의 집행금액 (합계)</span>}
              value={stats.totalSum}
              suffix="원"
              valueStyle={{ fontSize: 17, fontWeight: 800, color: '#16a34a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* ── 3. AG Grid Editable Table (Pinned Summary Row at Bottom) ── */}
      <div
        className="ag-theme-alpine"
        style={{
          flex: 1,
          minHeight: 0,
          width: '100%',
          backgroundColor: '#ffffff',
          borderRadius: 4,
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          border: '1px solid #d9dfe8',
        }}
      >
        <style>{`
          /* 인라인 편집 가능한 셀 커서 모양 */
          .ag-theme-alpine .editable-cell {
            cursor: cell;
          }
          .ag-theme-alpine .ag-row-pinned {
            background-color: #f1f5f9 !important;
            font-weight: 700 !important;
            border-top: 2px solid #94a3b8 !important;
          }
        `}</style>
        <AgGridReact<ExpenseDocItem>
          ref={gridRef}
          rowData={rowData}
          pinnedBottomRowData={pinnedBottomRowData}
          columnDefs={columnDefs}
          quickFilterText={quickFilterText}
          rowSelection="multiple"
          headerHeight={34}
          rowHeight={32}
          defaultColDef={{
            resizable: true,
            sortable: true,
            filter: false,
            suppressHeaderMenuButton: true,
          }}
          pagination={false}
          singleClickEdit={false}
          stopEditingWhenCellsLoseFocus={true}
          onCellValueChanged={handleCellValueChanged}
        />
      </div>
    </div>
  );
};
