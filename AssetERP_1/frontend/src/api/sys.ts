import { apiClient } from './client';
import { ApiResponse } from '../types/auth';
import { MenuLevel_1 } from '../types';
import { AdminUser, AdminUserMenu, Code, CodeAdmin, CodeGroup, CodeKind, CompanyCopy, CompanyMenuNode, CompanyMenuYn, Company, CompanyCreateReq, CompanyManage, CompanyBasic, CompanyApproval, CompanyAccount, LoginSecure, MenuCopy, MenuLookup, MenuNode, MenuSaveReq, PersonRole, Role, RoleMenuCopyReq, RoleMenuNode, SpecificMenu, SpecificMenuHistory, SpecificMenuLink, SpecificMenuPerson, UserRole } from '../types/sys';

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

/** 프레임 메뉴(B06) + 화면 API(A 작업마다 추가) */
export const sysApi = {
  /** 로그인 사용자의 메뉴 트리 (회사관리자: 회사 메뉴 전체, 사원: 권한그룹 메뉴) */
  getMenus: async (): Promise<MenuLevel_1[]> => {
    const res = await apiClient.get<ApiResponse<MenuLevel_1Res[]>>('v1/sys/menus');
    return (res.data.data ?? []).map((m, i) => ({ ...m, iconName: LEVEL_1_ICONS[i % LEVEL_1_ICONS.length] }));
  },

  // ── A01 권한그룹 관리 (Sys04_Tab_Role) ──

  /** AS-IS sys.Sys04_Role.selectByName: 권한명 LIKE + 로그인 회사 */
  searchRoles: async (roleNm?: string): Promise<Role[]> => {
    const res = await apiClient.get<ApiResponse<Role[]>>('v1/sys/roles', { params: { roleNm } });
    return res.data.data ?? [];
  },

  /** AS-IS sys.Sys04_Role.update: 추가·변경 행 → 저장된 행(요청 순서) */
  updateRoles: async (rows: Role[]): Promise<Role[]> => {
    const body = rows.map(({ roleId, roleNm, seq, note }) => ({ roleId, roleNm, seq, note }));
    const res = await apiClient.put<ApiResponse<Role[]>>('v1/sys/roles', body);
    return res.data.data ?? [];
  },

  /** AS-IS sys.Sys04_Role.delete → 지운 건수 */
  deleteRoles: async (roleIds: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/sys/roles', { data: roleIds });
    return res.data.data ?? 0;
  },

  // ── A02 권한그룹 관리 — 고객사별 (Sys04_Tab_RoleAdmin) ──

  /** AS-IS sys.Sys04_Role.selectByName(roleName '%' — A08은 '%권한명%', companyId = 고른 고객사) */
  searchCompanyRoles: async (companyId: number, roleNm?: string): Promise<Role[]> => {
    const res = await apiClient.get<ApiResponse<Role[]>>(`v1/sys/companies/${companyId}/roles`, { params: { roleNm } });
    return res.data.data ?? [];
  },

  /** AS-IS sys.Sys04_Role.update: 변경 행 → 저장된 행(요청 순서). 기본권한·관리자권한 포함 */
  updateCompanyRoles: async (companyId: number, rows: Role[]): Promise<Role[]> => {
    const body = rows.map(({ roleId, roleNm, seq, note, defaultRole, adminYn }) => ({ roleId, roleNm, seq, note, defaultRole, adminYn }));
    const res = await apiClient.put<ApiResponse<Role[]>>(`v1/sys/companies/${companyId}/roles`, body);
    return res.data.data ?? [];
  },

  /** AS-IS sys.Sys04_Role.delete → 지운 건수 */
  deleteCompanyRoles: async (companyId: number, roleIds: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>(`v1/sys/companies/${companyId}/roles`, { data: roleIds });
    return res.data.data ?? 0;
  },

  // ── 공통코드 콤보 (AS-IS ComboBoxField) ──

  /** AS-IS sys.Sys09_Code.selectByCodeKind: 로그인 회사, 오늘 기준 */
  searchCodes: async (kindCd: string): Promise<Code[]> => {
    const res = await apiClient.get<ApiResponse<Code[]>>('v1/sys/codes', { params: { kindCd } });
    return res.data.data ?? [];
  },

  // ── A15 고객별 시스템정보 관리 (Sys01_Tab_Company) ──

  /** AS-IS sys.Sys01_Company.selectByName: 고객명·서브도메인·비고 LIKE, useYn 'true'면 사용고객만 */
  searchCompanies: async (companyNm: string, useYn: boolean): Promise<Company[]> => {
    const res = await apiClient.get<ApiResponse<Company[]>>('v1/sys/companies', { params: { companyNm, useYn: String(useYn) } });
    return res.data.data ?? [];
  },

  /** AS-IS sys.Sys01_Company.update(신규) → 등록 + 회사 초기화 후 등록된 회사 */
  createCompany: async (req: CompanyCreateReq): Promise<Company> => {
    const res = await apiClient.post<ApiResponse<Company>>('v1/sys/companies', req);
    return res.data.data;
  },

  /** AS-IS sys.Sys01_Company.delete → 지운 건수 (sys01_company 행만) */
  deleteCompanies: async (companyIds: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/sys/companies', { data: companyIds });
    return res.data.data ?? 0;
  },

  /** AS-IS sys.Sys00_Common.selectCompanyInfo: 회사 콤보 (code = 회사 ID, name = 서브도메인) */
  searchCompanyOptions: async (): Promise<Code[]> => {
    const res = await apiClient.get<ApiResponse<Code[]>>('v1/sys/companies/options');
    return res.data.data ?? [];
  },

  /** AS-IS sys.Sys03_CompanyMenu.insert (매뉴권한복사(초기)): 출발지 → 도착지 */
  copyCompanyMenus: async (outPut: number, inPut: number): Promise<void> => {
    await apiClient.post('v1/sys/company-menus/copy', { outPut, inPut });
  },

  /** AS-IS dcr.Dcr01_ClassTree.commentInsert (문서개요복사: admin(0) → 회사) → 바뀐 행 수 */
  copyDcrComments: async (companyId: number): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>(`v1/dcr/class-trees/comments/copy/${companyId}`);
    return res.data.data ?? 0;
  },

  /** AS-IS sys.Sys01_Company.selectById 중 로그인 회사의 문서번호 채번방식 (null → '1') — 조직 팝업(C02) */
  getDcrNumberingCode: async (): Promise<string> => {
    const res = await apiClient.get<ApiResponse<string>>('v1/sys/companies/current/dcr-numbering-code');
    return res.data.data;
  },

  // ── A15 관리정보 탭 (Sys01_TabPage_Info01) ──

  /** AS-IS sys.Sys01_Company.selectById (관리정보 컬럼) */
  getCompanyManage: async (companyId: number): Promise<CompanyManage> => {
    const res = await apiClient.get<ApiResponse<CompanyManage>>(`v1/sys/companies/${companyId}/manage`);
    return res.data.data;
  },

  /** AS-IS sys.Sys01_Company.update → 저장된 행. 체크박스 값(true/false)은 'true'/'false'로 보낸다 */
  updateCompanyManage: async (row: CompanyManage): Promise<CompanyManage> => {
    const yn = (v: unknown) => (v == null ? null : String(v));
    const body = { ...row, loginSecureYn: yn(row.loginSecureYn), assetYn: yn(row.assetYn), advisYn: yn(row.advisYn), pbsYn: yn(row.pbsYn), useYn: yn(row.useYn) };
    const res = await apiClient.put<ApiResponse<CompanyManage>>(`v1/sys/companies/${row.companyId}/manage`, body);
    return res.data.data;
  },

  // ── A15-3 기본정보·전자결재/내부통제·경영/회계 탭 (Sys01_TabPage_Info02·03·04) ──

  /** AS-IS sys.Sys01_Company.selectById (기본정보 컬럼) */
  getCompanyBasic: async (companyId: number): Promise<CompanyBasic> => {
    const res = await apiClient.get<ApiResponse<CompanyBasic>>(`v1/sys/companies/${companyId}/basic`);
    return res.data.data;
  },

  /** AS-IS sys.Sys01_Company.getCorpRegNo(법인등록번호 암호화) + update → 저장된 행 */
  updateCompanyBasic: async (row: CompanyBasic): Promise<CompanyBasic> => {
    const res = await apiClient.put<ApiResponse<CompanyBasic>>(`v1/sys/companies/${row.companyId}/basic`, row);
    return res.data.data;
  },

  /** AS-IS sys.Sys01_Company.selectById (전자결재·내부통제 컬럼) */
  getCompanyApproval: async (companyId: number): Promise<CompanyApproval> => {
    const res = await apiClient.get<ApiResponse<CompanyApproval>>(`v1/sys/companies/${companyId}/approval`);
    return res.data.data;
  },

  /** AS-IS sys.Sys01_Company.update → 저장된 행. 체크박스 값은 'true'/'false'로 보낸다 */
  updateCompanyApproval: async (row: CompanyApproval): Promise<CompanyApproval> => {
    const yn = (v: unknown) => (v == null ? null : String(v));
    const body = { ...row, apprStepLockYn: yn(row.apprStepLockYn), aprManagerInfoYn: yn(row.aprManagerInfoYn), dcrDetailUseYn: yn(row.dcrDetailUseYn),
      icsNonStayYn: yn(row.icsNonStayYn), fltOnlyCurrYn: yn(row.fltOnlyCurrYn), icsGuideYn: yn(row.icsGuideYn) };
    const res = await apiClient.put<ApiResponse<CompanyApproval>>(`v1/sys/companies/${row.companyId}/approval`, body);
    return res.data.data;
  },

  /** AS-IS sys.Sys01_Company.selectById (경영·회계 컬럼) */
  getCompanyAccount: async (companyId: number): Promise<CompanyAccount> => {
    const res = await apiClient.get<ApiResponse<CompanyAccount>>(`v1/sys/companies/${companyId}/account`);
    return res.data.data;
  },

  /** AS-IS sys.Sys01_Company.update → 저장된 행. 체크박스 값은 'true'/'false'로 보낸다 */
  updateCompanyAccount: async (row: CompanyAccount): Promise<CompanyAccount> => {
    const yn = (v: unknown) => (v == null ? null : String(v));
    const body = { ...row, leaveYn: yn(row.leaveYn), cardRealUserYn: yn(row.cardRealUserYn), astManagerAutoYn: yn(row.astManagerAutoYn) };
    const res = await apiClient.put<ApiResponse<CompanyAccount>>(`v1/sys/companies/${row.companyId}/account`, body);
    return res.data.data;
  },

  /** AS-IS sys.Sys00_Common.selectByKindGroupCode (CommonComboBoxField): 로그인 회사, 코드그룹, 오늘 기준 */
  searchCodesByKindGroup: async (kindGroupCd: string): Promise<Code[]> => {
    const res = await apiClient.get<ApiResponse<Code[]>>('v1/sys/codes/by-group', { params: { kindGroupCd } });
    return res.data.data ?? [];
  },

  /** AS-IS sys.Sys01_Company.updateNote (비고 팝업) */
  updateCompanyNote: async (companyId: number, note: string | null): Promise<void> => {
    await apiClient.put(`v1/sys/companies/${companyId}/note`, { note });
  },

  // ── 공인IP (Sys29_Lookup_PublicIpList) ──

  searchLoginSecures: async (companyId: number): Promise<LoginSecure[]> => {
    const res = await apiClient.get<ApiResponse<LoginSecure[]>>(`v1/sys/companies/${companyId}/login-secures`);
    return res.data.data ?? [];
  },

  updateLoginSecures: async (companyId: number, rows: LoginSecure[]): Promise<LoginSecure[]> => {
    const body = rows.map(({ loginSecureId, startDate, closeDate, publicIp, note }) => ({ loginSecureId, startDate, closeDate, publicIp, note }));
    const res = await apiClient.put<ApiResponse<LoginSecure[]>>(`v1/sys/companies/${companyId}/login-secures`, body);
    return res.data.data ?? [];
  },

  deleteLoginSecures: async (companyId: number, ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>(`v1/sys/companies/${companyId}/login-secures`, { data: ids });
    return res.data.data ?? 0;
  },

  // ── 고객별 관리자 (Sys02_Tab_User) ──

  searchAdminUsers: async (companyId: number): Promise<AdminUser[]> => {
    const res = await apiClient.get<ApiResponse<AdminUser[]>>(`v1/sys/companies/${companyId}/users`);
    return res.data.data ?? [];
  },

  updateAdminUsers: async (companyId: number, rows: AdminUser[]): Promise<AdminUser[]> => {
    const body = rows.map(({ userId, korNm, loginId, decPasswd, email, tel1, tel2, note, adminYn }) =>
      ({ userId, korNm, loginId, decPasswd, email, tel1, tel2, note, adminYn: adminYn == null ? null : String(adminYn) }));
    const res = await apiClient.put<ApiResponse<AdminUser[]>>(`v1/sys/companies/${companyId}/users`, body);
    return res.data.data ?? [];
  },

  deleteAdminUsers: async (companyId: number, ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>(`v1/sys/companies/${companyId}/users`, { data: ids });
    return res.data.data ?? 0;
  },

  // ── 관리자별 메뉴 권한 (Sys82_Lookup_UserMenu) ──

  searchAdminUserMenus: async (userId: number): Promise<AdminUserMenu[]> => {
    const res = await apiClient.get<ApiResponse<AdminUserMenu[]>>(`v1/sys/admin-users/${userId}/menus`);
    return res.data.data ?? [];
  },

  updateAdminUserMenus: async (userId: number, rows: AdminUserMenu[]): Promise<AdminUserMenu[]> => {
    const body = rows.map(({ menuId, adminUserMenuId, useYn }) => ({ menuId, adminUserMenuId, useYn }));
    const res = await apiClient.put<ApiResponse<AdminUserMenu[]>>(`v1/sys/admin-users/${userId}/menus`, body);
    return res.data.data ?? [];
  },

  // ── A10 회사별 메뉴맵핑 (Sys03_Tab_CompanyMenu) ──

  /** AS-IS sys.Sys06_Menu.selectByCompanyIdAll: 전체 메뉴 + 그 회사 연결 상태 */
  getCompanyMenuTree: async (companyId: number): Promise<CompanyMenuNode[]> => {
    const res = await apiClient.get<ApiResponse<CompanyMenuNode[]>>(`v1/sys/menus/companies/${companyId}`);
    return res.data.data ?? [];
  },

  /** AS-IS sys.Sys06_Menu.updateCompanyMenu: 바뀐 행 → 저장된 행 */
  updateCompanyMenus: async (companyId: number, rows: CompanyMenuNode[]): Promise<CompanyMenuNode[]> => {
    const body = rows.map(({ menuId, companyMenuId, useYn }) => ({ menuId, companyMenuId, useYn }));
    const res = await apiClient.put<ApiResponse<CompanyMenuNode[]>>(`v1/sys/menus/companies/${companyId}`, body);
    return res.data.data ?? [];
  },

  // ── A06 권한그룹별 메뉴 맵핑 (Sys07_Tab_RoleMenu) ──

  /** AS-IS sys.Sys06_Menu.selectByRoleId: 로그인 회사 메뉴 + 그 권한 연결 상태 */
  getRoleMenuTree: async (roleId: number): Promise<RoleMenuNode[]> => {
    const res = await apiClient.get<ApiResponse<RoleMenuNode[]>>(`v1/sys/roles/${roleId}/menus`);
    return res.data.data ?? [];
  },

  /** AS-IS sys.Sys06_Menu.updateRoleMenu: 바뀐 행 → 저장된 행 */
  updateRoleMenus: async (roleId: number, rows: RoleMenuNode[]): Promise<RoleMenuNode[]> => {
    const body = rows.map(({ menuId, roleMenuId, useYn }) => ({ menuId, roleMenuId, useYn }));
    const res = await apiClient.put<ApiResponse<RoleMenuNode[]>>(`v1/sys/roles/${roleId}/menus`, body);
    return res.data.data ?? [];
  },

  // ── A08 권한그룹별 메뉴권한 복사 (Sys07_Tab_Company) ──

  /** AS-IS sys.Sys06_Menu.selectByRoleId(roleId, companyId = 화면에서 고른 회사) */
  getCompanyRoleMenuTree: async (companyId: number, roleId: number): Promise<RoleMenuNode[]> => {
    const res = await apiClient.get<ApiResponse<RoleMenuNode[]>>(`v1/sys/companies/${companyId}/roles/${roleId}/menus`);
    return res.data.data ?? [];
  },

  /** A07 AS-IS sys.Sys06_Menu.updateRoleMenu(roleId) — 고른 회사의 권한그룹. 바뀐 행만 → 저장된 행 */
  updateCompanyRoleMenus: async (companyId: number, roleId: number, rows: RoleMenuNode[]): Promise<RoleMenuNode[]> => {
    const body = rows.map(({ menuId, roleMenuId, useYn }) => ({ menuId, roleMenuId, useYn }));
    const res = await apiClient.put<ApiResponse<RoleMenuNode[]>>(`v1/sys/companies/${companyId}/roles/${roleId}/menus`, body);
    return res.data.data ?? [];
  },

  /** AS-IS sys.Sys07_RoleMenu.updateRole (권한그룹복사) → 권한그룹을 넣은 회사 수 */
  copyRole: async (req: RoleMenuCopyReq): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>('v1/sys/role-menus/copy-role', req);
    return res.data.data ?? 0;
  },

  /** AS-IS sys.Sys07_RoleMenu.updateMenu (매뉴권한복사) → 처리한 회사 수 */
  copyMenu: async (req: RoleMenuCopyReq): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>('v1/sys/role-menus/copy-menu', req);
    return res.data.data ?? 0;
  },

  // ── A03 권한그룹별 사용자 맵핑 (Sys05_Tab_UserRole) ──

  /** AS-IS sys.Sys05_UserRole.selectByRoleId */
  searchUserRoles: async (roleId: number): Promise<UserRole[]> => {
    const res = await apiClient.get<ApiResponse<UserRole[]>>(`v1/sys/roles/${roleId}/user-roles`);
    return res.data.data ?? [];
  },

  /** AS-IS sys.Sys05_UserRole.update: 추가·변경 행 → 저장된 행(요청 순서) */
  updateUserRoles: async (rows: UserRole[]): Promise<UserRole[]> => {
    const body = rows.map(({ userRoleId, userId, roleId, authOrgId }) => ({ userRoleId, userId, roleId, authOrgId }));
    const res = await apiClient.put<ApiResponse<UserRole[]>>('v1/sys/user-roles', body);
    return res.data.data ?? [];
  },

  /** AS-IS sys.Sys05_UserRole.delete → 지운 건수 */
  deleteUserRoles: async (userRoleIds: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/sys/user-roles', { data: userRoleIds });
    return res.data.data ?? 0;
  },

  // ── A04 사용자별 권한그룹 맵핑 (Sys05_Tab_PersonRole) ──

  /** AS-IS sys.Sys04_Role.selectByUserId: 로그인 회사 권한그룹 + 사원 연결 여부 */
  searchPersonRoles: async (userId: number): Promise<PersonRole[]> => {
    const res = await apiClient.get<ApiResponse<PersonRole[]>>(`v1/sys/persons/${userId}/roles`);
    return res.data.data ?? [];
  },

  /** AS-IS sys.Sys04_Role.updateUserRole: 바뀐 행 → selectByUserId 전체 */
  updatePersonRoles: async (userId: number, rows: PersonRole[]): Promise<PersonRole[]> => {
    const body = rows.map(({ roleId, roleNm, userRoleYn, userRoleId }) => ({ roleId, roleNm, userRoleYn, userRoleId }));
    const res = await apiClient.put<ApiResponse<PersonRole[]>>(`v1/sys/persons/${userId}/roles`, body);
    return res.data.data ?? [];
  },

  // ── A05 고객사별 사용자권한그룹 관리 (Sys05_Tab_CompanyUserRole, sys admin) ──

  /** AS-IS sys.Sys05_UserRole.selectByRoleId (고른 회사의 권한그룹) */
  searchCompanyUserRoles: async (companyId: number, roleId: number): Promise<UserRole[]> => {
    const res = await apiClient.get<ApiResponse<UserRole[]>>(`v1/sys/companies/${companyId}/roles/${roleId}/user-roles`);
    return res.data.data ?? [];
  },

  /** AS-IS sys.Sys05_UserRole.update: 추가·변경 행 → 저장된 행(요청 순서) */
  updateCompanyUserRoles: async (companyId: number, rows: UserRole[]): Promise<UserRole[]> => {
    const body = rows.map(({ userRoleId, userId, roleId, authOrgId }) => ({ userRoleId, userId, roleId, authOrgId }));
    const res = await apiClient.put<ApiResponse<UserRole[]>>(`v1/sys/companies/${companyId}/user-roles`, body);
    return res.data.data ?? [];
  },

  /** AS-IS sys.Sys05_UserRole.delete → 지운 건수 */
  deleteCompanyUserRoles: async (companyId: number, userRoleIds: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>(`v1/sys/companies/${companyId}/user-roles`, { data: userRoleIds });
    return res.data.data ?? 0;
  },

  // ── A09 메뉴 관리 (Sys06_Tab_Menu) ──

  /** AS-IS sys.Sys06_Menu.selectByAll: 전체 메뉴 트리(전위 순서) */
  getMenuTree: async (): Promise<MenuNode[]> => {
    const res = await apiClient.get<ApiResponse<MenuNode[]>>('v1/sys/menus/all');
    return res.data.data ?? [];
  },

  /** AS-IS sys.Sys06_Menu.update: menuId 없으면 등록(POST), 있으면 수정·이동(PUT) → 저장된 행 */
  saveMenu: async (req: MenuSaveReq): Promise<MenuNode> => {
    const res = req.menuId
      ? await apiClient.put<ApiResponse<MenuNode>>(`v1/sys/menus/${req.menuId}`, req)
      : await apiClient.post<ApiResponse<MenuNode>>('v1/sys/menus', req);
    return res.data.data!;
  },

  /** AS-IS sys.Sys06_Menu.delete → 지운 건수 */
  deleteMenu: async (menuId: number): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>(`v1/sys/menus/${menuId}`);
    return res.data.data ?? 0;
  },

  /** AS-IS sys.Sys06_Menu.getAllMenuList(searchText, menuNameYn) */
  searchCopyMenus: async (searchText: string, menuNameYn: boolean): Promise<MenuCopy[]> => {
    const res = await apiClient.get<ApiResponse<MenuCopy[]>>('v1/sys/menus/copy-list', { params: { searchText, menuNameYn } });
    return res.data.data ?? [];
  },

  /** AS-IS sys.Sys06_Menu.updateByMenuYn(menuIdList, companyIdList, useYn) */
  updateCompanyMenuUse: async (menuIds: number[], companyIds: number[], useYn: boolean): Promise<void> => {
    await apiClient.put('v1/sys/menus/company-use', { menuIds, companyIds, useYn });
  },

  /** AS-IS sys.Sys01_Company.selectByCopyList(searchText, erpProductCode) */
  searchCopyCompanies: async (searchText: string, erpProductCd?: string): Promise<CompanyCopy[]> => {
    const res = await apiClient.get<ApiResponse<CompanyCopy[]>>('v1/sys/companies/copy-list', { params: { searchText, erpProductCd } });
    return res.data.data ?? [];
  },

  /** AS-IS sys.Sys01_Company.selectByCode(menuId, erpProductCode) */
  searchCompanyMenuYn: async (menuId: number, erpProductCd?: string): Promise<CompanyMenuYn[]> => {
    const res = await apiClient.get<ApiResponse<CompanyMenuYn[]>>('v1/sys/companies/menu-yn', { params: { menuId, erpProductCd } });
    return res.data.data ?? [];
  },

  /** AS-IS sys.Sys01_Company.updateByMenuYn(menuId): 바뀐 행 → selectByMenuId 결과(전체 회사) */
  updateCompanyMenuYn: async (menuId: number, rows: CompanyMenuYn[]): Promise<CompanyMenuYn[]> => {
    const body = rows.map(({ companyId, companyMenuId, menuYn }) => ({ companyId, companyMenuId, menuYn }));
    const res = await apiClient.put<ApiResponse<CompanyMenuYn[]>>('v1/sys/companies/menu-yn', body, { params: { menuId } });
    return res.data.data ?? [];
  },

  // ── A13 시스템 공통코드 관리 (Sys08_Tab_CodeKindAdmin) ──

  /** AS-IS sys.Sys08_CodeKind.selectByKindName(kindName, sysYn): 서버가 '%' + 이름 + '%' (비면 '%'), sysYn 비면 'false' */
  searchCodeKinds: async (kindName: string, sysYn: string): Promise<CodeKind[]> => {
    const res = await apiClient.get<ApiResponse<CodeKind[]>>('v1/sys/code-kinds', { params: { kindName, sysYn } });
    return res.data.data ?? [];
  },

  /** AS-IS sys.Sys08_CodeKind.update: 추가·변경 행 → 저장된 행(요청 순서) */
  updateCodeKinds: async (rows: CodeKind[]): Promise<CodeKind[]> => {
    const body = rows.map(({ codeKindId, kindCd, kindNm, sysYn, note }) => ({ codeKindId, kindCd, kindNm, sysYn, note: note || null }));
    const res = await apiClient.put<ApiResponse<CodeKind[]>>('v1/sys/code-kinds', body);
    return res.data.data ?? [];
  },

  /** AS-IS sys.Sys08_CodeKind.delete → 지운 건수 */
  deleteCodeKinds: async (codeKindIds: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/sys/code-kinds', { data: codeKindIds });
    return res.data.data ?? 0;
  },

  /** AS-IS sys.Sys09_Code.selectByCodeKindId: 시스템 코드구분이면 서버 SQL이 회사 0으로 바꾼다. 회사는 sys admin만 지정 */
  searchCodesByKind: async (codeKindId: number, companyId: number | undefined, searchText: string): Promise<CodeAdmin[]> => {
    const res = await apiClient.get<ApiResponse<CodeAdmin[]>>(`v1/sys/code-kinds/${codeKindId}/codes`, { params: { companyId, searchText } });
    return res.data.data ?? [];
  },

  /** AS-IS sys.Sys09_Code.update: 추가·변경 행 → 저장된 행(요청 순서). 빈 날짜·메모는 null(GXT 빈 값) */
  updateCodeAdmins: async (rows: CodeAdmin[]): Promise<CodeAdmin[]> => {
    const body = rows.map(({ codeId, codeKindId, companyId, code, name, seq, closeYn, applyDate, closeDate, note }) => ({
      codeId, codeKindId, companyId, code, name, seq: seq || null, closeYn, applyDate: applyDate || null, closeDate: closeDate || null, note: note || null,
    }));
    const res = await apiClient.put<ApiResponse<CodeAdmin[]>>('v1/sys/codes', body);
    return res.data.data ?? [];
  },

  /** AS-IS sys.Sys09_Code.delete → 지운 건수 (companyId 범위 안에서만) */
  deleteCodeAdmins: async (companyId: number | undefined, codeIds: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/sys/codes', { params: { companyId }, data: codeIds });
    return res.data.data ?? 0;
  },

  /** AS-IS sys.Sys09_Code.codeInsert (A14 코드복사): companyId(원본 회사)의 코드를 companyIds로 복사 → 복사한 행 수 */
  copyCodes: async (codeKindId: number, companyId: number, companyIds: number[]): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>(`v1/sys/code-kinds/${codeKindId}/codes/copy`, { companyId, companyIds });
    return res.data.data ?? 0;
  },

  /** AS-IS sys.Sys13_CodeGroup.selectByGroupCodeKind: 코드구분의 그룹 헤더 */
  searchCodeGroups: async (codeKindId: number): Promise<CodeGroup[]> => {
    const res = await apiClient.get<ApiResponse<CodeGroup[]>>(`v1/sys/code-kinds/${codeKindId}/code-groups`);
    return res.data.data ?? [];
  },

  /** AS-IS sys.Sys13_CodeGroup.update: 헤더 행 → 저장된 행(요청 순서) */
  updateCodeGroups: async (rows: CodeGroup[]): Promise<CodeGroup[]> => {
    const body = rows.map(({ codeGroupId, codeKindId, kindGroupCd, kindGroupNm }) => ({ codeGroupId, codeKindId, kindGroupCd, kindGroupNm }));
    const res = await apiClient.put<ApiResponse<CodeGroup[]>>('v1/sys/code-groups', body);
    return res.data.data ?? [];
  },

  /** AS-IS sys.Sys13_CodeGroup.deleteAll → 지운 그룹 수 */
  deleteCodeGroups: async (codeGroupIds: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/sys/code-groups', { data: codeGroupIds });
    return res.data.data ?? 0;
  },

  /** AS-IS sys.Sys13_CodeGroup.selectByKindGroupCode: 그룹에 속한 코드(코드의 회사 = companyId) */
  searchCodeGroupMembers: async (kindGroupCd: string, codeKindId: number, companyId: number): Promise<CodeGroup[]> => {
    const res = await apiClient.get<ApiResponse<CodeGroup[]>>('v1/sys/code-groups/members', { params: { kindGroupCd, codeKindId, companyId } });
    return res.data.data ?? [];
  },

  /** AS-IS sys.Sys13_CodeGroup.insert → 넣은 건수 */
  insertCodeGroupMembers: async (rows: CodeGroup[]): Promise<number> => {
    const body = rows.map(({ codeKindId, kindGroupCd, kindGroupNm, codeId }) => ({ codeKindId, kindGroupCd, kindGroupNm, codeId }));
    const res = await apiClient.post<ApiResponse<number>>('v1/sys/code-groups/members', body);
    return res.data.data ?? 0;
  },

  /** AS-IS sys.Sys13_CodeGroup.delete → 지운 건수 */
  deleteCodeGroupMembers: async (codeGroupIds: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/sys/code-groups/members', { data: codeGroupIds });
    return res.data.data ?? 0;
  },

  // ── A15-4 특정매뉴 권한 (Sys50_TabPage_SpecificMenu · Sys51 · Sys52 · Sys54) ──

  /** AS-IS sys.Sys50_SpecificMenu.selectBySpecificWorkCode: specificWorkCd '%' = 전체 */
  searchSpecificMenus: async (companyId: number, specificWorkCd: string): Promise<SpecificMenu[]> => {
    const res = await apiClient.get<ApiResponse<SpecificMenu[]>>(`v1/sys/companies/${companyId}/specific-menus`, { params: { specificWorkCd } });
    return res.data.data ?? [];
  },

  /** AS-IS sys.Sys50_SpecificMenu.update: 변경 행 → 저장된 행(요청 순서). specificMenuId ≤ 0 = 신규 */
  updateSpecificMenus: async (companyId: number, rows: SpecificMenu[]): Promise<SpecificMenu[]> => {
    const body = rows.map(({ specificMenuId, specificWorkCd, menuId, note }) => ({ specificMenuId, specificWorkCd, menuId, note }));
    const res = await apiClient.put<ApiResponse<SpecificMenu[]>>(`v1/sys/companies/${companyId}/specific-menus`, body);
    return res.data.data ?? [];
  },

  /** AS-IS sys.Sys50_SpecificMenu.delete → 지운 건수 */
  deleteSpecificMenus: async (companyId: number, ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>(`v1/sys/companies/${companyId}/specific-menus`, { data: ids });
    return res.data.data ?? 0;
  },

  /** AS-IS sys.Sys51_SpecificMenuPerson.selectBySpecificMenuId */
  searchSpecificMenuPersons: async (companyId: number, specificMenuId: number, specificWorkCd: string): Promise<SpecificMenuPerson[]> => {
    const res = await apiClient.get<ApiResponse<SpecificMenuPerson[]>>(
      `v1/sys/companies/${companyId}/specific-menus/${specificMenuId}/persons`, { params: { specificWorkCd } });
    return res.data.data ?? [];
  },

  /** AS-IS sys.Sys51_SpecificMenuPerson.update → 저장된 행(요청 순서) */
  updateSpecificMenuPersons: async (companyId: number, specificMenuId: number, rows: SpecificMenuPerson[]): Promise<SpecificMenuPerson[]> => {
    const body = rows.map(({ specificMenuPersonId, personId, useYn, note, specificWorkCd }) => ({ specificMenuPersonId, personId, useYn, note, specificWorkCd }));
    const res = await apiClient.put<ApiResponse<SpecificMenuPerson[]>>(`v1/sys/companies/${companyId}/specific-menus/${specificMenuId}/persons`, body);
    return res.data.data ?? [];
  },

  /** AS-IS sys.Sys51_SpecificMenuPerson.delete → 지운 건수 */
  deleteSpecificMenuPersons: async (companyId: number, specificMenuId: number, ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>(`v1/sys/companies/${companyId}/specific-menus/${specificMenuId}/persons`, { data: ids });
    return res.data.data ?? 0;
  },

  /** AS-IS sys.Sys51_SpecificMenuPerson.updateGroup (일괄 권한설정) */
  updateSpecificMenuPersonGroup: async (companyId: number, specificMenuId: number, specificWorkCd: string): Promise<void> => {
    await apiClient.post(`v1/sys/companies/${companyId}/specific-menus/${specificMenuId}/persons/group`, null, { params: { specificWorkCd } });
  },

  /** AS-IS sys.Sys52_SpecificMenuLink.selectBySpecificWorkCode */
  searchSpecificMenuLinks: async (companyId: number, specificWorkCd: string): Promise<SpecificMenuLink[]> => {
    const res = await apiClient.get<ApiResponse<SpecificMenuLink[]>>(`v1/sys/companies/${companyId}/specific-menu-links`, { params: { specificWorkCd } });
    return res.data.data ?? [];
  },

  /** AS-IS sys.Sys52_SpecificMenuLink.update → 저장된 행(요청 순서) */
  updateSpecificMenuLinks: async (companyId: number, rows: SpecificMenuLink[]): Promise<SpecificMenuLink[]> => {
    const body = rows.map(({ specificMenuLinkId, specificWorkCd, linkCd, note }) => ({ specificMenuLinkId, specificWorkCd, linkCd, note }));
    const res = await apiClient.put<ApiResponse<SpecificMenuLink[]>>(`v1/sys/companies/${companyId}/specific-menu-links`, body);
    return res.data.data ?? [];
  },

  /** AS-IS sys.Sys52_SpecificMenuLink.delete → 지운 건수 */
  deleteSpecificMenuLinks: async (companyId: number, ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>(`v1/sys/companies/${companyId}/specific-menu-links`, { data: ids });
    return res.data.data ?? 0;
  },

  /** AS-IS sys.Sys54_SpecificMenuHistory.selectByCompanyId */
  searchSpecificMenuHistories: async (companyId: number): Promise<SpecificMenuHistory[]> => {
    const res = await apiClient.get<ApiResponse<SpecificMenuHistory[]>>(`v1/sys/companies/${companyId}/specific-menu-histories`);
    return res.data.data ?? [];
  },

  /** AS-IS sys.Sys54_SpecificMenuHistory.update → 저장된 행(요청 순서) */
  updateSpecificMenuHistories: async (companyId: number, rows: SpecificMenuHistory[]): Promise<SpecificMenuHistory[]> => {
    const body = rows.map(({ specificMenuHistoryId, regDate, confirmDate, confirmNm }) => ({ specificMenuHistoryId, regDate, confirmDate, confirmNm }));
    const res = await apiClient.put<ApiResponse<SpecificMenuHistory[]>>(`v1/sys/companies/${companyId}/specific-menu-histories`, body);
    return res.data.data ?? [];
  },

  /** AS-IS sys.Sys54_SpecificMenuHistory.delete → 지운 건수 */
  deleteSpecificMenuHistories: async (companyId: number, ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>(`v1/sys/companies/${companyId}/specific-menu-histories`, { data: ids });
    return res.data.data ?? 0;
  },

  /** AS-IS sys.Sys54_SpecificMenuHistory.updateByNote (Sys54_Edit_Note 저장) */
  updateSpecificMenuHistoryNote: async (companyId: number, specificMenuHistoryId: number, note: string): Promise<void> => {
    await apiClient.put(`v1/sys/companies/${companyId}/specific-menu-histories/${specificMenuHistoryId}/note`, { note });
  },

  /** AS-IS sys.Sys54_SpecificMenuHistory.deleteFile(parentId) — 재등록 전에 기존 첨부를 지운다 (B10) */
  deleteSpecificMenuHistoryFile: async (companyId: number, specificMenuHistoryId: number): Promise<void> => {
    await apiClient.delete(`v1/sys/companies/${companyId}/specific-menu-histories/${specificMenuHistoryId}/file`);
  },

  /** AS-IS Sys06_Lookup_SelectMulti.retrieve → sys.Sys06_Menu.getAllMenuList ('%' + 검색어 + '%') */
  searchLookupMenus: async (searchText: string, menuNameYn: boolean): Promise<MenuLookup[]> => {
    const res = await apiClient.get<ApiResponse<MenuLookup[]>>('v1/sys/menus/lookup', { params: { searchText, menuNameYn } });
    return res.data.data ?? [];
  },
};
