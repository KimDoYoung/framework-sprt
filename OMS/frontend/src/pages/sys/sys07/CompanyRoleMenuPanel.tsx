import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Button, Input, Space, Splitter, Typography, message } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import { sysApi } from '../../../api/sys';
import { errorMessage } from '../../../api/client';
import { Role, RoleMenu, SysCompany } from '../../../types/sys';
import { useTreeGrid } from '../../../hooks/useTreeGrid';

/** 패널에서 고른 것: 회사(다중 체크면 체크한 회사들), 권한그룹, 메뉴 */
export interface CompanyRoleMenuSelection {
  company?: SysCompany;
  checkedCompanies: SysCompany[];
  role?: Role;
  menu?: RoleMenu;
}

export interface CompanyRoleMenuPanelHandle {
  /** 회사 목록 다시 조회 (복사 후) */
  reload: () => void;
}

interface Props {
  title: string;
  /** 대상 회사: 체크박스로 여러 회사 선택 (AS-IS Sys07_Tab_OutCompany) */
  multiple?: boolean;
  onChange: (sel: CompanyRoleMenuSelection) => void;
}

const companyCols: ColDef<SysCompany>[] = [
  { field: 'companyNm', headerName: '고객명', flex: 1, minWidth: 140 },
  { field: 'locNm', headerName: 'Sub-Domain', width: 105 },
];
const roleCols: ColDef<Role>[] = [
  { field: 'roleNm', headerName: '권한명', flex: 1, minWidth: 140 },
  { field: 'defaultRole', headerName: '기본권한', width: 80, cellDataType: 'boolean' },
  { field: 'adminYn', headerName: '관리자권한', width: 90, cellDataType: 'boolean' },
];

/**
 * 회사 → 권한그룹 → 메뉴 트리 (AS-IS Sys07_Tab_InCompany / Sys07_Tab_OutCompany + Sys07_TabPage_Role + Sys07_TapPage_Menu). 읽기 전용.
 * 회사 행을 누르면 그 회사의 권한그룹, 권한그룹을 고르면 메뉴 권한 트리를 보여준다.
 */
