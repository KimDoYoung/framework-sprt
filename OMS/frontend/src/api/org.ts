import { apiClient } from './client';
import { ApiResponse } from '../types/auth';
import { OrgCode, OrgCodeSave, OrgHistory, OrgInfo } from '../types/org';

export const orgApi = {
  /** 조직 Lookup: 기준일(yyyy-MM-dd, 없으면 오늘)의 조직 중 조직명 LIKE */
  /** companyId: KFS 관리자가 다른 회사 조직을 찾을 때 (그 외에는 서버가 로그인 회사로 바꾼다) */
  searchOrgInfos: async (korNm?: string, baseDate?: string, companyId?: number): Promise<OrgInfo[]> => {
    const res = await apiClient.get<ApiResponse<OrgInfo[]>>('v1/org/org-infos', { params: { korNm, baseDate, companyId } });
    return res.data.data ?? [];
  },

  /** 기준일(yyyy-MM-dd) 회사 조직 트리 */
  searchOrgCodes: async (baseDate: string): Promise<OrgCode[]> => {
    const res = await apiClient.get<ApiResponse<OrgCode[]>>('v1/org/codes', { params: { baseDate } });
    return res.data.data ?? [];
  },

  createOrgCode: async (body: OrgCodeSave): Promise<OrgCode> => {
    const res = await apiClient.post<ApiResponse<OrgCode>>('v1/org/codes', body);
    return res.data.data;
  },

  /** 편집 이력(infoId)의 변경일이 바뀌면 서버가 새 이력을 만든다 */
  updateOrgCode: async (codeId: number, body: OrgCodeSave): Promise<OrgCode> => {
    const res = await apiClient.put<ApiResponse<OrgCode>>(`v1/org/codes/${codeId}`, body);
    return res.data.data;
  },

  searchOrgHistories: async (codeId: number): Promise<OrgHistory[]> => {
    const res = await apiClient.get<ApiResponse<OrgHistory[]>>(`v1/org/codes/${codeId}/histories`);
    return res.data.data ?? [];
  },

  deleteOrgHistory: async (codeId: number, infoId: number): Promise<void> => {
    await apiClient.delete(`v1/org/codes/${codeId}/histories/${infoId}`);
  },

  /** 조직 삭제 (하위 조직·발령 사원이 있으면 서버가 거절) */
  deleteOrg: async (codeId: number): Promise<void> => {
    await apiClient.delete(`v1/org/codes/${codeId}`);
  },
};
