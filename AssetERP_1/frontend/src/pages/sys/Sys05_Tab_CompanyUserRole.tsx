/**
 * [1307] 기초자료 > 50. 권한 > 고객사별 사용자권한그룹 관리  (A05) — admin 회사 메뉴(sys admin만)
 * AS-IS: myApp/client/vi/sys/Sys05_Tab_CompanyUserRole.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 * 레이아웃(생성자 L42-116): 왼쪽(55%, 최대 1000, 분할) = 회사명(트리거)·권한명 조회 + 권한 그리드, 가운데(45%) = 권한별 사원정보
 */
import React, { useMemo, useRef, useState } from 'react';
import { Input, message, Space, Splitter, Typography } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { AgGridReact } from 'ag-grid-react';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { Company, Role } from '@/types/sys';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { Sys01_Lookup_SelectSingle } from './Sys01_Lookup_SelectSingle';
import { Sys05_Page_CompanyUserRole } from './Sys05_Page_CompanyUserRole';

const gb = gbFor<Role>();

/** AS-IS buildGrid() L118-125 */
const buildGrid = () => [
  gb.text('roleNm', 150, '권한명'),  // L121
  gb.boolean('defaultRole', 100, '기본권한'),  // L122
  gb.boolean('adminYn', 100, '관리자권한'),  // L123
  gb.text('note', 550, '권한설명'),  // L124
];

export const Sys05_Tab_CompanyUserRole: React.FC = () => {
  const gridRef = useRef<AgGridReact<Role>>(null);
  const [companyName, setCompanyName] = useState('');
  const [companyId, setCompanyId] = useState<number>();
  const [roleName, setRoleName] = useState('');
  const [lookupOpen, setLookupOpen] = useState(false);
  const [rows, setRows] = useState<Role[]>([]);
  const [roleModel, setRoleModel] = useState<Role>();
  const columnDefs = useMemo(buildGrid, []);

  // retrieve() L135-147: 서비스 sys.Sys04_Role.selectByName('%' + roleName + '%', companyId) → 첫 행 선택
  // companyId 검사는 원본에도 없다 — 회사가 없으면 원본 SQL(company_id = null)처럼 0행
  const retrieve = async (companyId: number | undefined) => {
    if (companyId == null) {
      setRows([]);
      return;
    }
    try {
      setRows(await sysApi.searchCompanyRoles(companyId, roleName));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // Sys01_Lookup_SelectSingle 결과(L62-73) → 결과가 있으면 회사명·ID, 없으면(취소) 둘 다 비움 → 어느 쪽이든 retrieve()
  const onLookupResult = (resultModel: Company | null) => {
    setLookupOpen(false);
    setCompanyName(resultModel?.companyNm ?? '');
    setCompanyId(resultModel?.companyId);
    retrieve(resultModel?.companyId);
  };

  // retrieve() 콜백: grid.getSelectionModel().select(0) — rowData가 그리드에 반영된 뒤 첫 행 선택
  // 목록이 비면 오른쪽도 비운다 — 원본은 남겨 둠(A07 사용자 결정 2026-10-12과 같은 뜻: 회사가 바뀌거나 지워지면 하위 목록도 맞춰야 한다)
  const onRowDataUpdated = () => {
    const first = gridRef.current?.api.getDisplayedRowAtIndex(0);
    first?.setSelected(true, true);
    setRoleModel(first?.data);
  };

  // [E0] 화면 열림 (생성자 L42-116) — 처음 조회 없음(L115 주석)
  return (
    <>
      <Splitter style={{ height: '100%', background: '#fff' }}>
        <Splitter.Panel defaultSize="55%" max={1000} min={200}>
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: '12px 4px 0 12px', boxSizing: 'border-box' }}>
            <Space>
              <Typography.Text strong>회사명</Typography.Text>
              {/* [E2] companyName.TriggerClick (L56) → Sys01_Lookup_SelectSingle.open() — 입력은 편집 불가(L55) */}
              <Input style={{ width: 150, cursor: 'pointer' }} readOnly value={companyName}
                suffix={<SearchOutlined />} onClick={() => setLookupOpen(true)} />
              <Typography.Text strong>권한명</Typography.Text>
              <Input style={{ width: 100 }} value={roleName} onChange={e => setRoleName(e.target.value)} />
              {/* [E1] retrieveButton[조회].Select (L47) → retrieve() */}
              <Button type="search" onClick={() => retrieve(companyId)}>조회</Button>
            </Space>
            <div style={{ flex: 1, minHeight: 0 }}>
              {/* [E3] grid.SelectionChanged (L89) → retrieveUserRole() L128-133: 선택한 권한으로 오른쪽 조회 */}
              <SingleGrid<Role>
                gridRef={gridRef}
                rowData={rows}
                columnDefs={columnDefs}
                getRowId={p => String(p.data.roleId)}
                onSelect={r => r && setRoleModel(r)}
                onRowDataUpdated={onRowDataUpdated}
              />
            </div>
          </div>
        </Splitter.Panel>
        <Splitter.Panel max={1000}>
          <Sys05_Page_CompanyUserRole roleModel={roleModel} />
        </Splitter.Panel>
      </Splitter>
      <Sys01_Lookup_SelectSingle open={lookupOpen} onResult={onLookupResult} />
    </>
  );
};
