import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Input, Space, Typography, message } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import { sysApi } from '../../api/sys';
import { errorMessage } from '../../api/client';
import { SysCompany } from '../../types/sys';

interface CompanySelectListProps {
  onSelect: (company: SysCompany | undefined) => void;
}

/** 고객사 선택 목록 (AS-IS Sys03_Tab_CompanyMenu 왼쪽: 고객명 검색, 사용 고객사만, 첫 행 선택) */
export const CompanySelectList: React.FC<CompanySelectListProps> = ({ onSelect }) => {
  const [companyNm, setCompanyNm] = useState('');
  const [rows, setRows] = useState<SysCompany[]>([]);
  const [loading, setLoading] = useState(false);

  const retrieve = useCallback(async () => {
    setLoading(true);
    try {
      const data = await sysApi.searchCompanies(companyNm, 'true');
      setRows(data);
      if (data.length === 0) onSelect(undefined);
    } catch (err) {
      message.error(errorMessage(err, '고객사 조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [companyNm, onSelect]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { retrieve(); }, []);

  const columnDefs = useMemo<ColDef<SysCompany>[]>(() => [
    { field: 'companyNm', headerName: '고객명', flex: 1, minWidth: 160 },
    { field: 'locNm', headerName: '고객코드', width: 110 },
  ], []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Space wrap>
        <Typography.Text strong>고객명</Typography.Text>
        <Input style={{ width: 160 }} value={companyNm} allowClear onChange={e => setCompanyNm(e.target.value)} onPressEnter={retrieve} />
        <Button type="primary" onClick={retrieve}>조회</Button>
      </Space>
      <div style={{ flex: 1, minHeight: 0 }}>
        <AgGridReact<SysCompany>
          rowData={rows}
          loading={loading}
          columnDefs={columnDefs}
          getRowId={p => String(p.data.companyId)}
          rowSelection={{ mode: 'singleRow', checkboxes: false, enableClickSelection: true }}
          onRowDataUpdated={e => e.api.getDisplayedRowAtIndex(0)?.setSelected(true)}
          onSelectionChanged={e => { const r = e.api.getSelectedRows()[0]; if (r) onSelect(r); }}
        />
      </div>
    </div>
  );
};
