/**
 * [1070] 관리자 > 01. 화면권한관리 > 권한그룹별 메뉴 맵핑  (A06)
 * AS-IS: myApp/client/vi/sys/Sys07_Tab_RoleMenu.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 * 레이아웃(생성자 L35-69): 왼쪽(55%, 최대 1000, 분할) = 권한명 조회 + 권한 그리드, 가운데(45%) = 권한그룹별 매뉴 트리
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Input, message, Space, Splitter, Typography } from 'antd';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { Role } from '@/types/sys';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { Sys07_Tree_RoleMenu } from './Sys07_Tree_RoleMenu';

const gb = gbFor<Role>();

/** AS-IS buildGrid() L88-94 */
const buildGrid = () => [
  gb.text('roleNm', 200, '권한명'),  // L91
  gb.text('note', 550, '권한설명'),  // L92
];

export const Sys07_Tab_RoleMenu: React.FC = () => {
  const [roleName, setRoleName] = useState('');
  const [rows, setRows] = useState<Role[]>([]);
  const [roleId, setRoleId] = useState<number>();
  const columnDefs = useMemo(buildGrid, []);

  // retrieve() L96-101: 서비스 sys.Sys04_Role.selectByName('%' + roleName + '%', 로그인 회사)
  const retrieve = useCallback(async () => {
    try {
      setRows(await sysApi.searchRoles(roleName));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [roleName]);

  // [E0] 화면 열림 (생성자 L35-69) → settings(), retrieve()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { retrieve(); }, []);

  return (
    <Splitter style={{ height: '100%', background: '#fff' }}>
      <Splitter.Panel defaultSize="55%" max={1000} min={200}>
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: '12px 4px 0 12px' }}>
          <Space>
            <Typography.Text strong>권한명</Typography.Text>
            <Input style={{ width: 200 }} value={roleName} onChange={e => setRoleName(e.target.value)} />
            {/* [E1] retrieveButton[조회].Select (L73) → retrieve() */}
            <Button type="search" onClick={retrieve}>조회</Button>
          </Space>
          <div style={{ flex: 1, minHeight: 0 }}>
            {/* [E2] roleGrid.SelectionChanged (L79-85) → roleMenuTree.retrieve(roleId) */}
            <SingleGrid<Role>
              rowData={rows}
              columnDefs={columnDefs}
              getRowId={p => String(p.data.roleId)}
              onSelect={r => r && setRoleId(r.roleId)}
            />
          </div>
        </div>
      </Splitter.Panel>
      <Splitter.Panel max={1000}>
        <Sys07_Tree_RoleMenu roleId={roleId} />
      </Splitter.Panel>
    </Splitter>
  );
};
