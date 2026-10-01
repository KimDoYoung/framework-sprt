import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Input, Space, Splitter, Typography, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import { sysApi } from '../../api/sys';
import { errorMessage } from '../../api/client';
import { Role, SysCompany, UserRole } from '../../types/sys';
import { useGridCrud } from '../../hooks/useGridCrud';
import { CompanyLookup } from '../../components/lookup/CompanyLookup';
import { PersonLookup } from '../../components/lookup/PersonLookup';
import { OrgLookup } from '../../components/lookup/OrgLookup';

const roleCols: ColDef<Role>[] = [
  { field: 'roleNm', headerName: '권한명', width: 150 },
  { field: 'defaultRole', headerName: '기본권한', width: 100, cellDataType: 'boolean' },
  { field: 'adminYn', headerName: '관리자권한', width: 100, cellDataType: 'boolean' },
  { field: 'note', headerName: '권한설명', flex: 1, minWidth: 200 },
];

/**
 * 고객사별 사용자권한그룹 관리 (AS-IS client/vi/sys/Sys05_Tab_CompanyUserRole + Sys05_Page_CompanyUserRole + Sys01_Lookup_SelectSingle).
 * KFS 관리자가 고객사를 골라(처음엔 비어 있음) 그 회사 권한그룹의 사원을 등록·삭제하고 권한조직을 바꾼다.
 */
export const Sys05CompanyUserRoleView: React.FC = () => {
  const [company, setCompany] = useState<SysCompany>();
  const [companyOpen, setCompanyOpen] = useState(false);
  const [roleNm, setRoleNm] = useState('');
  const [roles, setRoles] = useState<Role[]>([]);
  const [role, setRole] = useState<Role>();
  const [personOpen, setPersonOpen] = useState(false);
  const [orgTarget, setOrgTarget] = useState<number>();

  /** AS-IS retrieve(): 고객사의 권한그룹 (권한명 LIKE), 첫 행 선택 */
  const retrieveRoles = useCallback(async (target?: SysCompany) => {
    if (!target) {
      setRoles([]);
      return;
    }
    try {
      setRoles(await sysApi.searchCompanyRoles(target.companyId, roleNm));
    } catch (err) {
      message.error(errorMessage(err, '권한그룹 조회 실패'));
    }
  }, [roleNm]);

  const search = useCallback(
    async () => (company && role ? sysApi.searchCompanyUserRoles(company.companyId, role.roleId) : []),
    [company, role],
  );
  const save = useCallback((rows: UserRole[]) => sysApi.updateCompanyUserRoles(company!.companyId, rows), [company]);
  const remove = useCallback((ids: number[]) => sysApi.deleteCompanyUserRoles(company!.companyId, ids), [company]);
  const newRow = useCallback((): Partial<UserRole> => ({ roleId: role?.roleId ?? null }), [role]);

  const crud = useGridCrud<UserRole>({
    idField: 'userRoleId',
    search,
    save,
    remove,
    newRow,
    deleteConfirm: '선택한 사원을 삭제하시겠습니까?',
  });

  // 권한그룹을 고르면 사원 조회
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { crud.retrieve(); }, [role]);

  const userCols = useMemo<ColDef<UserRole>[]>(() => [
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
      <Splitter.Panel defaultSize="50%" min="30%" style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Space wrap>
          <Typography.Text strong>회사명</Typography.Text>
          <Input style={{ width: 150 }} readOnly value={company?.companyNm ?? ''} placeholder="고객사 선택"
            suffix={<SearchOutlined />} onClick={() => setCompanyOpen(true)} />
          <Typography.Text strong>권한명</Typography.Text>
          <Input style={{ width: 150 }} value={roleNm} allowClear
            onChange={e => setRoleNm(e.target.value)} onPressEnter={() => retrieveRoles(company)} />
          <Button type="primary" onClick={() => retrieveRoles(company)}>조회</Button>
        </Space>
        <div style={{ flex: 1, minHeight: 0 }}>
          <AgGridReact<Role> rowData={roles} columnDefs={roleCols} getRowId={p => String(p.data.roleId)}
            rowSelection={{ mode: 'singleRow', checkboxes: false, enableClickSelection: true }}
            onRowDataUpdated={e => { if (e.api.getDisplayedRowCount() === 0) setRole(undefined); else e.api.getDisplayedRowAtIndex(0)?.setSelected(true); }}
            onSelectionChanged={e => { const r = e.api.getSelectedRows()[0]; if (r) setRole(r); }} />
        </div>
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
          <AgGridReact<UserRole> ref={crud.gridRef} columnDefs={userCols} {...crud.gridProps} />
        </div>
      </Splitter.Panel>

      <CompanyLookup
        open={companyOpen}
        onCancel={() => setCompanyOpen(false)}
        onOk={list => {
          setCompanyOpen(false);
          const picked = list[0];
          setCompany(picked);
          setRole(undefined);
          retrieveRoles(picked);
        }}
      />
      <PersonLookup
        open={personOpen}
        companyId={company?.companyId}
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
        companyId={company?.companyId}
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