export const CompanyRoleMenuPanel = forwardRef<CompanyRoleMenuPanelHandle, Props>(({ title, multiple = false, onChange }, ref) => {
  const [companyNm, setCompanyNm] = useState('');
  const [companies, setCompanies] = useState<SysCompany[]>([]);
  const [company, setCompany] = useState<SysCompany>();
  const [checked, setChecked] = useState<SysCompany[]>([]);
  const [roleNm, setRoleNm] = useState('');
  const [roles, setRoles] = useState<Role[]>([]);
  const [role, setRole] = useState<Role>();
  const [menus, setMenus] = useState<RoleMenu[]>([]);
  const [menu, setMenu] = useState<RoleMenu>();
  const treeRef = useRef<AgGridReact<RoleMenu>>(null);
  const tree = useTreeGrid<RoleMenu>({ gridRef: treeRef, rows: menus, idField: 'menuId', parentField: 'parentId', levelField: 'level' });

  const retrieveCompanies = useCallback(async () => {
    try {
      setCompanies(await sysApi.searchCompanies(companyNm, 'true'));
      setChecked([]);
    } catch (err) {
      message.error(errorMessage(err, '고객사 조회 실패'));
    }
  }, [companyNm]);

  useImperativeHandle(ref, () => ({ reload: retrieveCompanies }), [retrieveCompanies]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { retrieveCompanies(); }, []);

  const retrieveRoles = useCallback(async () => {
    setMenus([]);
    setMenu(undefined);
    if (!company) { setRoles([]); setRole(undefined); return; }
    try {
      setRoles(await sysApi.searchCompanyRoles(company.companyId, roleNm));
    } catch (err) {
      message.error(errorMessage(err, '권한그룹 조회 실패'));
    }
  }, [company, roleNm]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { retrieveRoles(); }, [company]);

  const retrieveMenus = useCallback(async () => {
    setMenu(undefined);
    if (!company || !role) { setMenus([]); return; }
    try {
      setMenus(await sysApi.searchCompanyRoleMenus(company.companyId, role.roleId));
    } catch (err) {
      message.error(errorMessage(err, '메뉴 조회 실패'));
    }
  }, [company, role]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { retrieveMenus(); }, [role]);

  useEffect(() => { onChange({ company, checkedCompanies: checked, role, menu }); }, [company, checked, role, menu, onChange]);

  const menuCols = useMemo<ColDef<RoleMenu>[]>(() => [
    tree.treeCol({ field: 'menuNoPlusNm', headerName: '메뉴명', flex: 1, minWidth: 260 }),
    { field: 'roleMenuYn', headerName: '권한', width: 70, cellDataType: 'boolean' },
    { field: 'seq', headerName: '조회순서', width: 90 },
    { field: 'note', headerName: '메뉴설명', width: 200 },
  ], [tree.treeCol]);

  return (
    <Splitter style={{ height: '100%' }}>
      <Splitter.Panel defaultSize="24%" min="15%" style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Space wrap>
          <Typography.Text strong>{title}</Typography.Text>
          <Input style={{ width: 120 }} placeholder="회사명" value={companyNm} allowClear
            onChange={e => setCompanyNm(e.target.value)} onPressEnter={retrieveCompanies} />
          <Button onClick={retrieveCompanies}>조회</Button>
        </Space>
        <div style={{ flex: 1, minHeight: 0 }}>
          <AgGridReact<SysCompany> rowData={companies} columnDefs={companyCols} getRowId={p => String(p.data.companyId)}
            rowSelection={multiple
              ? { mode: 'multiRow', checkboxes: true, headerCheckbox: true, enableClickSelection: false }
              : { mode: 'singleRow', checkboxes: false, enableClickSelection: true }}
            onRowClicked={e => e.data && setCompany(e.data)}
            onSelectionChanged={e => { if (multiple) setChecked(e.api.getSelectedRows()); }} />
        </div>
      </Splitter.Panel>
      <Splitter.Panel defaultSize="30%" min="15%" style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Space wrap>
          <Typography.Text strong>권한그룹{company ? ` — ${company.companyNm}` : ''}</Typography.Text>
          <Input style={{ width: 120 }} placeholder="권한명" value={roleNm} allowClear
            onChange={e => setRoleNm(e.target.value)} onPressEnter={retrieveRoles} />
          <Button onClick={retrieveRoles}>조회</Button>
        </Space>
        <div style={{ flex: 1, minHeight: 0 }}>
          <AgGridReact<Role> rowData={roles} columnDefs={roleCols} getRowId={p => String(p.data.roleId)}
            rowSelection={{ mode: 'singleRow', checkboxes: false, enableClickSelection: true }}
            onRowDataUpdated={() => setRole(undefined)}
            onSelectionChanged={e => setRole(e.api.getSelectedRows()[0])} />
        </div>
      </Splitter.Panel>
      <Splitter.Panel style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Space wrap>
          <Typography.Text strong>메뉴권한{role ? ` — ${role.roleNm}` : ''}</Typography.Text>
          <Button onClick={retrieveMenus}>조회</Button>
          <Button onClick={tree.expandAll}>펼치기</Button>
          <Button onClick={tree.collapseAll}>감추기</Button>
        </Space>
        <div style={{ flex: 1, minHeight: 0 }}>
          <AgGridReact<RoleMenu> ref={treeRef} rowData={menus} columnDefs={menuCols} getRowId={p => String(p.data.menuId)}
            rowSelection={{ mode: 'singleRow', checkboxes: false, enableClickSelection: true }}
            onSelectionChanged={e => setMenu(e.api.getSelectedRows()[0])}
            {...tree.gridProps} />
        </div>
      </Splitter.Panel>
    </Splitter>
  );
});
CompanyRoleMenuPanel.displayName = 'CompanyRoleMenuPanel';
