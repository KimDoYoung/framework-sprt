import { apiClient } from './client';
import { ApiResponse, CompanyItem, TenantInfo, User } from '../types/auth';

export const authApi = {
  /** companyCode는 admin 서브도메인에서 회사를 선택한 경우에만 사용된다 (그 외에는 서버가 호스트로 판정) */
  /** rememberMe: 로그인 상태유지 (AS-IS autoLoginCBox) — 브라우저를 닫아도 세션 수명 동안 로그인 유지 */
  login: async (username: string, password: string, companyCode?: string, rememberMe?: boolean): Promise<ApiResponse<User>> => {
    const res = await apiClient.post<ApiResponse<User>>('/auth/login', { username, password, companyCode, rememberMe });
    return res.data;
  },

  /** 접속한 서브도메인의 회사 정보 */
  getTenant: async (): Promise<ApiResponse<TenantInfo>> => {
    const res = await apiClient.get<ApiResponse<TenantInfo>>('/public/tenant');
    return res.data;
  },

  /** admin 로그인 화면의 회사 선택 목록 */
  getCompanies: async (): Promise<ApiResponse<CompanyItem[]>> => {
    const res = await apiClient.get<ApiResponse<CompanyItem[]>>('/public/companies');
    return res.data;
  },

  logout: async (): Promise<ApiResponse<void>> => {
    const res = await apiClient.post<ApiResponse<void>>('/auth/logout');
    return res.data;
  },

  getMe: async (): Promise<ApiResponse<User>> => {
    const res = await apiClient.get<ApiResponse<User>>('/auth/me');
    return res.data;
  },

  /** 겸직전환 (EE52, AS-IS Emp04_Lookup_AddTitleList → Sys02_User.getChangeInfo): 겸직 목록의 사원으로 새 토큰 쿠키를 받는다 */
  switchTitle: async (addPersonId: number): Promise<ApiResponse<User>> => {
    const res = await apiClient.post<ApiResponse<User>>('/auth/switch-title', { addPersonId });
    return res.data;
  },

  /** 인증번호 발송 (EE60, AS-IS sys.Sys25_Password.getCode). 인증번호는 서버가 들고 있다 */
  sendPasswordCode: async (companyCode: string, empNo: string, phone: string): Promise<ApiResponse<void>> => {
    const res = await apiClient.post<ApiResponse<void>>('/auth/password/code', { companyCode, empNo, phone });
    return res.data;
  },

  /** 인증번호 확인 (EE60, AS-IS Sys25_Lookup_Reset.resetPassword 의 비교 — 서버에서) */
  verifyPasswordCode: async (companyCode: string, empNo: string, code: string): Promise<ApiResponse<void>> => {
    const res = await apiClient.post<ApiResponse<void>>('/auth/password/verify', { companyCode, empNo, code });
    return res.data;
  },

  /** 비밀번호 변경 (EE59, AS-IS sys.Sys25_Password.checkPassword·checkPasswordRule·insert) */
  changePassword: async (companyCode: string, loginId: string, currentPassword: string | undefined, newPassword: string): Promise<ApiResponse<void>> => {
    const res = await apiClient.post<ApiResponse<void>>('/auth/password/change', { companyCode, loginId, currentPassword, newPassword });
    return res.data;
  },

  /** 비밀번호 만료 3개월 연장 (EE59, AS-IS sys.Sys25_Password.extension) */
  extendPassword: async (companyCode: string, loginId: string, currentPassword: string): Promise<ApiResponse<void>> => {
    const res = await apiClient.post<ApiResponse<void>>('/auth/password/extension', { companyCode, loginId, currentPassword });
    return res.data;
  },

  refresh: async (): Promise<ApiResponse<User>> => {
    const res = await apiClient.post<ApiResponse<User>>('/auth/refresh');
    return res.data;
  }
};
