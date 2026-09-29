import { apiClient } from './client';
import { ApiResponse, AuditLogItem } from '../types/auth';

/** 보안 감사 로그 (관리자 전용) */
export const auditApi = {
  list: async (limit = 100): Promise<ApiResponse<AuditLogItem[]>> => {
    const res = await apiClient.get<ApiResponse<AuditLogItem[]>>('/audit/list', { params: { limit } });
    return res.data;
  }
};
