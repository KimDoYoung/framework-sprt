import { apiClient } from './client';
import { ApiResponse } from '../types/auth';
import { MenuLevel_1 } from '../types';
import { AdminUser, AdminUserMenu, Code, Company, CompanyCreateReq, CompanyManage, LoginSecure, Role } from '../types/sys';

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
};
