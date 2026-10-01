import React, { useCallback, useState } from 'react';
import { Splitter } from 'antd';
import { sysApi } from '../../api/sys';
import { Role, RoleMenu } from '../../types/sys';
import { RoleSelectList } from '../../components/sys/RoleSelectList';
import { MenuCheckTree } from '../../components/sys/MenuCheckTree';

/** 권한그룹별 메뉴 맵핑 (AS-IS client/vi/sys/Sys07_Tab_RoleMenu + Sys07_Tree_RoleMenu) */
export const Sys07RoleMenuView: React.FC = () => {
  const [role, setRole] = useState<Role>();

  const load = useCallback(() => sysApi.searchRoleMenus(role!.roleId), [role]);
  const save = useCallback((changed: RoleMenu[]) => sysApi.updateRoleMenus(role!.roleId, changed), [role]);

  return (
    <Splitter style={{ height: '100%', background: '#fff' }}>
      <Splitter.Panel defaultSize="45%" min="25%" style={{ padding: 12 }}>
        <RoleSelectList onSelect={setRole} />
      </Splitter.Panel>
      <Splitter.Panel style={{ padding: 12 }}>
        <MenuCheckTree<RoleMenu>
          title="메뉴명"
          findable
          load={role ? load : undefined}
          save={save}
          nameField="menuNoPlusNm"
          checkField="roleMenuYn"
        />
      </Splitter.Panel>
    </Splitter>
  );
};
