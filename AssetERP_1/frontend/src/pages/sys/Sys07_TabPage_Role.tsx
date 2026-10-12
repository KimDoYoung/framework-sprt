/**
 * 회사별 권한그룹 (A08) — Sys07_Tab_InCompany / Sys07_Tab_OutCompany 오른쪽(center). 오른쪽에 매뉴 트리.
 * AS-IS: myApp/client/vi/sys/Sys07_TabPage_Role.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 * 레이아웃(생성자 L37-62): west = 권한명 툴바 + 권한 그리드(425, 분할 없음), center = Sys07_TapPage_Menu
 */
import { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Input, message, Space, Typography } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { Role } from '@/types/sys';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { Sys07_TapPage_Menu, Sys07_TapPage_MenuHandle } from './Sys07_TapPage_Menu';

const gb = gbFor<Role>();

export interface Sys07_TabPage_RoleHandle {
  retrieve: (companyId: number) => void;
  getModel: () => Role | undefined;
  getTabPageMenu: () => Sys07_TapPage_MenuHandle | null;
}

interface Props {
  /** setEnabled(false) — 목적지(Out)에서 회사를 1개가 아니게 고르면 */
  disabled?: boolean;
}

export const Sys07_TabPage_Role = forwardRef<Sys07_TabPage_RoleHandle, Props>(({ disabled }, ref) => {
  const gridRef = useRef<AgGridReact<Role>>(null);
  const menuRef = useRef<Sys07_TapPage_MenuHandle>(null);
  const companyId = useRef<number | null>(null);
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<Role[]>([]);

  // buildGrid() L84-94: setChecked(SINGLE)
  const columnDefs = useMemo(() => [
    gb.text('roleNm', 220, '권한명'),  // L90
    gb.booleanYn('defaultRole', 65, '기본권한'),  // L91
    gb.booleanYn('adminYn', 65, '관리자권한'),  // L92
  ], []);

  // retrieve(companyId) L102-114: selectByName('%' + 권한명 + '%', companyId). 원본 store.replaceAll처럼 선택이 풀린다(getRowId 없음)
  const retrieve = async (c: number) => {
    companyId.current = c;
    try {
      setRows(await sysApi.searchCompanyRoles(c, searchText));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // refresh() L96-100: companyId가 있을 때만
  const refresh = () => {
    if (companyId.current != null) retrieve(companyId.current);
  };

  useImperativeHandle(ref, () => ({
    retrieve,
    getModel: () => gridRef.current?.api?.getSelectedRows()[0],  // L116-118
    getTabPageMenu: () => menuRef.current,  // L120-122
  }));

  // [E2] grid.SelectionChanged [companyId != null] (L72) → tapPageMenu.retrieve(roleId, companyId)
  // 선택이 풀린 경우(다시 조회)는 원본이 NPE로 아무것도 안 한다 → 건너뜀
  const onSelect = (role: Role | undefined) => {
    if (companyId.current != null && role) menuRef.current?.retrieve(role.roleId, companyId.current);
  };

  // [E0] 화면 열림 (생성자 L37-62) → settings(), refresh() — companyId가 없으므로 조회하지 않음
  return (
    <div style={{ height: '100%', display: 'flex', minWidth: 0, opacity: disabled ? 0.5 : 1, pointerEvents: disabled ? 'none' : undefined }}>
      <div style={{ width: 425, flex: 'none', display: 'flex', flexDirection: 'column', borderRight: '1px solid #d9d9d9' }}>
        <Space style={{ height: 50, padding: '0 8px', flex: 'none' }}>
          <Typography.Text strong>권한명</Typography.Text>
          <Input style={{ width: 180 }} value={searchText} onChange={e => setSearchText(e.target.value)} />
          {/* [E1] retrieveButton[조회].Select (L66) → refresh() */}
          <Button type="search" onClick={refresh}>조회</Button>
        </Space>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<Role>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: true }}
            onSelect={onSelect}
          />
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <Sys07_TapPage_Menu ref={menuRef} />
      </div>
    </div>
  );
});
