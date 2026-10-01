import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Space, Splitter, Typography, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import { sysApi } from '../../api/sys';
import { Role, UserRole } from '../../types/sys';
import { useGridCrud } from '../../hooks/useGridCrud';
import { RoleSelectList } from '../../components/sys/RoleSelectList';
import { PersonLookup } from '../../components/lookup/PersonLookup';
import { OrgLookup } from '../../components/lookup/OrgLookup';

/** 권한그룹별 사용자 맵핑 (AS-IS client/vi/sys/Sys05_Tab_UserRole + Sys05_Page_UserRole) */
export const Sys05UserRoleView: React.FC = () => {
  const [role, setRole] = useState<Role>();
  const [personOpen, setPersonOpen] = useState(false);
  const [orgTarget, setOrgTarget] = useState<number>();

  const search = useCallback(async () => (role ? sysApi.searchUserRoles(role.roleId) : []), [role]);
  const newRow = useCallback((): Partial<UserRole> => ({ roleId: role?.roleId ?? null }), [role]);

  const crud = useGridCrud<UserRole>({
    idField: 'userRoleId',
    search,
    save: sysApi.updateUserRoles,
    remove: sysApi.deleteUserRoles,
    newRow,
    deleteConfirm: '선택한 사원을 삭제하시겠습니까?',
  });

  // 권한그룹을 고르면 사원 조회
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { crud.retrieve(); }, [role]);

  const columnDefs = useMemo<ColDef<UserRole>[]>(() => [
    { field: 'orgNm', headerName: '조직', width: 160 },
    { field: 'titleNm', headerName: '직책', width: 100 },
    { field: 'empNo', headerName: '사번', width: 80 },
    { field: 'empKorNm', headerName: '성명', width: 80 },
    {
      field: 'authOrgNm',
      headerName: '권한조직',
      flex: 1,
      minWidth: 200,
      cellStyle: { color: '#1677ff', cursor: 'pointer' },
      cellRenderer: (p: { value: string | null }) => <span>{p.value} <SearchOutlined style={{ color: '#8c8c8c' }} /></span>,
      onCellClicked: e => e.data && setOrgTarget(e.data.userRoleId),
    },
  ], []);

  const openPersonLookup = () => {
    if (!role) {
      message.warning('권한그룹을 선택하세요.');
      return;
    }
    setPersonOpen(true);
  };

  return (
    <Splitter style={{ height: '100%', background: '#fff' }}>
      <Splitter.Panel defaultSize="55%" min="25%" style={{ padding: 12 }}>
        <RoleSelectList onSelect={setRole} />
      </Splitter.Panel>
      <Splitter.Panel style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Space wrap>
          <Typography.Text strong>권한별 사원정보{role ? ` — ${role.roleNm}` : ''}</Typography.Text>
          <Button type="primary" onClick={crud.retrieve}>조회</Button>
          <Button onClick={openPersonLookup}>등록</Button>
          <Button onClick={crud.saveRows}>저장</Button>
          <Button danger onClick={crud.deleteChecked}>삭제</Button>
        </Space>
        <div style={{ flex: 1, minHeight: 0 }}>
          <AgGridReact<UserRole> ref={crud.gridRef} columnDefs={columnDefs} {...crud.gridProps} />
        </div>
      </Splitter.Panel>

      <PersonLookup
        open={personOpen}
        onCancel={() => setPersonOpen(false)}
        onOk={list => {
          setPersonOpen(false);
          // AS-IS: 권한조직 기본값은 사원의 현재 조직
          crud.addRows(list.map(t => ({
            userId: t.personId, roleId: role?.roleId ?? null, empNo: t.empNo, empKorNm: t.korNm,
            orgNm: t.orgKorNm, titleNm: t.titleNm, authOrgId: t.orgCodeId, authOrgNm: t.orgKorNm,
          })));
        }}
      />
      <OrgLookup
        open={orgTarget != null}
        title="권한조직 선택"
        onCancel={() => setOrgTarget(undefined)}
        onOk={org => {
          if (orgTarget != null) crud.updateRow(orgTarget, { authOrgId: org.orgCodeId, authOrgNm: org.korNm });
          setOrgTarget(undefined);
        }}
      />
    </Splitter>
  );
};
