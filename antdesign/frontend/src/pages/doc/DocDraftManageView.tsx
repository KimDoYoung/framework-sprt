import React, { useState, useRef, useMemo, useCallback } from 'react';
import { Card, Button, Input, Select, Tag, Space, Modal, Form, message, Popconfirm, Badge } from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  DeleteOutlined,
  ReloadOutlined,
  DownloadOutlined,
  SendOutlined,
  FileTextOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, RowDoubleClickedEvent } from 'ag-grid-community';
import { mockDraftDocList } from '../../mock/data';
import { DraftDocItem } from '../../types';

export const DocDraftManageView: React.FC = () => {
  const gridRef = useRef<AgGridReact<DraftDocItem>>(null);
  const [rowData, setRowData] = useState<DraftDocItem[]>(() => [...mockDraftDocList]);
  const [quickFilterText, setQuickFilterText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailModalDoc, setDetailModalDoc] = useState<DraftDocItem | null>(null);
  const [form] = Form.useForm();

  // 통계 계산
  const stats = useMemo(() => {
    const total = rowData.length;
    const pending = rowData.filter((d) => d.status === '결재대기').length;
    const ongoing = rowData.filter((d) => d.status === '진행중').length;
    const approved = rowData.filter((d) => d.status === '승인완료').length;
    const rejected = rowData.filter((d) => d.status === '반려').length;
    const draft = rowData.filter((d) => d.status === '임시저장').length;
    return { total, pending, ongoing, approved, rejected, draft };
  }, [rowData]);

  // 필터링된 데이터
  const filteredData = useMemo(() => {
    return rowData.filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      if (selectedStatus !== 'all' && item.status !== selectedStatus) return false;
      return true;
    });
  }, [rowData, selectedCategory, selectedStatus]);

  // 새로고침 / 초기화
  const handleReload = () => {
    setRowData([...mockDraftDocList]);
    setQuickFilterText('');
    setSelectedCategory('all');
    setSelectedStatus('all');
    message.success('기안서 목록이 새로고침되었습니다.');
  };

  // CSV 내보내기 (AgGrid Community 내장 기능)
  const handleExportCsv = useCallback(() => {
    if (gridRef.current?.api) {
      gridRef.current.api.exportDataAsCsv({
        fileName: `일반기안서목록_${new Date().toISOString().slice(0, 10)}.csv`,
      });
      message.info('CSV 내보내기가 완료되었습니다.');
    }
  }, []);

  // 선택 행 일괄 삭제
  const handleDeleteSelected = () => {
    const selectedNodes = gridRef.current?.api?.getSelectedNodes();
    if (!selectedNodes || selectedNodes.length === 0) {
      message.warning('삭제할 문서를 선택해 주세요.');
      return;
    }
    const selectedIds = new Set(selectedNodes.map((n) => n.data?.id));
    setRowData((prev) => prev.filter((item) => !selectedIds.has(item.id)));
    message.success(`${selectedNodes.length}건의 기안서가 삭제되었습니다.`);
  };

  // 선택 행 일괄 결재상신 (임시저장 건 대상)
  const handleSubmitSelected = () => {
    const selectedNodes = gridRef.current?.api?.getSelectedNodes();
    if (!selectedNodes || selectedNodes.length === 0) {
      message.warning('상신할 문서를 선택해 주세요.');
      return;
    }
    const draftNodes = selectedNodes.filter((n) => n.data?.status === '임시저장');
    if (draftNodes.length === 0) {
      message.warning('선택한 문서 중 [임시저장] 상태인 문서가 없습니다.');
      return;
    }
    const draftIds = new Set(draftNodes.map((n) => n.data?.id));
    setRowData((prev) =>
      prev.map((item) =>
        draftIds.has(item.id)
          ? { ...item, status: '결재대기' as const, draftDate: new Date().toISOString().slice(0, 10) }
          : item
      )
    );
    message.success(`${draftNodes.length}건의 문서가 [결재대기] 상태로 일괄 상신되었습니다.`);
  };

  // 행 더블클릭 시 상세 모달 열기
  const handleRowDoubleClicked = (event: RowDoubleClickedEvent<DraftDocItem>) => {
    if (event.data) {
      setDetailModalDoc(event.data);
    }
  };

  // 신규 기안서 작성 제출
  const handleCreateDraft = (isDirectSubmit: boolean) => {
    form.validateFields().then((values) => {
      const now = new Date();
      const dateStr = now.toISOString().slice(0, 10);
      const newDoc: DraftDocItem = {
        id: `dft-${Date.now()}`,
        docNo: `DFT-2026-${String(rowData.length + 1).padStart(4, '0')}`,
        draftDate: dateStr,
        category: values.category,
        title: values.title,
        dept: values.dept || 'IT개발실',
        drafter: values.drafter || '김도영',
        status: isDirectSubmit ? '결재대기' : '임시저장',
        approvalDate: '-',
        isUrgent: values.isUrgent || false,
        retentionPeriod: values.retentionPeriod || '3년',
        content: values.content,
      };

      setRowData((prev) => [newDoc, ...prev]);
      setIsModalOpen(false);
      form.resetFields();
      message.success(
        isDirectSubmit ? '기안서가 [결재대기] 상태로 상신되었습니다.' : '기안서가 [임시저장]되었습니다.'
      );
    });
  };

  // AG Grid 컬럼 정의
  const columnDefs: ColDef<DraftDocItem>[] = useMemo(
    () => [
      {
        field: 'docNo',
        headerName: '문서번호',
        width: 150,
        pinned: 'left',
        checkboxSelection: true,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        cellRenderer: (params: any) => (
          <span style={{ fontWeight: 600, color: '#1677ff', cursor: 'pointer' }}>
            {params.value}
          </span>
        ),
      },
      {
        field: 'draftDate',
        headerName: '기안일자',
        width: 110,
        sortable: true,
      },
      {
        field: 'category',
        headerName: '문서분류',
        width: 100,
        sortable: true,
        cellRenderer: (params: any) => {
          const cat = params.value;
          const color =
            cat === '일반기안'
              ? 'blue'
              : cat === '업무협조'
              ? 'cyan'
              : cat === '규정개정'
              ? 'purple'
              : cat === '인사총무'
              ? 'geekblue'
              : 'default';
          return <Tag color={color} style={{ margin: 0, fontSize: 11 }}>{cat}</Tag>;
        },
      },
      {
        field: 'title',
        headerName: '기안제목 (더블클릭 시 상세조회)',
        flex: 1,
        minWidth: 260,
        sortable: true,
        tooltipField: 'title',
        cellRenderer: (params: any) => {
          const isUrgent = params.data?.isUrgent;
          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, overflow: 'hidden' }}>
              {isUrgent && (
                <Tag color="error" style={{ margin: 0, fontSize: 10, padding: '0 3px', lineHeight: '16px' }}>
                  긴급
                </Tag>
              )}
              <span style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {params.value}
              </span>
            </div>
          );
        },
      },
      {
        field: 'dept',
        headerName: '기안부서',
        width: 120,
        sortable: true,
      },
      {
        field: 'drafter',
        headerName: '기안자',
        width: 90,
        sortable: true,
        cellStyle: () => ({ textAlign: 'center' }),
      },
      {
        field: 'status',
        headerName: '결재상태',
        width: 100,
        sortable: true,
        cellRenderer: (params: any) => {
          const status = params.value;
          if (status === '승인완료') {
            return <Badge status="success" text={<span style={{ color: '#15803d', fontWeight: 600 }}>승인완료</span>} />;
          }
          if (status === '진행중') {
            return <Badge status="processing" text={<span style={{ color: '#1677ff', fontWeight: 600 }}>진행중</span>} />;
          }
          if (status === '결재대기') {
            return <Badge status="warning" text={<span style={{ color: '#d97706', fontWeight: 600 }}>결재대기</span>} />;
          }
          if (status === '반려') {
            return <Badge status="error" text={<span style={{ color: '#dc2626', fontWeight: 600 }}>반려</span>} />;
          }
          return <Badge status="default" text={<span style={{ color: '#64748b' }}>임시저장</span>} />;
        },
      },
      {
        field: 'retentionPeriod',
        headerName: '보존연한',
        width: 90,
        sortable: true,
        cellStyle: () => ({ textAlign: 'center' }),
      },
      {
        field: 'approvalDate',
        headerName: '최종결재일시',
        width: 140,
        sortable: true,
        cellStyle: () => ({ textAlign: 'center', color: '#64748b' }),
      },
      {
        headerName: '상세보기',
        width: 85,
        pinned: 'right',
        cellRenderer: (params: any) => (
          <Button
            size="small"
            type="link"
            icon={<EyeOutlined />}
            style={{ padding: 0, fontSize: 11 }}
            onClick={() => setDetailModalDoc(params.data)}
          >
            보기
          </Button>
        ),
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
      {/* ── 1. Header Toolbar (사용법 2: 검색조건 + 팝업 등록형) ── */}
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
          {/* 타이틀 및 상태 배지 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <FileTextOutlined style={{ color: '#1677ff', fontSize: 16 }} />
              <span style={{ fontSize: 14, fontWeight: 700, color: '#1e3a5f' }}>
                [1101] 일반 기안서 작성
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Tag color="blue" style={{ margin: 0, fontSize: 11 }}>전체 {stats.total}건</Tag>
              <Tag color="warning" style={{ margin: 0, fontSize: 11 }}>대기 {stats.pending}</Tag>
              <Tag color="processing" style={{ margin: 0, fontSize: 11 }}>진행 {stats.ongoing}</Tag>
              <Tag color="success" style={{ margin: 0, fontSize: 11 }}>승인 {stats.approved}</Tag>
              {stats.rejected > 0 && <Tag color="error" style={{ margin: 0, fontSize: 11 }}>반려 {stats.rejected}</Tag>}
            </div>
          </div>

          {/* 우측 검색 조건 및 4개 핵심 액션 버튼 */}
          <Space size={6} wrap>
            <Input
              placeholder="통합 검색 (문서번호, 제목, 기안자...)"
              prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
              value={quickFilterText}
              onChange={(e) => setQuickFilterText(e.target.value)}
              style={{ width: 220, fontSize: 12 }}
              size="small"
              allowClear
            />

            <Select
              value={selectedCategory}
              onChange={setSelectedCategory}
              style={{ width: 110 }}
              size="small"
              options={[
                { value: 'all', label: '전체 분류' },
                { value: '일반기안', label: '일반기안' },
                { value: '업무협조', label: '업무협조' },
                { value: '인사총무', label: '인사총무' },
                { value: '규정개정', label: '규정개정' },
                { value: '제휴제안', label: '제휴제안' },
              ]}
            />

            <Select
              value={selectedStatus}
              onChange={setSelectedStatus}
              style={{ width: 105 }}
              size="small"
              options={[
                { value: 'all', label: '전체 상태' },
                { value: '결재대기', label: '결재대기' },
                { value: '진행중', label: '진행중' },
                { value: '승인완료', label: '승인완료' },
                { value: '반려', label: '반려' },
                { value: '임시저장', label: '임시저장' },
              ]}
            />

            <Button
              size="small"
              icon={<ReloadOutlined />}
              onClick={handleReload}
              title="데이터 새로고침"
            >
              조회
            </Button>

            {/* 신규 등록 모달 열기 버튼 (사용법 2) */}
            <Button
              size="small"
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsModalOpen(true)}
              style={{ backgroundColor: '#1e3a5f' }}
            >
              신규 기안 등록
            </Button>

            {/* 선택 상신 */}
            <Button
              size="small"
              icon={<SendOutlined />}
              onClick={handleSubmitSelected}
            >
              결재 상신
            </Button>

            {/* 선택 삭제 (사용법 2) */}
            <Popconfirm
              title="선택한 기안서를 삭제하시겠습니까?"
              okText="삭제"
              cancelText="취소"
              onConfirm={handleDeleteSelected}
            >
              <Button size="small" danger icon={<DeleteOutlined />}>
                삭제
              </Button>
            </Popconfirm>

            {/* CSV 내보내기 */}
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

      {/* ── 2. AG Grid Viewport-Fitted Container (Virtual Scrolling) ── */}
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
        <AgGridReact<DraftDocItem>
          ref={gridRef}
          rowData={filteredData}
          columnDefs={columnDefs}
          quickFilterText={quickFilterText}
          rowSelection="multiple"
          headerHeight={34}
          rowHeight={33}
          defaultColDef={{
            resizable: true,
            sortable: true,
            filter: false,
            suppressHeaderMenuButton: true,
          }}
          pagination={false}
          onRowDoubleClicked={handleRowDoubleClicked}
        />
      </div>

      {/* ── 3. 신규 기안서 작성 팝업 모달 (사용법 2: 모달 팝업 등록형) ── */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#1e3a5f' }}>
            <FileTextOutlined />
            <span>신규 일반기안서 작성 및 상신</span>
          </div>
        }
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        width={680}
        footer={[
          <Button key="cancel" onClick={() => setIsModalOpen(false)}>
            닫기
          </Button>,
          <Button key="draft" onClick={() => handleCreateDraft(false)}>
            임시저장
          </Button>,
          <Button
            key="submit"
            type="primary"
            icon={<SendOutlined />}
            style={{ backgroundColor: '#1e3a5f' }}
            onClick={() => handleCreateDraft(true)}
          >
            결재 상신
          </Button>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            category: '일반기안',
            dept: 'IT개발실',
            drafter: '김도영',
            retentionPeriod: '3년',
            isUrgent: false,
          }}
          style={{ marginTop: 12 }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <Form.Item name="category" label="문서분류" rules={[{ required: true }]}>
              <Select
                options={[
                  { value: '일반기안', label: '일반기안' },
                  { value: '업무협조', label: '업무협조' },
                  { value: '인사총무', label: '인사총무' },
                  { value: '규정개정', label: '규정개정' },
                  { value: '제휴제안', label: '제휴제안' },
                ]}
              />
            </Form.Item>

            <Form.Item name="retentionPeriod" label="보존연한" rules={[{ required: true }]}>
              <Select
                options={[
                  { value: '1년', label: '1년' },
                  { value: '3년', label: '3년' },
                  { value: '5년', label: '5년' },
                  { value: '영구', label: '영구' },
                ]}
              />
            </Form.Item>

            <Form.Item name="isUrgent" label="긴급 결재" valuePropName="checked">
              <Select
                options={[
                  { value: false, label: '일반' },
                  { value: true, label: '긴급 결재 요망' },
                ]}
              />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="dept" label="기안부서" rules={[{ required: true }]}>
              <Input disabled />
            </Form.Item>
            <Form.Item name="drafter" label="기안자" rules={[{ required: true }]}>
              <Input disabled />
            </Form.Item>
          </div>

          <Form.Item
            name="title"
            label="기안 제목"
            rules={[{ required: true, message: '기안서 제목을 입력해 주세요.' }]}
          >
            <Input placeholder="예: [IT인프라] 2026년 하반기 클라우드 전환 전산장비 확충의 건" />
          </Form.Item>

          <Form.Item
            name="content"
            label="기안 내용 / 사유"
            rules={[{ required: true, message: '상세 기안 내용을 입력해 주세요.' }]}
          >
            <Input.TextArea
              rows={6}
              placeholder="1. 추진 배경 및 목적&#10;2. 주요 세부 실행 계획&#10;3. 기대 효과 및 소요 예산 등을 상세히 기술하십시오."
            />
          </Form.Item>

          {/* 결재선 프리뷰 박스 */}
          <div
            style={{
              padding: '8px 12px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 4,
              fontSize: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontWeight: 600, color: '#334155' }}>지정 결재선:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#64748b' }}>
              <span>[기안] 김도영 이사</span>
              <span>➔</span>
              <span>[1차 검토] 김승주 차장</span>
              <span>➔</span>
              <span>[최종 승인] 나필순 상무</span>
            </div>
          </div>
        </Form>
      </Modal>

      {/* ── 4. 기안서 상세 모달 ── */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <FileTextOutlined style={{ color: '#1677ff' }} />
            <span>기안서 상세 조회 - {detailModalDoc?.docNo}</span>
          </div>
        }
        open={Boolean(detailModalDoc)}
        onCancel={() => setDetailModalDoc(null)}
        footer={[
          <Button key="close" type="primary" onClick={() => setDetailModalDoc(null)}>
            확인
          </Button>,
        ]}
        width={650}
      >
        {detailModalDoc && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, backgroundColor: '#f8fafc', padding: 10, borderRadius: 4, fontSize: 12 }}>
              <div><strong>문서분류:</strong> {detailModalDoc.category}</div>
              <div><strong>기안일자:</strong> {detailModalDoc.draftDate}</div>
              <div><strong>보존연한:</strong> {detailModalDoc.retentionPeriod}</div>
              <div><strong>기안자:</strong> {detailModalDoc.drafter} ({detailModalDoc.dept})</div>
              <div><strong>결재상태:</strong> <Tag color="blue">{detailModalDoc.status}</Tag></div>
              <div><strong>최종결재:</strong> {detailModalDoc.approvalDate}</div>
            </div>

            <div>
              <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>기안 제목</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', padding: '6px 8px', backgroundColor: '#fafbfc', border: '1px solid #e2e8f0', borderRadius: 4 }}>
                {detailModalDoc.title}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>기안 본문 내용</div>
              <div style={{ minHeight: 120, padding: 12, backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 13, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                {detailModalDoc.content || '등록된 상세 본문 내용이 없습니다.'}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
