import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Checkbox, Input, Modal, Space, Splitter, Typography, message } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import { sysApi } from '../../api/sys';
import { errorMessage } from '../../api/client';
import { CompanyDetail } from '../../types/sys';
import { CompanyCreateModal } from './sys01/CompanyCreateModal';
import { CompanyInfoTabs } from './sys01/CompanyInfoTabs';

const yn = (p: { value: boolean }) => (p.value ? 'Y' : 'N');

/** 고객별 시스템정보 관리 (AS-IS client/vi/sys/Sys01_Tab_Company). KFS 관리자 전용 */
export const Sys01CompanyView: React.FC = () => {
  const gridRef = useRef<AgGridReact<CompanyDetail>>(null);
  const [companyNm, setCompanyNm] = useState('');
  const [useOnly, setUseOnly] = useState(true);
  const [rows, setRows] = useState<CompanyDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<number>();
  const [createOpen, setCreateOpen] = useState(false);
  const selectAfterLoad = useRef<number | undefined>(undefined);

  const retrieve = useCallback(async () => {
    setLoading(true);
    try {
      setRows(await sysApi.searchCompanyDetails(companyNm, String(useOnly)));
    } catch (err) {
      message.error(errorMessage(err, '고객사 조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [companyNm, useOnly]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { retrieve(); }, []);

  const remove = () => {
    const checked = gridRef.current?.api?.getSelectedRows() ?? [];
    if (checked.length === 0) {
      message.warning('삭제할 고객사를 선택하세요.');
      return;
    }
    Modal.confirm({
      title: '삭제',
      content: '해당 고객사정보를 삭제하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      onOk: async () => {
        try {
          await sysApi.deleteCompanies(checked.map(c => c.companyId));
          setSelectedId(undefined);
          retrieve();
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  const columnDefs = useMemo<ColDef<CompanyDetail>[]>(() => [
    { field: 'loginSecureYn', headerName: '보안로그인', width: 100, valueFormatter: yn, cellStyle: { textAlign: 'center' } },
    { field: 'companyNm', headerName: '고객명', width: 200 },
    { field: 'locNm', headerName: 'Sub-Domain', width: 120, cellStyle: { textAlign: 'center' } },
    { field: 'icamCompanyCd', headerName: 'ICAM 운용사', width: 100, cellStyle: { textAlign: 'center' } },
    { field: 'icamAdvisCompanyCd', headerName: 'ICAM 자문사', width: 100, cellStyle: { textAlign: 'center' } },
    { field: 'useYn', headerName: '사용여부', width: 90, valueFormatter: yn, cellStyle: { textAlign: 'center' } },
    { field: 'note', headerName: '비고', width: 250 },
    { field: 'empInfo', headerName: '담당자(이름/부서/직책)', width: 170 },
    { field: 'officeTelNo', headerName: '대표전화', width: 120 },
    { field: 'emailAddr', headerName: '이메일주소', width: 160 },
    { field: 'startDate', headerName: '설립일', width: 110 },
    { field: 'closeDate', headerName: '계약종료일', width: 110 },
  ], []);

  return (
    <Splitter layout="vertical" style={{ height: '100%', background: '#fff' }}>
      <Splitter.Panel style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Space wrap style={{ justifyContent: 'space-between', width: '100%' }}>
          <Space wrap>
            <Typography.Text strong>고객명</Typography.Text>
            <Input style={{ width: 180 }} value={companyNm} allowClear onChange={e => setCompanyNm(e.target.value)} onPressEnter={retrieve} />
            <Checkbox checked={useOnly} onChange={e => setUseOnly(e.target.checked)}>사용고객만 보기</Checkbox>
            <Button type="primary" onClick={retrieve}>조회</Button>
            <Button onClick={() => setCreateOpen(true)}>등록</Button>
            <Button danger onClick={remove}>삭제</Button>
          </Space>
          <Typography.Text type="secondary">총 {rows.length} 건</Typography.Text>
        </Space>
        <div style={{ flex: 1, minHeight: 0 }}>
          <AgGridReact<CompanyDetail>
            ref={gridRef}
            rowData={rows}
            loading={loading}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.companyId)}
            rowSelection={{ mode: 'multiRow', checkboxes: true, headerCheckbox: false, enableClickSelection: false }}
            onRowClicked={e => setSelectedId(e.data?.companyId)}
            onRowDataUpdated={e => {
              if (selectAfterLoad.current != null) {
                const node = e.api.getRowNode(String(selectAfterLoad.current));
                if (node?.rowIndex != null) e.api.ensureIndexVisible(node.rowIndex);
                selectAfterLoad.current = undefined;
              }
            }}
          />
        </div>
      </Splitter.Panel>
      <Splitter.Panel defaultSize={360} min={240} style={{ padding: '0 12px 12px' }}>
        <CompanyInfoTabs
          companyId={selectedId}
          onSaved={c => setRows(prev => prev.map(r => (r.companyId === c.companyId ? c : r)))}
        />
      </Splitter.Panel>

      <CompanyCreateModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={c => {
          setCreateOpen(false);
          selectAfterLoad.current = c.companyId;
          setSelectedId(c.companyId);
          retrieve();
        }}
      />
    </Splitter>
  );
};
