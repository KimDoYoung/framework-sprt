import { apiClient } from './client';
import { ApiResponse, CompanyItem, TenantInfo, User } from '../types/auth';

export const authApi = {
  /** companyCode는 admin 서브도메인에서 회사를 선택한 경우에만 사용된다 (그 외에는 서버가 호스트로 판정) */
  login: async (username: string, password: string, companyCode?: string): Promise<ApiResponse<User>> => {
    const res = await apiClient.post<ApiResponse<User>>('/auth/login', { username, password, companyCode });
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

  refresh: async (): Promise<ApiResponse<User>> => {
    const res = await apiClient.post<ApiResponse<User>>('/auth/refresh');
    return res.data;
  }
};
