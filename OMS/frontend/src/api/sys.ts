import { apiClient } from './client';
import { ApiResponse } from '../types/auth';
import { MenuLevel_1 } from '../types';
import {
  Code, CodeGroup, CodeKind, PersonMenu, CompanyDetail, CompanyMenu, CompanyUseMenu, MenuGuide, TopMenu, Calendar, FileUsage, FileUsagePeriod, TrashFile, CompanyMenuYn, CompanySave, LoginSecure, MenuCopy, MenuItem, MenuItemSave, Role, RoleMenu, RoleUser, SysCompany, UserRole,
} from '../types/sys';

/** GET /api/v1/sys/menus 응답 (1차 메뉴에는 아이콘이 없다 - sys06_menu에 아이콘 컬럼이 없음) */
type MenuLevel_1Res = Omit<MenuLevel_1, 'iconName'>;

// 1차 메뉴 아이콘: DB에 없으므로 순서대로 돌려 쓴다 (LeftMenuBar.renderIcon이 아는 이름)
const LEVEL_1_ICONS = [
  'FileTextOutlined',
  'AuditOutlined',
  'SafetyCertificateOutlined',
  'CalendarOutlined',
  'IdcardOutlined',
  'FormOutlined',
  'TeamOutlined',
  'AppstoreOutlined',
];

