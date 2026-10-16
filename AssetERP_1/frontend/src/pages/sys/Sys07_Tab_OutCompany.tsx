/**
 * 목적지 회사 (A08) — Sys07_Tab_Company 아래(south). 체크한 회사가 복사 대상. 회사를 1개만 고르면 오른쪽 권한그룹 → 매뉴 트리를 볼 수 있다.
 * AS-IS: myApp/client/vi/sys/Sys07_Tab_OutCompany.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 * 레이아웃(생성자 L38-69): west = 회사명 툴바 + 회사 그리드(360, 분할 없음), center = Sys07_TabPage_Role
 * UX보강(10) B12-1: 회사명 툴바 = SearchBar(UX-01), 회사명은 원본에 Enter가 없어 antd Input + allowClear(UX-04).
 * 초기화(UX-02)는 조건이 1개라 없음(패널 폭 원본 360·425에서는 줄도 넘친다)
 */
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Input, message } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import type { SelectionChangedEvent } from 'ag-grid-community';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { Company } from '@/types/sys';
import { MultiGrid } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { buildCompanyGrid } from './Sys07_Tab_InCompany';
import { Sys07_TabPage_Role, Sys07_TabPage_RoleHandle } from './Sys07_TabPage_Role';

export interface Sys07_Tab_OutCompanyHandle {
  retrieve: () => void;
  getModels: () => Company[];
}

export const Sys07_Tab_OutCompany = forwardRef<Sys07_Tab_OutCompanyHandle>((_, ref) => {
  const gridRef = useRef<AgGridReact<Company>>(null);
  const roleRef = useRef<Sys07_TabPage_RoleHandle>(null);
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<Company[]>([]);
  const [roleEnabled, setRoleEnabled] = useState(true);
  const columnDefs = useMemo(buildCompanyGrid, []);

  // retrieve() L106-119: sys.Sys01_Company.selectByName('%' + 회사명 + '%', useYn 'true'). 체크가 풀린다(원본 replaceAll)
  const retrieve = async () => {
    try {
      setRows(await sysApi.searchCompanies(searchText, true));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  useImperativeHandle(ref, () => ({
    retrieve,
    getModels: () => gridRef.current?.api?.getSelectedRows() ?? [],  // L121-123
  }));

  // [E2] grid.RowClick (L79): 선택이 1개가 아니면 권한 패널 setEnabled(false), 1개면 enable + 권한 조회 + 매뉴 트리 비움
  const onRowClick = () => setTimeout(() => {
    const selected = gridRef.current?.api?.getSelectedRows() ?? [];
    if (selected.length !== 1) {
      setRoleEnabled(false);
    } else {
      setRoleEnabled(true);
      roleRef.current?.retrieve(selected[0].companyId);
      roleRef.current?.getTabPageMenu()?.retrieve(null, null);
    }
  });

  // [E0] 화면 열림 (생성자 L38-69) → settings(), retrieve()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { retrieve(); }, []);

  return (
    <div style={{ height: '100%', display: 'flex', border: '1px solid #d9d9d9', background: '#fff' }}>
      <div style={{ width: 360, flex: 'none', display: 'flex', flexDirection: 'column', borderRight: '1px solid #d9d9d9' }}>
        {/* [E1] retrieveButton[조회].Select (L73) → retrieve() */}
        <SearchBar style={{ height: 50, padding: '0 8px', flex: 'none' }} onSearch={retrieve}>
          <SearchBar.Field label="회사명">
            <Input style={{ width: 180 }} allowClear value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          {/* setChecked(MULTI) L100 — 행 클릭은 그 행만 선택, 체크박스는 여럿 (GXT CheckBoxSelectionModel) */}
          <MultiGrid<Company>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            rowSelection={{ mode: 'multiRow', checkboxes: true, headerCheckbox: true, enableClickSelection: true }}
            onRowClicked={onRowClick}
            // GXT는 체크박스 클릭도 RowClick이다 — AG Grid는 체크박스 클릭에 rowClicked가 없어 선택 변경(checkboxSelected)으로 받는다
            onSelectionChanged={(e: SelectionChangedEvent<Company>) => { if (e.source === 'checkboxSelected') onRowClick(); }}
          />
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <Sys07_TabPage_Role ref={roleRef} disabled={!roleEnabled} />
      </div>
    </div>
  );
});
