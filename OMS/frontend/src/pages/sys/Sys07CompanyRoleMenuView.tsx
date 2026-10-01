import React, { useCallback, useState } from 'react';
import { Button, Input, Space, Splitter, Typography, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import { sysApi } from '../../api/sys';
import { errorMessage } from '../../api/client';
import { Role, RoleMenu, SysCompany } from '../../types/sys';
import { CompanyLookup } from '../../components/lookup/CompanyLookup';
import { MenuCheckTree } from '../../components/sys/MenuCheckTree';

const roleCols: ColDef<Role>[] = [
  { field: 'roleNm', headerName: '권한명', width: 150 },
  { field: 'defaultRole', headerName: '기본권한', width: 100, cellDataType: 'boolean' },
  { field: 'adminYn', headerName: '관리자권한', width: 100, cellDataType: 'boolean' },
  { field: 'note', headerName: '권한설명', flex: 1, minWidth: 200 },
];

/**
 * 고객사별 메뉴권한 관리 (AS-IS client/vi/sys/Sys07_Tab_CompanyRoleMenu + Sys07_Tree_CompanyRoleMenu + Sys01_Lookup_SelectSingle).
 * KFS 관리자가 고객사를 골라 그 회사 권한그룹의 메뉴 권한을 체크·저장한다. 체크 규칙은 Sys07_Tab_RoleMenu와 같다(MenuCheckTree).
 */
export const Sys07CompanyRoleMenuView: React.FC = () => {
  const [company, setCompany] = useState<SysCompany>();
  const [companyOpen, setCompanyOpen] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [role, setRole] = useState<Role>();

  /** AS-IS retrieve(): 회사의 권한그룹 (selectByCompanyId) */
  const retrieve = async (target = company) => {
    if (!target) {
      message.warning('회사명을 먼저 선택해주세요');
      return;
    }
    try {
      setRole(undefined);
      setRoles(await sysApi.searchCompanyRoles(target.companyId));
    } catch (err) {
      message.error(errorMessage(err, '권한그룹 조회 실패'));
    }
  };

  const load = useCallback(() => sysApi.searchCompanyRoleMenus(company!.companyId, role!.roleId), [company, role]);
  const save = useCallback(
    (changed: RoleMenu[]) => sysApi.updateCompanyRoleMenus(company!.companyId, role!.roleId, changed),
    [company, role],
  );

  return (
    <Splitter style={{ height: '100%', background: '#fff' }}>
      <Splitter.Panel defaultSize="45%" min="25%" style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Space wrap>
          <Typography.Text strong>회사명</Typography.Text>
          <Input style={{ width: 160 }} readOnly value={company?.companyNm ?? ''} placeholder="고객사 선택"
            suffix={<SearchOutlined />} onClick={() => setCompanyOpen(true)} />
          <Button type="primary" onClick={() => retrieve()}>조회</Button>
        </Space>
        <div style={{ flex: 1, minHeight: 0 }}>
          <AgGridReact<Role> rowData={roles} columnDefs={roleCols} getRowId={p => String(p.data.roleId)}
            rowSelection={{ mode: 'singleRow', checkboxes: false, enableClickSelection: true }}
            onSelectionChanged={e => setRole(e.api.getSelectedRows()[0])} />
        </div>
      </Splitter.Panel>
      <Splitter.Panel style={{ padding: 12 }}>
        <MenuCheckTree<RoleMenu>
          title={role ? `메뉴권한 — ${role.roleNm}` : '메뉴권한'}
          load={company && role ? load : undefined}
          save={save}
          nameField="menuNoPlusNm"
          checkField="roleMenuYn"
        />
      </Splitter.Panel>
      <CompanyLookup
        open={companyOpen}
        onCancel={() => setCompanyOpen(false)}
        onOk={list => {
          setCompanyOpen(false);
          setCompany(list[0]);
          retrieve(list[0]);
        }}
      />
    </Splitter>
  );
};
