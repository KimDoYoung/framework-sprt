import { apiClient } from './client';
import { ApiResponse, UserItem } from '../types/auth';

/** 사용자 관리 (관리자 전용) */
export const userApi = {
  list: async (): Promise<ApiResponse<UserItem[]>> => {
    const res = await apiClient.get<ApiResponse<UserItem[]>>('/user/list');
    return res.data;
  },

  unlock: async (userId: number): Promise<ApiResponse<void>> => {
    const res = await apiClient.post<ApiResponse<void>>(`/user/${userId}/unlock`);
    return res.data;
  }
};
