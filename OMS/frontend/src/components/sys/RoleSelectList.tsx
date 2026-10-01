import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Input, Space, Typography, message } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import { sysApi } from '../../api/sys';
import { errorMessage } from '../../api/client';
import { Role } from '../../types/sys';

interface RoleSelectListProps {
  /** 선택한 권한그룹 (목록이 비면 undefined) */
  onSelect: (role: Role | undefined) => void;
}

/**
 * 권한그룹 선택 목록 — 권한 매핑 화면의 왼쪽(마스터). AS-IS Sys05_Tab_UserRole·Sys07_Tab_RoleMenu의
 * 권한명 검색 + 그리드(권한명·권한설명), 조회 후 첫 행 선택.
 */
export const RoleSelectList: React.FC<RoleSelectListProps> = ({ onSelect }) => {
  const gridRef = useRef<AgGridReact<Role>>(null);
  const [roleNm, setRoleNm] = useState('');
  const [rows, setRows] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);

  const retrieve = useCallback(async () => {
    setLoading(true);
    try {
      const data = await sysApi.searchRoles(roleNm);
      setRows(data);
      if (data.length === 0) onSelect(undefined);
    } catch (err) {
      message.error(errorMessage(err, '권한그룹 조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [roleNm, onSelect]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { retrieve(); }, []);

  const columnDefs = useMemo<ColDef<Role>[]>(() => [
    { field: 'roleNm', headerName: '권한명', width: 200 },
    { field: 'note', headerName: '권한설명', flex: 1, minWidth: 200 },
  ], []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Space wrap>
        <Typography.Text strong>권한명</Typography.Text>
        <Input style={{ width: 160 }} value={roleNm} allowClear onChange={e => setRoleNm(e.target.value)} onPressEnter={retrieve} />
        <Button type="primary" onClick={retrieve}>조회</Button>
      </Space>
      <div style={{ flex: 1, minHeight: 0 }}>
        <AgGridReact<Role>
          ref={gridRef}
          rowData={rows}
          loading={loading}
          columnDefs={columnDefs}
          getRowId={p => String(p.data.roleId)}
          rowSelection={{ mode: 'singleRow', checkboxes: false, enableClickSelection: true }}
          onRowDataUpdated={e => e.api.getDisplayedRowAtIndex(0)?.setSelected(true)}
          onSelectionChanged={e => { const r = e.api.getSelectedRows()[0]; if (r) onSelect(r); }}
        />
      </div>
    </div>
  );
};
