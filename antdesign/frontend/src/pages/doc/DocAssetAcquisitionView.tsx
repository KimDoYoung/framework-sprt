import React, { useState, useRef, useMemo, useCallback } from 'react';
import { Card, Button, Input, Tag, Space, message, Popconfirm, Badge, Modal, Form } from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  SaveOutlined,
  DeleteOutlined,
  ReloadOutlined,
  DownloadOutlined,
  LaptopOutlined,
} from '@ant-design/icons';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, RowSelectedEvent, CellValueChangedEvent } from 'ag-grid-community';
import { mockAssetAcqMasterList, mockAssetAcqDetailList } from '../../mock/data';
import { AssetAcqMasterItem, AssetAcqDetailItem } from '../../types';

export const DocAssetAcquisitionView: React.FC = () => {
  // 마스터 상태
  const masterGridRef = useRef<AgGridReact<AssetAcqMasterItem>>(null);
  const [masterData, setMasterData] = useState<AssetAcqMasterItem[]>(() => [...mockAssetAcqMasterList]);
  const [selectedMasterId, setSelectedMasterId] = useState<string>('acq-m1');
  const [masterQuickFilter, setMasterQuickFilter] = useState('');
  const [isMasterModalOpen, setIsMasterModalOpen] = useState(false);
  const [masterForm] = Form.useForm();

  // 디테일 상태
  const detailGridRef = useRef<AgGridReact<AssetAcqDetailItem>>(null);
  const [detailData, setDetailData] = useState<AssetAcqDetailItem[]>(() => [...mockAssetAcqDetailList]);
  const [detailQuickFilter, setDetailQuickFilter] = useState('');

  // 현재 선택된 마스터 품의 정보
  const selectedMaster = useMemo(() => {
    return masterData.find((m) => m.id === selectedMasterId) || masterData[0];
  }, [masterData, selectedMasterId]);

  // 현재 선택된 마스터에 종속된 디테일 자산 목록 (Master-Detail 연동)
  const currentDetailList = useMemo(() => {
    return detailData.filter((d) => d.masterId === selectedMaster?.id);
  }, [detailData, selectedMaster]);

  // 디테일 하단 실시간 Pinned Summary 행 (수량 합계 & 취득금액 합계)
  const detailPinnedBottomRowData = useMemo(() => {
    let totalQty = 0;
    let totalPriceSum = 0;
    for (const item of currentDetailList) {
      totalQty += Number(item.quantity || 0);
      totalPriceSum += Number(item.totalPrice || 0);
    }
    return [
      {
        id: 'detail-pinned-summary',
        masterId: '',
        assetCode: '∑ 합계',
        category: '',
        name: `${currentDetailList.length}개 품목`,
        spec: '',
        quantity: totalQty,
        unitPrice: 0,
        totalPrice: totalPriceSum,
        location: '',
        targetUser: '',
        note: '',
      },
    ];
  }, [currentDetailList]);

  // ── [마스터 그리드 핸들러] ──
  // 1. 마스터 새로고침
  const handleMasterReload = () => {
    setMasterData([...mockAssetAcqMasterList]);
    setDetailData([...mockAssetAcqDetailList]);
    message.success('자산취득 품의 목록 및 상세 내역이 재조회되었습니다.');
  };

  // 2. 마스터 저장
  const handleMasterSave = () => {
    message.success('자산취득 품의 마스터 및 상세 자산 정보가 모두 저장되었습니다.');
  };

  // 3. 마스터 신규 등록 모달 열기
  const handleOpenMasterModal = () => {
    setIsMasterModalOpen(true);
  };

  // 4. 마스터 신규 등록 완료
  const handleCreateMaster = () => {
    masterForm.validateFields().then((values) => {
      const today = new Date().toISOString().slice(0, 10);
      const newId = `acq-m-${Date.now()}`;
      const newMaster: AssetAcqMasterItem = {
        id: newId,
        docNo: `ACQ-2026-${String(masterData.length + 1).padStart(4, '0')}`,
        reqDate: today,
        title: values.title,
        dept: values.dept || 'IT개발실',
        requester: values.requester || '김도영',
        totalBudget: 0,
        itemCount: 0,
        status: '작성중',
      };
      setMasterData((prev) => [newMaster, ...prev]);
      setSelectedMasterId(newId);
      setIsMasterModalOpen(false);
      masterForm.resetFields();
      message.success('신규 품의가 생성되었습니다. 우측에서 취득 대상 자산들을 등록하십시오.');
    });
  };

  // 5. 마스터 삭제
  const handleMasterDelete = () => {
    if (!selectedMaster) return;
    setMasterData((prev) => prev.filter((m) => m.id !== selectedMaster.id));
    setDetailData((prev) => prev.filter((d) => d.masterId !== selectedMaster.id));
    const nextMaster = masterData.find((m) => m.id !== selectedMaster.id);
    if (nextMaster) {
      setSelectedMasterId(nextMaster.id);
    }
    message.success(`[${selectedMaster.docNo}] 품의 및 관련 자산 목록이 삭제되었습니다.`);
  };

  // 마스터 행 선택 이벤트
  const handleMasterRowSelected = (event: RowSelectedEvent<AssetAcqMasterItem>) => {
    if (event.node.isSelected() && event.data) {
      setSelectedMasterId(event.data.id);
    }
  };

  // ── [디테일 그리드 핸들러] ──
  // 1. 디테일 신규 자산 행추가 (인라인 등록)
  const handleAddDetailRow = () => {
    if (!selectedMaster) {
      message.warning('먼저 좌측에서 품의서를 선택해 주세요.');
      return;
    }
    const newDetailId = `acq-d-${Date.now()}`;
    const newDetail: AssetAcqDetailItem = {
      id: newDetailId,
      masterId: selectedMaster.id,
      assetCode: `AST-${String(currentDetailList.length + 1).padStart(3, '0')}`,
      category: 'PC/노트북',
      name: '신규 취득 자산명 입력',
      spec: '상세 사양 입력',
      quantity: 1,
      unitPrice: 1500000,
      totalPrice: 1500000,
      location: '본사 8F',
      targetUser: '지정 담당자',
    };

    const nextDetailList = [newDetail, ...detailData];
    setDetailData(nextDetailList);

    // 마스터의 총예산 및 품목 수 실시간 동기화 업데이트!
    syncMasterWithDetails(selectedMaster.id, nextDetailList);
    message.info('취득 대상 자산 항목이 추가되었습니다. 인라인으로 바로 수정하세요.');
  };

  // 2. 디테일 선택 항목 삭제
  const handleDeleteSelectedDetails = () => {
    const selectedNodes = detailGridRef.current?.api?.getSelectedNodes();
    if (!selectedNodes || selectedNodes.length === 0) {
      message.warning('삭제할 자산 항목을 선택해 주세요.');
      return;
    }
    const delIds = new Set(selectedNodes.map((n) => n.data?.id));
    const nextDetailList = detailData.filter((d) => !delIds.has(d.id));
    setDetailData(nextDetailList);

    // 마스터 재계산 동기화
    if (selectedMaster) {
      syncMasterWithDetails(selectedMaster.id, nextDetailList);
    }
    message.success(`${selectedNodes.length}건의 자산 항목이 삭제되었습니다.`);
  };

  // 디테일 셀 인라인 편집 시 자동 금액 계산 (수량 * 단가) 및 마스터 자동 동기화
  const handleDetailCellValueChanged = (event: CellValueChangedEvent<AssetAcqDetailItem>) => {
    const field = event.colDef.field;
    const row = event.data;
    if (!row) return;

    if (field === 'quantity' || field === 'unitPrice') {
      const qty = Math.max(1, Number(row.quantity) || 1);
      const unit = Math.max(0, Number(row.unitPrice) || 0);
      row.quantity = qty;
      row.unitPrice = unit;
      row.totalPrice = qty * unit;
    }

    const nextDetailList = [...detailData];
    setDetailData(nextDetailList);
    if (selectedMaster) {
      syncMasterWithDetails(selectedMaster.id, nextDetailList);
    }
  };

  // 마스터 총예산 및 자산품목수 실시간 동기화 함수
  const syncMasterWithDetails = (mId: string, allDetails: AssetAcqDetailItem[]) => {
    const items = allDetails.filter((d) => d.masterId === mId);
    const sum = items.reduce((acc, cur) => acc + Number(cur.totalPrice || 0), 0);
    setMasterData((prev) =>
      prev.map((m) =>
        m.id === mId ? { ...m, totalBudget: sum, itemCount: items.length } : m
      )
    );
  };

  // 디테일 CSV 내보내기
  const handleExportDetailCsv = useCallback(() => {
    if (detailGridRef.current?.api) {
      detailGridRef.current.api.exportDataAsCsv({
        fileName: `자산취득상세내역_${selectedMaster?.docNo || 'EXPORT'}.csv`,
        exportedRows: 'all',
      });
      message.info('상세 자산 목록 CSV 내보내기가 완료되었습니다.');
    }
  }, [selectedMaster]);

  // ── 컬럼 정의 ──
  // 마스터 컬럼
  const masterColumnDefs: ColDef<AssetAcqMasterItem>[] = useMemo(
    () => [
      {
        field: 'docNo',
        headerName: '품의번호',
        width: 135,
        pinned: 'left',
        sortable: true,
        cellRenderer: (params: any) => (
          <span style={{ fontWeight: 600, color: '#1677ff' }}>{params.value}</span>
        ),
      },
      {
        field: 'reqDate',
        headerName: '기안일자',
        width: 105,
        sortable: true,
      },
      {
        field: 'title',
        headerName: '품의명',
        flex: 1,
        minWidth: 160,
        sortable: true,
        tooltipField: 'title',
        cellStyle: () => ({ fontWeight: 500 }),
      },
      {
        field: 'totalBudget',
        headerName: '총예산',
        width: 125,
        sortable: true,
        type: 'numericColumn',
        valueFormatter: (params: any) => `${Number(params.value || 0).toLocaleString()}원`,
        cellStyle: () => ({ textAlign: 'right', fontWeight: 700, color: '#059669' }),
      },
      {
        field: 'itemCount',
        headerName: '품목수',
        width: 75,
        sortable: true,
        cellStyle: () => ({ textAlign: 'center' }),
        valueFormatter: (params: any) => `${params.value}건`,
      },
      {
        field: 'status',
        headerName: '상태',
        width: 90,
        cellRenderer: (params: any) => {
          const s = params.value;
          const color = s === '집행완료' ? 'success' : s === '승인완료' ? 'blue' : s === '결재대기' ? 'warning' : 'default';
          return <Tag color={color} style={{ margin: 0, fontSize: 11 }}>{s}</Tag>;
        },
      },
    ],
    []
  );

  // 디테일 컬럼
  const detailColumnDefs: ColDef<AssetAcqDetailItem>[] = useMemo(
    () => [
      {
        field: 'assetCode',
        headerName: '자산코드',
        width: 90,
        pinned: 'left',
        checkboxSelection: (params: any) => !params.node.rowPinned,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        cellStyle: () => ({ textAlign: 'center', fontWeight: 600 }),
      },
      {
        field: 'category',
        headerName: '분류',
        width: 110,
        editable: (params: any) => !params.node.rowPinned,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
          values: ['IT서버', 'PC/노트북', '네트워크장비', '사무용기기', 'SW라이선스'],
        },
        cellRenderer: (params: any) => {
          if (params.node.rowPinned) return null;
          const cat = params.value;
          const color = cat === 'IT서버' ? 'geekblue' : cat === 'PC/노트북' ? 'blue' : cat === 'SW라이선스' ? 'purple' : 'default';
          return <Tag color={color} style={{ margin: 0, fontSize: 11 }}>{cat}</Tag>;
        },
      },
      {
        field: 'name',
        headerName: '취득 자산명 (인라인 편집)',
        flex: 1,
        minWidth: 170,
        editable: (params: any) => !params.node.rowPinned,
        sortable: true,
        cellRenderer: (params: any) => {
          if (params.node.rowPinned) return <strong>{params.value}</strong>;
          return <span style={{ fontWeight: 500 }}>{params.value}</span>;
        },
      },
      {
        field: 'spec',
        headerName: '모델명 / 상세 규격',
        width: 180,
        editable: (params: any) => !params.node.rowPinned,
        tooltipField: 'spec',
      },
      {
        field: 'quantity',
        headerName: '수량',
        width: 75,
        editable: (params: any) => !params.node.rowPinned,
        sortable: true,
        type: 'numericColumn',
        cellStyle: () => ({ textAlign: 'center' }),
      },
      {
        field: 'unitPrice',
        headerName: '단가 (원)',
        width: 115,
        editable: (params: any) => !params.node.rowPinned,
        sortable: true,
        type: 'numericColumn',
        valueFormatter: (params: any) => {
          if (params.node.rowPinned) return '';
          return `${Number(params.value || 0).toLocaleString()}원`;
        },
        cellStyle: () => ({ textAlign: 'right' }),
      },
      {
        field: 'totalPrice',
        headerName: '취득금액 (수량×단가)',
        width: 135,
        editable: false,
        sortable: true,
        type: 'numericColumn',
        valueFormatter: (params: any) => `${Number(params.value || 0).toLocaleString()}원`,
        cellStyle: (params: any): Record<string, string | number> => {
          if (params.node.rowPinned) {
            return { textAlign: 'right', fontWeight: 800, color: '#dc2626', fontSize: 12 };
          }
          return { textAlign: 'right', fontWeight: 700, color: '#1677ff' };
        },
      },
      {
        field: 'location',
        headerName: '설치/배치장소',
        width: 120,
        editable: (params: any) => !params.node.rowPinned,
      },
      {
        field: 'targetUser',
        headerName: '담당/사용자',
        width: 100,
        editable: (params: any) => !params.node.rowPinned,
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
      {/* ── 1. 통합 탑바 ── */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <LaptopOutlined style={{ color: '#0284c7', fontSize: 16 }} />
            <span style={{ fontSize: 14, fontWeight: 700, color: '#1e3a5f' }}>
              [1103] 자산 취득 품의서 (마스터-디테일 좌우 연동 그리드)
            </span>
            <Tag color="cyan" style={{ margin: 0, fontSize: 11 }}>
              마스터: {masterData.length}건 / 디테일 자산: {detailData.length}개
            </Tag>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#64748b' }}>
            <span>선택된 품의:</span>
            <Tag color="blue" style={{ margin: 0, fontSize: 12, fontWeight: 600 }}>
              {selectedMaster ? `${selectedMaster.docNo} - ${selectedMaster.title}` : '선택 없음'}
            </Tag>
          </div>
        </div>
      </Card>

      {/* ── 2. 좌우 2분할 마스터-디테일 본체 (사용법 3) ── */}
      <div style={{ flex: 1, display: 'flex', gap: 6, minHeight: 0, overflow: 'hidden' }}>
        {/* ── [좌측 마스터 영역 (46% 너비)]: 자산취득 품의 마스터 목록 ── */}
        <div
          style={{
            flex: '0 0 46%',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            minWidth: 360,
            overflow: 'hidden',
          }}
        >
          {/* 마스터 액션 바 (사용법 1: 조회, 저장, 등록, 삭제) */}
          <Card
            size="small"
            bodyStyle={{ padding: '6px 10px' }}
            style={{ flexShrink: 0, border: '1px solid #d9dfe8', borderRadius: 4 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontWeight: 700, fontSize: 12, color: '#1e3a5f' }}>
                  ▶ 품의 마스터
                </span>
                <Badge count={masterData.length} overflowCount={999} style={{ backgroundColor: '#1677ff' }} />
              </div>

              <Space size={4}>
                <Input
                  placeholder="품의명/번호 검색"
                  prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
                  value={masterQuickFilter}
                  onChange={(e) => setMasterQuickFilter(e.target.value)}
                  style={{ width: 130, fontSize: 11 }}
                  size="small"
                  allowClear
                />
                <Button size="small" icon={<ReloadOutlined />} onClick={handleMasterReload}>
                  조회
                </Button>
                <Button size="small" type="primary" icon={<SaveOutlined />} onClick={handleMasterSave} style={{ backgroundColor: '#1e3a5f' }}>
                  저장
                </Button>
                <Button size="small" type="primary" icon={<PlusOutlined />} onClick={handleOpenMasterModal} style={{ backgroundColor: '#2563eb' }}>
                  등록
                </Button>
                <Popconfirm title="선택한 품의를 삭제하시겠습니까?" okText="삭제" cancelText="취소" onConfirm={handleMasterDelete}>
                  <Button size="small" danger icon={<DeleteOutlined />}>
                    삭제
                  </Button>
                </Popconfirm>
              </Space>
            </div>
          </Card>

          {/* 마스터 AG Grid */}
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
            <AgGridReact<AssetAcqMasterItem>
              ref={masterGridRef}
              rowData={masterData}
              columnDefs={masterColumnDefs}
              quickFilterText={masterQuickFilter}
              rowSelection="single"
              headerHeight={34}
              rowHeight={32}
              defaultColDef={{
                resizable: true,
                sortable: true,
                filter: false,
                suppressHeaderMenuButton: true,
              }}
              pagination={false}
              onRowSelected={handleMasterRowSelected}
            />
          </div>
        </div>

        {/* ── [우측 디테일 영역 (54% 너비)]: 선택된 품의의 취득 자산 목록 ── */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            minWidth: 420,
            overflow: 'hidden',
          }}
        >
          {/* 디테일 액션 바 (사용법 1 스타일: 상세 추가, 삭제, 저장, CSV) */}
          <Card
            size="small"
            bodyStyle={{ padding: '6px 10px' }}
            style={{ flexShrink: 0, border: '1px solid #d9dfe8', borderRadius: 4 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, overflow: 'hidden' }}>
                <span style={{ fontWeight: 700, fontSize: 12, color: '#1e3a5f' }}>
                  ▶ 상세 취득 자산 목록
                </span>
                <Tag color="blue" style={{ margin: 0, fontSize: 11 }}>
                  {currentDetailList.length}건
                </Tag>
                <span style={{ fontSize: 11, color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  (품의: {selectedMaster?.docNo})
                </span>
              </div>

              <Space size={4}>
                <Input
                  placeholder="자산명/규격 검색"
                  prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
                  value={detailQuickFilter}
                  onChange={(e) => setDetailQuickFilter(e.target.value)}
                  style={{ width: 140, fontSize: 11 }}
                  size="small"
                  allowClear
                />
                <Button size="small" type="primary" icon={<PlusOutlined />} onClick={handleAddDetailRow} style={{ backgroundColor: '#2563eb' }}>
                  자산 추가
                </Button>
                <Popconfirm title="선택한 자산 항목을 삭제하시겠습니까?" okText="삭제" cancelText="취소" onConfirm={handleDeleteSelectedDetails}>
                  <Button size="small" danger icon={<DeleteOutlined />}>
                    자산 삭제
                  </Button>
                </Popconfirm>
                <Button size="small" type="primary" icon={<SaveOutlined />} onClick={handleMasterSave} style={{ backgroundColor: '#1e3a5f' }}>
                  저장
                </Button>
                <Button size="small" icon={<DownloadOutlined />} onClick={handleExportDetailCsv}>
                  CSV
                </Button>
              </Space>
            </div>
          </Card>

          {/* 디테일 AG Grid (인라인 편집 및 하단 Pinned 합계 행) */}
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
              .ag-theme-alpine .ag-row-pinned {
                background-color: #f8fafc !important;
                font-weight: 700 !important;
                border-top: 2px solid #cbd5e1 !important;
              }
            `}</style>
            <AgGridReact<AssetAcqDetailItem>
              ref={detailGridRef}
              rowData={currentDetailList}
              pinnedBottomRowData={detailPinnedBottomRowData}
              columnDefs={detailColumnDefs}
              quickFilterText={detailQuickFilter}
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
              onCellValueChanged={handleDetailCellValueChanged}
            />
          </div>
        </div>
      </div>

      {/* ── 3. 신규 자산취득품의 마스터 등록 모달 ── */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#1e3a5f' }}>
            <LaptopOutlined />
            <span>신규 자산 취득 품의서 등록</span>
          </div>
        }
        open={isMasterModalOpen}
        onCancel={() => {
          setIsMasterModalOpen(false);
          masterForm.resetFields();
        }}
        onOk={handleCreateMaster}
        okText="품의 등록"
        cancelText="취소"
        width={540}
      >
        <Form
          form={masterForm}
          layout="vertical"
          initialValues={{
            dept: 'IT개발실',
            requester: '김도영',
          }}
          style={{ marginTop: 12 }}
        >
          <Form.Item name="title" label="품의명" rules={[{ required: true, message: '품의명을 입력하세요.' }]}>
            <Input placeholder="예: 2026년 하반기 전산실 네트워크 스위치 및 방화벽 고도화의 건" />
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="dept" label="신청부서" rules={[{ required: true }]}>
              <Input disabled />
            </Form.Item>
            <Form.Item name="requester" label="기안자" rules={[{ required: true }]}>
              <Input disabled />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
};
