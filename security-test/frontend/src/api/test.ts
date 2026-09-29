import { apiClient } from './client';
import { ApiResponse } from '../types/auth';

export interface PingRes {
  callSeq: number;
  serverTime: string;
  username: string;
  name: string;
  jti: string;
  message: string;
}

export const testApi = {
  ping: async (): Promise<ApiResponse<PingRes>> => {
    const res = await apiClient.get<ApiResponse<PingRes>>('/test/ping');
    return res.data;
  }
};
