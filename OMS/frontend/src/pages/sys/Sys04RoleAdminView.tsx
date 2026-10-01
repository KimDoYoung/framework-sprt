import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Space, Splitter, Typography, message } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import { sysApi } from '../../api/sys';
import { Role, SysCompany } from '../../types/sys';
import { editableCol, useGridCrud } from '../../hooks/useGridCrud';
import { CompanySelectList } from '../../components/sys/CompanySelectList';

/**
 * 권한그룹 관리(기초자료) (AS-IS client/vi/sys/Sys04_Tab_RoleAdmin).
 * KFS 관리자가 고객사를 골라 그 회사의 권한그룹을 관리한다. Sys04_Tab_Role과 달리 기본권한·관리자권한도 편집한다.
 */
export const Sys04RoleAdminView: React.FC = () => {
  const [company, setCompany] = useState<SysCompany>();

  const search = useCallback(async () => (company ? sysApi.searchCompanyRoles(company.companyId) : []), [company]);
  const save = useCallback((rows: Role[]) => sysApi.updateCompanyRoles(company!.companyId, rows), [company]);
  const remove = useCallback((ids: number[]) => sysApi.deleteCompanyRoles(company!.companyId, ids), [company]);
  const newRow = useCallback(
    (): Partial<Role> => ({ roleNm: '', seq: '', note: '', companyId: company?.companyId ?? null,
      companyNm: company?.companyNm ?? null, defaultRole: false, adminYn: false }),
    [company],
  );

  const crud = useGridCrud<Role>({
    idField: 'roleId',
    search,
    save,
    remove,
    newRow,
    firstEditField: 'roleNm',
    deleteConfirm: '선택한 권한그룹을 삭제하시겠습니까?',
  });

  // 고객사를 고르면 권한그룹 조회
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { crud.retrieve(); }, [company]);

  const addRow = () => {
    if (!company) {
      message.warning('고객사를 선택하세요');
      return;
    }
    crud.addRow();
  };

  const columnDefs = useMemo<ColDef<Role>[]>(() => [
    { field: 'companyNm', headerName: '고객명', width: 150 },
    editableCol<Role>({ field: 'roleNm', headerName: '권한명', width: 200 }),
    editableCol<Role>({ field: 'seq', headerName: '조회순서', width: 90, cellStyle: { textAlign: 'center' } }),
    editableCol<Role>({ field: 'defaultRole', headerName: '기본권한', width: 90, cellDataType: 'boolean' }),
    editableCol<Role>({ field: 'adminYn', headerName: '관리자권한', width: 100, cellDataType: 'boolean' }),
    editableCol<Role>({ field: 'note', headerName: '권한설명', flex: 1, minWidth: 300 }),
  ], []);

  return (
    <Splitter style={{ height: '100%', background: '#fff' }}>
      <Splitter.Panel defaultSize={380} min={280} style={{ padding: 12 }}>
        <CompanySelectList onSelect={setCompany} />
      </Splitter.Panel>
      <Splitter.Panel style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Space wrap>
          <Typography.Text strong>권한그룹{company ? ` — ${company.companyNm}` : ''}</Typography.Text>
          <Button type="primary" onClick={crud.retrieve}>조회</Button>
          <Button onClick={crud.saveRows}>저장</Button>
          <Button onClick={addRow}>등록</Button>
          <Button danger onClick={crud.deleteChecked}>삭제</Button>
        </Space>
        <div style={{ flex: 1, minHeight: 0 }}>
          <AgGridReact<Role> ref={crud.gridRef} columnDefs={columnDefs} {...crud.gridProps} />
        </div>
      </Splitter.Panel>
    </Splitter>
  );
};
