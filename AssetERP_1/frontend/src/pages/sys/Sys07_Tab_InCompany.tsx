/**
 * 출발지 회사 (A08) — Sys07_Tab_Company 위(center). 오른쪽에 권한그룹 → 매뉴 트리.
 * AS-IS: myApp/client/vi/sys/Sys07_Tab_InCompany.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 * 레이아웃(생성자 L37-67): west = 회사명 툴바 + 회사 그리드(360, 분할 없음), center = Sys07_TabPage_Role
 */
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Input, message, Space, Typography } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { Company, Role, RoleMenuNode } from '@/types/sys';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { Sys07_TabPage_Role, Sys07_TabPage_RoleHandle } from './Sys07_TabPage_Role';

const gb = gbFor<Company>();

/** buildGrid() — In L87-96 / Out L95-104 같은 컬럼 */
export const buildCompanyGrid = () => [
  gb.text('companyNm', 180, '고객명'),
  gb.text('locNm', 105, 'Sub-Domain'),
];

export interface Sys07_Tab_InCompanyHandle {
  getCompanyModel: () => Company | undefined;
  getRoleModel: () => Role | undefined;
  getMenuModel: () => RoleMenuNode | undefined;
}

export const Sys07_Tab_InCompany = forwardRef<Sys07_Tab_InCompanyHandle>((_, ref) => {
  const gridRef = useRef<AgGridReact<Company>>(null);
  const roleRef = useRef<Sys07_TabPage_RoleHandle>(null);
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<Company[]>([]);
  const columnDefs = useMemo(buildCompanyGrid, []);

  // retrieve() L98-111: sys.Sys01_Company.selectByName('%' + 회사명 + '%', useYn 'true')
  const retrieve = async () => {
    try {
      setRows(await sysApi.searchCompanies(searchText, true));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  useImperativeHandle(ref, () => ({
    getCompanyModel: () => gridRef.current?.api?.getSelectedRows()[0],  // L113-115
    getRoleModel: () => roleRef.current?.getModel(),  // L117-119
    getMenuModel: () => roleRef.current?.getTabPageMenu()?.getModel(),  // L121-123
  }));

  // [E2] grid.RowClick (L77) → tapPageRole.retrieve(companyId), 매뉴 트리 비움(retrieve(null, null))
  const onRowClick = () => setTimeout(() => {
    const selectModel = gridRef.current?.api?.getSelectedRows()[0];
    if (!selectModel) return;
    roleRef.current?.retrieve(selectModel.companyId);
    roleRef.current?.getTabPageMenu()?.retrieve(null, null);
  });

  // [E0] 화면 열림 (생성자 L37-67) → settings(), retrieve()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { retrieve(); }, []);

  return (
    <div style={{ height: '100%', display: 'flex', border: '1px solid #d9d9d9', background: '#fff' }}>
      <div style={{ width: 360, flex: 'none', display: 'flex', flexDirection: 'column', borderRight: '1px solid #d9d9d9' }}>
        <Space style={{ height: 50, padding: '0 8px', flex: 'none' }}>
          <Typography.Text strong>회사명</Typography.Text>
          <Input style={{ width: 180 }} value={searchText} onChange={e => setSearchText(e.target.value)} />
          {/* [E1] retrieveButton[조회].Select (L71) → retrieve() */}
          <Button type="search" onClick={retrieve}>조회</Button>
        </Space>
        <div style={{ flex: 1, minHeight: 0 }}>
          {/* setChecked(SINGLE) L92 */}
          <SingleGrid<Company>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: true }}
            onRowClicked={onRowClick}
          />
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <Sys07_TabPage_Role ref={roleRef} />
      </div>
    </div>
  );
});
