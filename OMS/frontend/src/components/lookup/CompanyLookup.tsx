import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Input, Modal, Space, Typography, message } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import { sysApi } from '../../api/sys';
import { errorMessage } from '../../api/client';
import { SysCompany } from '../../types/sys';

interface CompanyLookupProps {
  open: boolean;
  onCancel: () => void;
  onOk: (companies: SysCompany[]) => void;
  /** 여러 회사 선택 (AS-IS Sys01_Lookup_SelectMulti) */
  multiple?: boolean;
}

/** 고객사 선택 팝업 (AS-IS Sys01_Lookup_SelectSingle / SelectMulti, sys01_company.selectByName). KFS 관리자 전용 */
export const CompanyLookup: React.FC<CompanyLookupProps> = ({ open, onCancel, onOk, multiple = false }) => {
  const gridRef = useRef<AgGridReact<SysCompany>>(null);
  const [text, setText] = useState('');
  const [rows, setRows] = useState<SysCompany[]>([]);

  const retrieve = useCallback(async () => {
    try {
      setRows(await sysApi.searchCompanies(text, 'true'));
    } catch (err) {
      message.error(errorMessage(err, '고객사 조회 실패'));
    }
  }, [text]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (open) retrieve(); }, [open]);

  const columnDefs = useMemo<ColDef<SysCompany>[]>(() => [
    { field: 'companyNm', headerName: '고객명', flex: 1 },
    { field: 'locNm', headerName: '고객코드', width: 110 },
  ], []);

  const handleOk = () => {
    const selected = gridRef.current?.api?.getSelectedRows() ?? [];
    if (selected.length === 0) {
      message.warning('고객사를 선택하세요.');
      return;
    }
    onOk(selected);
  };

  return (
    <Modal open={open} title="고객사 선택" width={480} onOk={handleOk} onCancel={onCancel} okText="확인" cancelText="닫기" destroyOnClose>
      <Space style={{ marginBottom: 8 }}>
        <Typography.Text strong>고객명</Typography.Text>
        <Input style={{ width: 180 }} value={text} onChange={e => setText(e.target.value)} onPressEnter={retrieve} allowClear />
        <Button type="primary" onClick={retrieve}>조회</Button>
      </Space>
      <div style={{ height: 380 }}>
        <AgGridReact<SysCompany>
          ref={gridRef}
          rowData={rows}
          columnDefs={columnDefs}
          getRowId={p => String(p.data.companyId)}
          rowSelection={multiple
            ? { mode: 'multiRow', checkboxes: true, headerCheckbox: true }
            : { mode: 'singleRow', checkboxes: false, enableClickSelection: true }}
          onRowDoubleClicked={e => { if (!multiple && e.data) onOk([e.data]); }}
        />
      </div>
    </Modal>
  );
};
