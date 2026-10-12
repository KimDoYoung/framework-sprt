/**
 * [1112] 기초자료 > 50. 권한 > 권한그룹 관리  (A02) — admin 회사 메뉴: 고른 고객사의 권한그룹을 관리한다
 * AS-IS: myApp/client/vi/sys/Sys04_Tab_RoleAdmin.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 * 레이아웃(생성자 L52-90, BorderLayout): north = 툴바(50), west = 고객 그리드(380, 분할), center = 권한 그리드
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Input, message, Space, Splitter, Typography } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import type { RowClickedEvent } from 'ag-grid-community';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { Company, Role } from '@/types/sys';
import { Button } from '@/components/button';
import { CellEditGrid, SingleGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';

const gbc = gbFor<Company>();
const gbr = gbFor<Role>();

/** AS-IS buildGridCompany() L136-144 */
const buildGridCompany = () => [
  gbc.text('companyNm', 200, '고객명'),  // L140
  gbc.text('locNm', 150, 'Sub-Domain'),  // L141
];

/** AS-IS buildGridRole() L146-159 — setChecked(MULTI), addBoolean은 클릭으로 값이 바뀐다(05 §6 체크박스 컬럼) */
const buildGridRole = () => [
  gbr.text('companyNm', 150, '고객명'),  // L151
  gbr.text('roleNm', 200, '권한명', { editor: 'text' }),  // L152
  gbr.text('seq', 70, '조회순서', { editor: 'text' }),  // L153
  gbr.boolean('defaultRole', 70, '기본권한', { editable: true }),  // L154
  gbr.boolean('adminYn', 70, '관리자권한', { editable: true }),  // L155
  gbr.text('note', 500, '권한설명', { editor: 'text' }),  // L156
];

export const Sys04_Tab_RoleAdmin: React.FC = () => {
  const companyGridRef = useRef<AgGridReact<Company>>(null);
  const [searchText, setSearchText] = useState('');
  const [companies, setCompanies] = useState<Company[]>([]);
  /** 권한 그리드에 불러온 고객사 (저장·삭제 대상 회사) */
  const roleCompanyId = useRef<number | undefined>(undefined);
  const companyColumnDefs = useMemo(buildGridCompany, []);
  const roleColumnDefs = useMemo(buildGridRole, []);

  const selectedCompanyId = () => companyGridRef.current?.api.getSelectedRows()[0]?.companyId;
  const targetCompanyId = () => (roleCompanyId.current ?? selectedCompanyId()) as number;

  const crud = useGridCrud<Role>({
    idField: 'roleId',
    // retrieveRole() L177-188: selectByName(roleName = '%', companyId)
    search: useCallback(
      () => (roleCompanyId.current == null ? Promise.resolve([]) : sysApi.searchCompanyRoles(roleCompanyId.current)), []),
    // update() L191-194: GridUpdate — 검사 없음
    save: useCallback((rows: Role[]) => sysApi.updateCompanyRoles(targetCompanyId(), rows), []),
    // deleteRow() L238-242: GridDeleteData — 체크한 행
    remove: useCallback((ids: number[]) => sysApi.deleteCompanyRoles(targetCompanyId(), ids), []),
    // insertRow() L197-209: 모델에 companyId만 넣는다(고객명은 저장 뒤 selectById로 채워짐)
    newRow: () => ({ companyId: selectedCompanyId(), roleNm: '' }),
    firstEditField: 'roleNm',
    // deleteChk() L211-235
    deleteConfirm: '선택한 권한그룹을 삭제하시겠습니까?',
  });

  // retrieveRole() L177-188: 선택한 고객사의 권한 조회
  const retrieveRole = (company?: Company) => {
    const companyId = company?.companyId ?? selectedCompanyId();
    if (companyId == null) {
      message.warning('고객사를 선택하세요');
      return;
    }
    roleCompanyId.current = companyId;
    crud.retrieve();
  };

  // retrieve() L162-175: sys.Sys01_Company.selectByName(useYn = true, companyName) → 콜백에서 첫 행 선택 + retrieveRole()
  const retrieve = useCallback(async () => {
    try {
      setCompanies(await sysApi.searchCompanies(searchText, true));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [searchText]);

  // retrieve() 콜백 L168-172: 첫 행이 있으면 select(0) → retrieveRole()
  const onCompanyDataUpdated = () => {
    const first = companyGridRef.current?.api.getDisplayedRowAtIndex(0);
    if (!first?.data) return;
    first.setSelected(true, true);
    retrieveRole(first.data);
  };

  const update = crud.saveRows;
  // insertRow() L197-209: 고객사를 고르지 않았으면 경고
  const insertRow = () => {
    if (selectedCompanyId() == null) {
      message.warning('고객사를 선택하세요');
      return;
    }
    crud.addRow();
  };
  // deleteChk() L211-235: 체크 없으면 경고, 있으면 확인 → [E7] YES → deleteRow() (useGridCrud 안)
  const deleteChk = () => {
    if ((crud.gridRef.current?.api.getSelectedRows().length ?? 0) === 0) {
      message.warning('삭제대상을 선택하세요');
      return;
    }
    crud.deleteChecked();
  };

  // [E0] 화면 열림 (생성자 L52-90) → setting(), retrieve()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { retrieve(); }, []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 12, background: '#fff' }}>
      <Space wrap>
        <Typography.Text strong>고객명</Typography.Text>
        {/* [E1] searchText.KeyPress [Enter] (L94) → retrieve() */}
        <Input style={{ width: 200 }} value={searchText} onChange={e => setSearchText(e.target.value)} onPressEnter={retrieve} />
        {/* [E3] retrieveButton[조회].Select (L110) → retrieve() */}
        <Button type="search" onClick={retrieve}>조회</Button>
        {/* [E4] updateButton[저장].Select (L116) → update() */}
        <Button type="save" onClick={update}>저장</Button>
        {/* [E5] insertButton[등록].Select (L122) → insertRow() */}
        <Button type="register" onClick={insertRow}>등록</Button>
        {/* [E6] deleteButton[삭제].Select (L128) → deleteChk() */}
        <Button type="delete" onClick={deleteChk}>삭제</Button>
      </Space>
      <Splitter style={{ flex: 1, minHeight: 0 }}>
        <Splitter.Panel defaultSize={380} min={200}>
          {/* [E2] gridCompany.RowClick (L103) → retrieveRole() — 같은 행을 다시 눌러도 다시 조회 */}
          <SingleGrid<Company>
            gridRef={companyGridRef}
            rowData={companies}
            columnDefs={companyColumnDefs}
            getRowId={p => String(p.data.companyId)}
            onRowDataUpdated={onCompanyDataUpdated}
            onRowClicked={(e: RowClickedEvent<Company>) => retrieveRole(e.data)}
          />
        </Splitter.Panel>
        <Splitter.Panel>
          <CellEditGrid<Role> crud={crud} columnDefs={roleColumnDefs} />
        </Splitter.Panel>
      </Splitter>
    </div>
  );
};
