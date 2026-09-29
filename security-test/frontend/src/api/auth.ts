import { apiClient } from './client';
import { ApiResponse, User } from '../types/auth';

export const authApi = {
  login: async (username: string, password: string):Promise<ApiResponse<User>> => {
    const res = await apiClient.post<ApiResponse<User>>('/auth/login', { username, password });
    return res.data;
  },

  logout: async (): Promise<ApiResponse<void>> => {
    const res = await apiClient.post<ApiResponse<void>>('/auth/logout');
    return res.data;
  },

  getMe: async (): Promise<ApiResponse<User>> => {
    const res = await apiClient.get<ApiResponse<User>>('/auth/me');
    return res.data;
  }
};
