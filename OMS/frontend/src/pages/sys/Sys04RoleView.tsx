import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Input, Space, Typography } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import { sysApi } from '../../api/sys';
import { Role } from '../../types/sys';
import { editableCol, useGridCrud } from '../../hooks/useGridCrud';

/** 권한그룹 관리 (AS-IS client/vi/sys/Sys04_Tab_Role) */
export const Sys04RoleView: React.FC = () => {
  const [roleNm, setRoleNm] = useState('');

  const search = useCallback(() => sysApi.searchRoles(roleNm), [roleNm]);
  const newRow = useCallback(
    (): Partial<Role> => ({ roleNm: '', seq: '', note: '', defaultRole: false, adminYn: false }),
    [],
  );
  // AS-IS update(): 기본권한은 1개만
  const validate = useCallback(
    (_changed: Role[], all: Role[]) =>
      all.filter(r => r.defaultRole).length > 1 ? '기본권한은 1개만 지정 가능합니다.' : undefined,
    [],
  );

  const crud = useGridCrud<Role>({
    idField: 'roleId',
    search,
    save: sysApi.updateRoles,
    remove: sysApi.deleteRoles,
    newRow,
    firstEditField: 'roleNm',
    validate,
    deleteConfirm: '선택한 권한을 삭제하시겠습니까?',
  });

  const columnDefs = useMemo<ColDef<Role>[]>(() => [
    editableCol<Role>({ field: 'roleNm', headerName: '*권한명', width: 200 }),
    editableCol<Role>({ field: 'seq', headerName: '조회순서', width: 90, cellStyle: { textAlign: 'center' } }),
    editableCol<Role>({ field: 'note', headerName: '권한설명', flex: 1, minWidth: 300 }),
  ], []);

  // 탭 진입 시 조회 (이후 조회는 버튼으로)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { crud.retrieve(); }, []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 12, background: '#fff' }}>
      <Space wrap>
        <Typography.Text strong>권한명</Typography.Text>
        <Input
          style={{ width: 200 }}
          value={roleNm}
          allowClear
          onChange={e => setRoleNm(e.target.value)}
          onPressEnter={crud.retrieve}
        />
        <Button type="primary" onClick={crud.retrieve}>조회</Button>
        <Button onClick={crud.saveRows}>저장</Button>
        <Button onClick={crud.addRow}>등록</Button>
        <Button danger onClick={crud.deleteChecked}>삭제</Button>
      </Space>
      <div style={{ flex: 1, minHeight: 0 }}>
        <AgGridReact<Role> ref={crud.gridRef} columnDefs={columnDefs} {...crud.gridProps} />
      </div>
    </div>
  );
};