export const sysApi = {
  /** 로그인 사용자의 메뉴 트리 (회사관리자: 회사 메뉴 전체, 사원: 권한그룹 메뉴) */
  getMenus: async (): Promise<MenuLevel_1[]> => {
    const res = await apiClient.get<ApiResponse<MenuLevel_1Res[]>>('v1/sys/menus');
    return (res.data.data ?? []).map((m, i) => ({ ...m, iconName: LEVEL_1_ICONS[i % LEVEL_1_ICONS.length] }));
  },

  /** 권한그룹 목록 (로그인 회사, 권한명 LIKE) */
  searchRoles: async (roleNm?: string): Promise<Role[]> => {
    const res = await apiClient.get<ApiResponse<Role[]>>('v1/sys/roles', { params: { roleNm } });
    return res.data.data ?? [];
  },

  /** 추가·변경된 권한그룹 저장 → 저장된 행(요청 순서) */
  updateRoles: async (rows: Role[]): Promise<Role[]> => {
    const body = rows.map(({ roleId, roleNm, seq, note }) => ({ roleId, roleNm, seq, note }));
    const res = await apiClient.put<ApiResponse<Role[]>>('v1/sys/roles', body);
    return res.data.data ?? [];
  },

  deleteRoles: async (roleIds: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/sys/roles', { data: roleIds });
    return res.data.data ?? 0;
  },

  /** 메뉴를 쓸 수 있는 권한그룹 (로그인 회사) */
  searchRolesByMenu: async (menuId: number): Promise<Role[]> => {
    const res = await apiClient.get<ApiResponse<Role[]>>(`v1/sys/roles/menus/${menuId}`);
    return res.data.data ?? [];
  },

  /** 로그인 회사가 사용하는 메뉴 트리 (깊이 우선 + level) */
  searchCompanyUseMenus: async (): Promise<CompanyUseMenu[]> => {
    const res = await apiClient.get<ApiResponse<CompanyUseMenu[]>>('v1/sys/menus/company');
    return res.data.data ?? [];
  },

  /** 화면안내 (3차 메뉴). menuId: 1차 메뉴 (없으면 전체) */
  searchMenuGuides: async (menuId?: number, searchText?: string): Promise<MenuGuide[]> => {
    const res = await apiClient.get<ApiResponse<MenuGuide[]>>('v1/sys/menu-guides', { params: { menuId, searchText } });
    return res.data.data ?? [];
  },

  /** 바꾼 행의 화면안내만 보내고, 저장된 값을 원래 행에 덮어 돌려준다 (요청 순서) */
  updateMenuGuides: async (rows: MenuGuide[]): Promise<MenuGuide[]> => {
    const body = rows.map(({ menuId, note }) => ({ menuId, note }));
    const res = await apiClient.put<ApiResponse<{ menuId: number; note: string | null }[]>>('v1/sys/menu-guides', body);
    return (res.data.data ?? []).map((s, i) => ({ ...rows[i], note: s.note }));
  },

  /** 1차 메뉴 (화면안내등록 메뉴명 콤보) */
  searchTopMenus: async (): Promise<TopMenu[]> => {
    const res = await apiClient.get<ApiResponse<TopMenu[]>>('v1/sys/menu-items/top');
    return res.data.data ?? [];
  },

  /** 고객사 권한그룹 (SYSADMIN) */
  searchCompanyRoles: async (companyId: number, roleNm?: string): Promise<Role[]> => {
    const res = await apiClient.get<ApiResponse<Role[]>>(`v1/sys/roles/companies/${companyId}`, { params: { roleNm } });
    return res.data.data ?? [];
  },

  /** 고객사 권한그룹 저장 (기본권한·관리자권한 포함) → 저장된 행(요청 순서) */
  updateCompanyRoles: async (companyId: number, rows: Role[]): Promise<Role[]> => {
    const body = rows.map(({ roleId, roleNm, seq, note, defaultRole, adminYn }) => ({ roleId, roleNm, seq, note, defaultRole, adminYn }));
    const res = await apiClient.put<ApiResponse<Role[]>>(`v1/sys/roles/companies/${companyId}`, body);
    return res.data.data ?? [];
  },

  deleteCompanyRoles: async (companyId: number, roleIds: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>(`v1/sys/roles/companies/${companyId}`, { data: roleIds });
    return res.data.data ?? 0;
  },

  /** 고객사 권한그룹의 사원 (SYSADMIN) */
  searchCompanyUserRoles: async (companyId: number, roleId: number): Promise<UserRole[]> => {
    const res = await apiClient.get<ApiResponse<UserRole[]>>(`v1/sys/user-roles/companies/${companyId}`, { params: { roleId } });
    return res.data.data ?? [];
  },

  updateCompanyUserRoles: async (companyId: number, rows: UserRole[]): Promise<UserRole[]> => {
    const body = rows.map(({ userRoleId, userId, roleId, authOrgId }) => ({ userRoleId, userId, roleId, authOrgId }));
    const res = await apiClient.put<ApiResponse<UserRole[]>>(`v1/sys/user-roles/companies/${companyId}`, body);
    return res.data.data ?? [];
  },

  deleteCompanyUserRoles: async (companyId: number, userRoleIds: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>(`v1/sys/user-roles/companies/${companyId}`, { data: userRoleIds });
    return res.data.data ?? 0;
  },

  /** 고객사 권한그룹의 메뉴 트리 (SYSADMIN, 깊이 우선 + level) */
  searchCompanyRoleMenus: async (companyId: number, roleId: number): Promise<RoleMenu[]> => {
    const res = await apiClient.get<ApiResponse<RoleMenu[]>>(`v1/sys/role-menus/companies/${companyId}`, { params: { roleId } });
    return res.data.data ?? [];
  },

  /** 권한그룹 복사: 원본 회사의 권한그룹(이름 기준)을 대상 회사들로 → 복사한 회사 수 */
  copyRole: async (sourceCompanyId: number, roleNm: string, companyIds: number[]): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>('v1/sys/role-menus/copy-role', { sourceCompanyId, roleNm, companyIds });
    return res.data.data ?? 0;
  },

  /** 메뉴권한 복사: 메뉴와 상위 메뉴의 회사 사용·권한그룹 권한을 대상 회사들로 → 처리한 회사 수 */
  copyRoleMenu: async (sourceCompanyId: number, roleNm: string, menuId: number, companyIds: number[]): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>('v1/sys/role-menus/copy-menu', { sourceCompanyId, roleNm, menuId, companyIds });
    return res.data.data ?? 0;
  },

  /** 고객별 서버사용량 (SYSADMIN). useYn=true면 사용 고객만 */
  searchFileUsage: async (useYn: boolean): Promise<FileUsage[]> => {
    const res = await apiClient.get<ApiResponse<FileUsage[]>>('v1/sys/files/usage', { params: { useYn } });
    return res.data.data ?? [];
  },

  searchFileUsageByYear: async (locNm: string): Promise<FileUsagePeriod[]> => {
    const res = await apiClient.get<ApiResponse<FileUsagePeriod[]>>(`v1/sys/files/usage/${encodeURIComponent(locNm)}/years`);
    return res.data.data ?? [];
  },

  searchFileUsageByMonth: async (locNm: string, year: string): Promise<FileUsagePeriod[]> => {
    const res = await apiClient.get<ApiResponse<FileUsagePeriod[]>>(`v1/sys/files/usage/${encodeURIComponent(locNm)}/months`, { params: { year } });
    return res.data.data ?? [];
  },

  /** 미사용 파일 (SYSADMIN) */
  searchTrashFiles: async (): Promise<TrashFile[]> => {
    const res = await apiClient.get<ApiResponse<TrashFile[]>>('v1/sys/files/trash');
    return res.data.data ?? [];
  },

  /** 로그인 회사 일자 (month 없으면 연도 전체) */
  searchCalendars: async (year: string, month?: string): Promise<Calendar[]> => {
    const res = await apiClient.get<ApiResponse<Calendar[]>>('v1/sys/calendars', { params: { year, month } });
    return res.data.data ?? [];
  },

  updateCalendars: async (rows: Calendar[]): Promise<Calendar[]> => {
    const body = rows.map(({ calendarId, workingYn, offReason, note }) => ({ calendarId, workingYn, offReason, note }));
    const res = await apiClient.put<ApiResponse<Calendar[]>>('v1/sys/calendars', body);
    return res.data.data ?? [];
  },

  /** 그 연도 일자를 지우고 다시 만든다 → 만든 일수 */
  generateCalendars: async (year: string): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>('v1/sys/calendars/generate', null, { params: { year } });
    return res.data.data ?? 0;
  },

  /** 고객사반영: 그 날의 사용 고객사 일자 (SYSADMIN) */
  searchCustomerCalendars: async (day: string): Promise<Calendar[]> => {
    const res = await apiClient.get<ApiResponse<Calendar[]>>('v1/sys/calendars/customers', { params: { day } });
    return res.data.data ?? [];
  },

  updateCustomerCalendars: async (rows: Calendar[]): Promise<Calendar[]> => {
    const body = rows.map(({ calendarId, workingYn, offReason, note }) => ({ calendarId, workingYn, offReason, note }));
    const res = await apiClient.put<ApiResponse<Calendar[]>>('v1/sys/calendars/customers', body);
    return res.data.data ?? [];
  },

  /** 권한그룹의 사원 */
  searchUserRoles: async (roleId: number): Promise<UserRole[]> => {
    const res = await apiClient.get<ApiResponse<UserRole[]>>('v1/sys/user-roles', { params: { roleId } });
    return res.data.data ?? [];
  },

  updateUserRoles: async (rows: UserRole[]): Promise<UserRole[]> => {
    const body = rows.map(({ userRoleId, userId, roleId, authOrgId }) => ({ userRoleId, userId, roleId, authOrgId }));
    const res = await apiClient.put<ApiResponse<UserRole[]>>('v1/sys/user-roles', body);
    return res.data.data ?? [];
  },

  deleteUserRoles: async (userRoleIds: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/sys/user-roles', { data: userRoleIds });
    return res.data.data ?? 0;
  },

  /** 사원별 권한그룹 (회사 권한그룹 전체 + 보유 여부) */
  searchRolesByUser: async (userId: number): Promise<RoleUser[]> => {
    const res = await apiClient.get<ApiResponse<RoleUser[]>>(`v1/sys/roles/users/${userId}`);
    return res.data.data ?? [];
  },

  /** 바꾼 행만 보내 부여·해제 → 사원의 권한그룹 목록 */
  updateRolesByUser: async (userId: number, rows: RoleUser[]): Promise<RoleUser[]> => {
    const body = rows.map(({ roleId, roleNm, userRoleYn, userRoleId }) => ({ roleId, roleNm, userRoleYn, userRoleId }));
    const res = await apiClient.put<ApiResponse<RoleUser[]>>(`v1/sys/roles/users/${userId}`, body);
    return res.data.data ?? [];
  },

  /** 권한그룹별 메뉴 트리 */
  searchRoleMenus: async (roleId: number): Promise<RoleMenu[]> => {
    const res = await apiClient.get<ApiResponse<RoleMenu[]>>('v1/sys/role-menus', { params: { roleId } });
    return res.data.data ?? [];
  },

  /** 바꾼 메뉴만 저장 → 저장된 행(roleMenuId 포함, 요청 순서) */
  /** 고객사 권한그룹의 메뉴 권한 저장 (SYSADMIN) → 저장된 행(요청 순서) */
  updateCompanyRoleMenus: async (companyId: number, roleId: number, rows: RoleMenu[]): Promise<Pick<RoleMenu, 'menuId' | 'roleMenuId' | 'roleMenuYn'>[]> => {
    const body = rows.map(({ menuId, roleMenuId, roleMenuYn }) => ({ menuId, roleMenuId, roleMenuYn }));
    const res = await apiClient.put<ApiResponse<Pick<RoleMenu, 'menuId' | 'roleMenuId' | 'roleMenuYn'>[]>>(
      `v1/sys/role-menus/companies/${companyId}`, body, { params: { roleId } });
    return res.data.data ?? [];
  },

  updateRoleMenus: async (roleId: number, rows: RoleMenu[]): Promise<Pick<RoleMenu, 'menuId' | 'roleMenuId' | 'roleMenuYn'>[]> => {
    const body = rows.map(({ menuId, roleMenuId, roleMenuYn }) => ({ menuId, roleMenuId, roleMenuYn }));
    const res = await apiClient.put<ApiResponse<Pick<RoleMenu, 'menuId' | 'roleMenuId' | 'roleMenuYn'>[]>>(
      'v1/sys/role-menus', body, { params: { roleId } });
    return res.data.data ?? [];
  },

  // ── 메뉴 관리 (SYSADMIN) ──
  searchMenuItems: async (): Promise<MenuItem[]> => {
    const res = await apiClient.get<ApiResponse<MenuItem[]>>('v1/sys/menu-items');
    return res.data.data ?? [];
  },

  createMenuItem: async (body: MenuItemSave): Promise<MenuItem> => {
    const res = await apiClient.post<ApiResponse<MenuItem>>('v1/sys/menu-items', body);
    return res.data.data;
  },

  /** 수정·이동(parentId 변경) */
  updateMenuItem: async (menuId: number, body: MenuItemSave): Promise<MenuItem> => {
    const res = await apiClient.put<ApiResponse<MenuItem>>(`v1/sys/menu-items/${menuId}`, body);
    return res.data.data;
  },

  deleteMenuItem: async (menuId: number): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>(`v1/sys/menu-items/${menuId}`);
    return res.data.data ?? 0;
  },

  searchCopyMenus: async (searchText: string, menuNameYn: boolean): Promise<MenuCopy[]> => {
    const res = await apiClient.get<ApiResponse<MenuCopy[]>>('v1/sys/menu-items/copy-candidates', { params: { searchText, menuNameYn } });
    return res.data.data ?? [];
  },

  // ── 회사별 메뉴 (SYSADMIN) ──
  searchCompanyMenus: async (companyId: number): Promise<CompanyMenu[]> => {
    const res = await apiClient.get<ApiResponse<CompanyMenu[]>>('v1/sys/company-menus', { params: { companyId } });
    return res.data.data ?? [];
  },

  updateCompanyMenus: async (companyId: number, rows: CompanyMenu[]): Promise<Pick<CompanyMenu, 'menuId' | 'companyMenuId' | 'companyMenuYn'>[]> => {
    const body = rows.map(({ menuId, companyMenuId, companyMenuYn }) => ({ menuId, companyMenuId, companyMenuYn }));
    const res = await apiClient.put<ApiResponse<Pick<CompanyMenu, 'menuId' | 'companyMenuId' | 'companyMenuYn'>[]>>(
      'v1/sys/company-menus', body, { params: { companyId } });
    return res.data.data ?? [];
  },

  /** 메뉴 일괄복사: useYn true=권한부여, false=권한삭제 */
  updateCompanyMenusBulk: async (menuIds: number[], companyIds: number[], useYn: boolean): Promise<void> => {
    await apiClient.put('v1/sys/company-menus/bulk', { menuIds, companyIds, useYn });
  },

  // ── 고객사 (SYSADMIN) ──
  searchCompanies: async (companyNm?: string, useYn?: string): Promise<SysCompany[]> => {
    const res = await apiClient.get<ApiResponse<SysCompany[]>>('v1/sys/companies', { params: { companyNm, useYn } });
    return res.data.data ?? [];
  },

  searchCopyCompanies: async (searchText?: string): Promise<SysCompany[]> => {
    const res = await apiClient.get<ApiResponse<SysCompany[]>>('v1/sys/companies/copy-candidates', { params: { searchText } });
    return res.data.data ?? [];
  },

  searchCompaniesByMenu: async (menuId: number): Promise<CompanyMenuYn[]> => {
    const res = await apiClient.get<ApiResponse<CompanyMenuYn[]>>('v1/sys/companies/by-menu', { params: { menuId } });
    return res.data.data ?? [];
  },

  /** 바꾼 고객사만 보내 메뉴 부여(INSERT)·해제(DELETE) → 다시 조회한 목록 */
  updateCompaniesByMenu: async (menuId: number, rows: CompanyMenuYn[]): Promise<CompanyMenuYn[]> => {
    const body = rows.map(({ companyId, menuYn, companyMenuId }) => ({ companyId, menuYn, companyMenuId }));
    const res = await apiClient.put<ApiResponse<CompanyMenuYn[]>>('v1/sys/companies/by-menu', body, { params: { menuId } });
    return res.data.data ?? [];
  },

  // ── 공통코드 ──
  /** sysYn: 'true' / 'false'(기본) / '%'(전체) */
  searchCodeKinds: async (kindNm?: string, sysYn?: string): Promise<CodeKind[]> => {
    const res = await apiClient.get<ApiResponse<CodeKind[]>>('v1/sys/code-kinds', { params: { kindNm, sysYn } });
    return res.data.data ?? [];
  },

  updateCodeKinds: async (rows: CodeKind[]): Promise<CodeKind[]> => {
    const res = await apiClient.put<ApiResponse<CodeKind[]>>('v1/sys/code-kinds', rows);
    return res.data.data ?? [];
  },

  deleteCodeKinds: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/sys/code-kinds', { data: ids });
    return res.data.data ?? 0;
  },

  /** companyId는 KFS 관리자만 쓴다 (그 외는 서버가 로그인 회사로) */
  searchCodes: async (codeKindId: number, companyId?: number, searchText?: string): Promise<Code[]> => {
    const res = await apiClient.get<ApiResponse<Code[]>>('v1/sys/codes', { params: { codeKindId, companyId, searchText } });
    return res.data.data ?? [];
  },

  updateCodes: async (rows: Code[]): Promise<Code[]> => {
    const body = rows.map(({ lastDate: _lastDate, ...r }) => r);
    const res = await apiClient.put<ApiResponse<Code[]>>('v1/sys/codes', body);
    return res.data.data ?? [];
  },

  deleteCodes: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/sys/codes', { data: ids });
    return res.data.data ?? 0;
  },

  copyCodes: async (codeKindId: number, sourceCompanyId: number, companyIds: number[]): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>('v1/sys/codes/copy', { codeKindId, sourceCompanyId, companyIds });
    return res.data.data ?? 0;
  },

  searchCodeGroups: async (codeKindId: number): Promise<CodeGroup[]> => {
    const res = await apiClient.get<ApiResponse<CodeGroup[]>>('v1/sys/code-groups', { params: { codeKindId } });
    return res.data.data ?? [];
  },

  updateCodeGroups: async (rows: CodeGroup[]): Promise<CodeGroup[]> => {
    const res = await apiClient.put<ApiResponse<CodeGroup[]>>('v1/sys/code-groups', rows);
    return res.data.data ?? [];
  },

  deleteCodeGroups: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/sys/code-groups', { data: ids });
    return res.data.data ?? 0;
  },

  searchCodeGroupCodes: async (codeKindId: number, kindGroupCd: string, companyId?: number): Promise<CodeGroup[]> => {
    const res = await apiClient.get<ApiResponse<CodeGroup[]>>('v1/sys/code-groups/codes', { params: { codeKindId, kindGroupCd, companyId } });
    return res.data.data ?? [];
  },

  createCodeGroupCodes: async (rows: CodeGroup[]): Promise<CodeGroup[]> => {
    const res = await apiClient.post<ApiResponse<CodeGroup[]>>('v1/sys/code-groups/codes', rows);
    return res.data.data ?? [];
  },

  deleteCodeGroupCodes: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/sys/code-groups/codes', { data: ids });
    return res.data.data ?? 0;
  },

  // ── 고객별 시스템정보 관리 (SYSADMIN) ──
  searchCompanyDetails: async (companyNm?: string, useYn?: string): Promise<CompanyDetail[]> => {
    const res = await apiClient.get<ApiResponse<CompanyDetail[]>>('v1/sys/companies/details', { params: { companyNm, useYn } });
    return res.data.data ?? [];
  },

  getCompany: async (companyId: number): Promise<CompanyDetail> => {
    const res = await apiClient.get<ApiResponse<CompanyDetail>>(`v1/sys/companies/${companyId}`);
    return res.data.data;
  },

  /** 신규 고객사 (서버가 최상위 조직·기본 공통코드를 함께 만든다) */
  createCompany: async (body: CompanySave): Promise<CompanyDetail> => {
    const res = await apiClient.post<ApiResponse<CompanyDetail>>('v1/sys/companies', body);
    return res.data.data;
  },

  updateCompany: async (companyId: number, body: CompanySave): Promise<CompanyDetail> => {
    const res = await apiClient.put<ApiResponse<CompanyDetail>>(`v1/sys/companies/${companyId}`, body);
    return res.data.data;
  },

  updateCompanyNote: async (companyId: number, note: string | null): Promise<void> => {
    await apiClient.put(`v1/sys/companies/${companyId}/note`, { note });
  },

  deleteCompanies: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/sys/companies', { data: ids });
    return res.data.data ?? 0;
  },

  searchLoginSecures: async (companyId: number): Promise<LoginSecure[]> => {
    const res = await apiClient.get<ApiResponse<LoginSecure[]>>(`v1/sys/companies/${companyId}/login-secures`);
    return res.data.data ?? [];
  },

  updateLoginSecures: async (rows: LoginSecure[]): Promise<LoginSecure[]> => {
    const res = await apiClient.put<ApiResponse<LoginSecure[]>>('v1/sys/companies/login-secures', rows);
    return res.data.data ?? [];
  },

  deleteLoginSecures: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/sys/companies/login-secures', { data: ids });
    return res.data.data ?? 0;
  },

  /** 콤보용: 코드종류 코드값(kindCd)의 기준일(yyyy-MM-dd, 없으면 오늘) 유효 코드 */
  searchCodesByKind: async (kindCd: string, applyDate?: string): Promise<Code[]> => {
    const res = await apiClient.get<ApiResponse<Code[]>>('v1/sys/codes/by-kind', { params: { kindCd, applyDate } });
    return res.data.data ?? [];
  },

  /** 사원이 쓸 수 있는 메뉴 (권한그룹 + 회사 기본 권한그룹) */
  searchPersonMenus: async (personId: number): Promise<PersonMenu[]> => {
    const res = await apiClient.get<ApiResponse<PersonMenu[]>>(`v1/sys/menus/persons/${personId}`);
    return res.data.data ?? [];
  },
};
