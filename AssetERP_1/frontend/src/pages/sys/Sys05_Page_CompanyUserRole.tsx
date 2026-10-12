/**
 * 권한별 사원정보 (A05) — Sys05_Tab_CompanyUserRole 오른쪽.
 * AS-IS: myApp/client/vi/sys/Sys05_Page_CompanyUserRole.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 * 고른 회사의 권한그룹 사원(sys05_user_role)을 셀 편집 그리드(체크 다중)로 조회·등록·저장·삭제한다(sys admin).
 * A03 Sys05_Page_UserRole과 다른 점: retrieve(roleModel)로 companyId도 받고, 사원찾기를 open(companyId, …)로 연다.
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Space, Typography, Button as AntButton } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { CustomCellRendererProps } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import { sysApi } from '@/api/sys';
import { Role, UserRole } from '@/types/sys';
import { TransPerson } from '@/types/emp';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';
import { Emp01_Lookup_PersonModel } from '../emp/Emp01_Lookup_PersonModel';
import { Org00_Lookup_SelectSingle } from '../org/Org00_Lookup_SelectSingle';

const gb = gbFor<UserRole>();

/** AS-IS buildGrid() L111-132 (setChecked MULTI) */
const buildGrid = (lookupOrgInfo: (r: UserRole) => void): ColDef<UserRole>[] => [
  gb.text('orgNm', 160, '조직'),  // L116
  gb.text('titleNm', 100, '직책'),  // L117
  gb.text('empNo', 80, '사번'),  // L118
  gb.text('korNm', 80, '성명'),  // L119
  // L129 parentFullName + lookupOrgInfo(LookupTriggerField) — 아이콘으로 조직찾기. 보이는 값은 원본 그대로 orgInfoModel.parentFullName
  gb.text('parentFullNm', 200, '권한조직', {
    cellStyle: { color: '#1677ff' },
    cellRenderer: (p: CustomCellRendererProps<UserRole>) => (
      <Space size={4}>
        <AntButton type="text" size="small" icon={<SearchOutlined />}
          onClick={e => { e.stopPropagation(); if (p.data) lookupOrgInfo(p.data); }} />
        {p.value}
      </Space>
    ),
  }),
];

interface Props {
  /** AS-IS retrieve(Sys04_RoleModel) L152-165: roleId·companyId */
  roleModel?: Role;
}

export const Sys05_Page_CompanyUserRole: React.FC<Props> = ({ roleModel }) => {
  const roleId = roleModel?.roleId;
  const companyId = roleModel?.companyId;
  const [personOpen, setPersonOpen] = useState(false);
  const [orgTarget, setOrgTarget] = useState<UserRole>();

  const crud = useGridCrud<UserRole>({
    idField: 'userRoleId',
    // retrieve(roleModel) L152-165: roleId가 없으면 비운다, 있으면 서비스 sys.Sys05_UserRole.selectByRoleId(roleId)
    search: useCallback(async () => (roleId && companyId != null ? sysApi.searchCompanyUserRoles(companyId, roleId) : []), [roleId, companyId]),
    // update() L217-220: GridUpdate → sys.Sys05_UserRole.update
    save: useCallback((rows: UserRole[]) => sysApi.updateCompanyUserRoles(companyId!, rows), [companyId]),
    // deleteRow() L242-246: GridDeleteData → sys.Sys05_UserRole.delete(체크한 행)
    remove: useCallback((ids: number[]) => sysApi.deleteCompanyUserRoles(companyId!, ids), [companyId]),
    newRow: () => ({}),
    // deleteChk() L222-240
    deleteConfirm: '선택한 사원을 삭제하시겠습니까?',
  });

  // lookupOrgInfo() L93-108: 조직찾기 open(new Date()) → authOrgId·authOrgName만 바꾼다(보이는 권한조직 칸은 그대로 — 원본 그대로)
  const lookupOrgInfo = useCallback((r: UserRole) => setOrgTarget(r), []);

  const columnDefs = useMemo(() => buildGrid(lookupOrgInfo), [lookupOrgInfo]);

  // Sys05_Tab_CompanyUserRole.retrieveUserRole() → retrieve(roleModel)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (roleId) crud.retrieve(); else crud.clear(); }, [roleId, companyId]);

  // insertRow() L167-215 콜백: 고른 사원마다 행 추가. 초기 권한조직은 본인 부서
  const onPersons = (persons: TransPerson[]) => {
    if (!roleId) return;
    crud.addRows(persons.map(t => ({
      userId: t.personId,
      roleId,
      korNm: t.korNm,
      orgNm: t.orgNm,
      titleNm: t.titleNm,
      empNo: t.empNo,
      authOrgId: t.orgCodeId,
      authOrgNm: t.orgNm,
    })));
  };

  // [E0] 화면 열림 (생성자 L51-91)
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: '12px 12px 0 4px' }}>
      <Space>
        <Typography.Text strong>권한별 사원정보</Typography.Text>
        {/* [E1] retrieveButton[조회].Select (L53) → retrieve() */}
        <Button type="search" onClick={crud.retrieve} disabled={!roleId}>조회</Button>
        {/* [E2] insertButton[등록].Select (L60) → insertRow(): 사원찾기 open(companyId, …) */}
        <Button type="register" onClick={() => setPersonOpen(true)} disabled={!roleId}>등록</Button>
        {/* [E3] updateButton[저장].Select (L67) → update() */}
        <Button type="save" onClick={crud.saveRows}>저장</Button>
        {/* [E4] deleteButton[삭제].Select (L74) → deleteChk() → [E6] msgBox.DialogHide [YES] (L225) → deleteRow() */}
        <Button type="delete" onClick={crud.deleteChecked}>삭제</Button>
      </Space>
      <div style={{ flex: 1, minHeight: 0 }}>
        <CellEditGrid<UserRole> crud={crud} columnDefs={columnDefs} />
      </div>
      <Emp01_Lookup_PersonModel open={personOpen} companyId={companyId}
        onClose={() => setPersonOpen(false)} onSelect={onPersons} />
      {/* [E5] lookupOrgInfo.TriggerClick (L123) → lookupOrgInfo() */}
      <Org00_Lookup_SelectSingle
        baseDate={orgTarget ? dayjs().format('YYYY-MM-DD') : undefined}
        fixDate={false}
        onClose={() => setOrgTarget(undefined)}
        onSelect={org => orgTarget && crud.updateRow(orgTarget.userRoleId, { authOrgId: org.orgCodeId, authOrgNm: org.korNm })}
      />
    </div>
  );
};
