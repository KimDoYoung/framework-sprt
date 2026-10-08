/**
 * [1071] 관리자 > 01. 화면권한관리 > 권한그룹별 사용자 맵핑  (A03)
 * AS-IS: myApp/client/vi/sys/Sys05_Tab_UserRole.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 * 레이아웃(생성자 L35-83): 왼쪽(55%, 최대 1000, 분할) = 권한명 조회 + 권한 그리드, 가운데(45%) = 권한별 사원정보(Sys05_Page_UserRole)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Input, message, Space, Splitter, Typography } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { Role } from '@/types/sys';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { Sys05_Page_UserRole } from './Sys05_Page_UserRole';

const gb = gbFor<Role>();

/** AS-IS buildGrid() L85-93 */
const buildGrid = () => [
  gb.text('roleNm', 200, '권한명'),  // L88
  gb.text('note', 550, '권한설명'),  // L91
];

export const Sys05_Tab_UserRole: React.FC = () => {
  const gridRef = useRef<AgGridReact<Role>>(null);
  const [roleName, setRoleName] = useState('');
  const [rows, setRows] = useState<Role[]>([]);
  const [roleId, setRoleId] = useState<number>();
  const columnDefs = useMemo(buildGrid, []);

  // retrieve() L102-114: 서비스 sys.Sys04_Role.selectByName('%' + roleName + '%', 로그인 회사) → 첫 행 선택
  const retrieve = useCallback(async () => {
    try {
      setRows(await sysApi.searchRoles(roleName));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [roleName]);

  // retrieve() 콜백: grid.getSelectionModel().select(0) — rowData가 그리드에 반영된 뒤 첫 행 선택
  const onRowDataUpdated = () => {
    const first = gridRef.current?.api.getDisplayedRowAtIndex(0);
    first?.setSelected(true, true);
    if (first?.data) setRoleId(first.data.roleId);
  };

  // [E0] 화면 열림 (생성자 L35-83) → retrieve()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { retrieve(); }, []);

  return (
    <Splitter style={{ height: '100%', background: '#fff' }}>
      <Splitter.Panel defaultSize="55%" max={1000} min={200}>
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: '12px 4px 0 12px' }}>
          <Space>
            <Typography.Text strong>권한명</Typography.Text>
            <Input style={{ width: 100 }} value={roleName} onChange={e => setRoleName(e.target.value)} />
            {/* [E1] retrieveButton[조회].Select (L40) → retrieve() */}
            <Button type="search" onClick={retrieve}>조회</Button>
          </Space>
          <div style={{ flex: 1, minHeight: 0 }}>
            {/* [E2] grid.SelectionChanged (L56) → retrieveUserRole() L95-100: 선택한 권한으로 오른쪽 조회 */}
            <SingleGrid<Role>
              gridRef={gridRef}
              rowData={rows}
              columnDefs={columnDefs}
              getRowId={p => String(p.data.roleId)}
              onSelect={r => r && setRoleId(r.roleId)}
              onRowDataUpdated={onRowDataUpdated}
            />
          </div>
        </div>
      </Splitter.Panel>
      <Splitter.Panel max={1000}>
        <Sys05_Page_UserRole roleId={roleId} />
      </Splitter.Panel>
    </Splitter>
  );
};
