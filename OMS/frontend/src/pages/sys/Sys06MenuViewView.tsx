import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Input, Space, Splitter, message } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import { sysApi } from '../../api/sys';
import { errorMessage } from '../../api/client';
import { CompanyUseMenu, Role, UserRole } from '../../types/sys';
import { useTreeGrid } from '../../hooks/useTreeGrid';

const roleCols: ColDef<Role>[] = [
  { field: 'roleNm', headerName: '권한명', width: 200 },
  { field: 'note', headerName: '권한설명', flex: 1, minWidth: 200 },
];

const userCols: ColDef<UserRole>[] = [
  { field: 'orgNm', headerName: '조직', flex: 1, minWidth: 160 },
  { field: 'titleNm', headerName: '직책', width: 100 },
  { field: 'empNo', headerName: '사번', width: 80 },
  { field: 'empKorNm', headerName: '성명', width: 80 },
];

/**
 * 메뉴별 그룹권한(View) (AS-IS client/vi/sys/Sys06_Tab_MenuView + Sys04_Page_RoleView + Sys05_Page_UserRoleView). 읽기 전용.
 * 메뉴 선택 → 그 메뉴 권한이 있는 권한그룹(첫 행 자동 선택) → 권한그룹의 사원.
 */
export const Sys06MenuViewView: React.FC = () => {
  const gridRef = useRef<AgGridReact<CompanyUseMenu>>(null);
  const [menus, setMenus] = useState<CompanyUseMenu[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [users, setUsers] = useState<UserRole[]>([]);
  const [findText, setFindText] = useState('');
  const [loading, setLoading] = useState(false);

  // AS-IS: 1차 메뉴를 펼친 상태로 연다
  const tree = useTreeGrid<CompanyUseMenu>({ gridRef, rows: menus, idField: 'menuId', parentField: 'parentId', levelField: 'level' });

  const retrieve = useCallback(async () => {
    setLoading(true);
    try {
      setMenus(await sysApi.searchCompanyUseMenus());
    } catch (err) {
      message.error(errorMessage(err, '메뉴 조회 실패'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { retrieve(); }, [retrieve]);

  const selectMenu = (menu?: CompanyUseMenu) => {
    setUsers([]);
    if (!menu) { setRoles([]); return; }
    sysApi.searchRolesByMenu(menu.menuId).then(setRoles).catch(err => message.error(errorMessage(err, '권한그룹 조회 실패')));
  };

  const selectRole = (role?: Role) => {
    if (!role) { setUsers([]); return; }
    sysApi.searchUserRoles(role.roleId).then(setUsers).catch(err => message.error(errorMessage(err, '사원 조회 실패')));
  };

  /** AS-IS search(): 모두 접고, 메뉴명에 글자가 있는 메뉴를 펼쳐 선택 */
  const find = () => {
    const api = gridRef.current?.api;
    if (!api) return;
    api.deselectAll();
    tree.collapseAll();
    const text = findText.trim();
    if (!text) return;
    const found = menus.filter(m => m.menuNoPlusNm.includes(text));
    found.forEach(m => tree.reveal(m.menuId));
    setTimeout(() => {
      const node = found.length > 0 ? api.getRowNode(String(found[0].menuId)) : undefined;
      if (node) {
        node.setSelected(true);
        if (node.rowIndex != null) api.ensureIndexVisible(node.rowIndex);
      }
    });
  };

  const menuCols = useMemo<ColDef<CompanyUseMenu>[]>(() => [
    tree.treeCol({ field: 'menuNoPlusNm', headerName: '메뉴명', flex: 1 }),
  ], [tree.treeCol]);

  return (
    <Splitter style={{ height: '100%', background: '#fff' }}>
      <Splitter.Panel defaultSize={500} min={300} style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Space wrap>
          <Input style={{ width: 150 }} placeholder="메뉴명" value={findText} allowClear
            onChange={e => setFindText(e.target.value)} onPressEnter={find} />
          <Button type="primary" onClick={find}>검색</Button>
          <Button onClick={tree.expandAll}>펼치기</Button>
          <Button onClick={tree.collapseAll}>감추기</Button>
        </Space>
        <div style={{ flex: 1, minHeight: 0 }}>
          <AgGridReact<CompanyUseMenu> ref={gridRef} rowData={menus} loading={loading} columnDefs={menuCols}
            getRowId={p => String(p.data.menuId)}
            rowSelection={{ mode: 'singleRow', checkboxes: false, enableClickSelection: true }}
            onSelectionChanged={e => selectMenu(e.api.getSelectedRows()[0])}
            {...tree.gridProps} />
        </div>
      </Splitter.Panel>
      <Splitter.Panel style={{ padding: 12 }}>
        <AgGridReact<Role> rowData={roles} columnDefs={roleCols} getRowId={p => String(p.data.roleId)}
          rowSelection={{ mode: 'singleRow', checkboxes: false, enableClickSelection: true }}
          onRowDataUpdated={e => { e.api.getDisplayedRowAtIndex(0)?.setSelected(true); if (roles.length === 0) setUsers([]); }}
          onSelectionChanged={e => selectRole(e.api.getSelectedRows()[0])} />
      </Splitter.Panel>
      <Splitter.Panel style={{ padding: 12 }}>
        <AgGridReact<UserRole> rowData={users} columnDefs={userCols} getRowId={p => String(p.data.userRoleId)} />
      </Splitter.Panel>
    </Splitter>
  );
};
