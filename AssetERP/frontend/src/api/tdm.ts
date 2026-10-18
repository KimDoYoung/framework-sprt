import { apiClient } from './client';
import { ApiResponse } from '../types/auth';
import { Manl, ManlRelateIcs, TdmRoleDesc } from '../types/tdm';

/** tdm(책무) 화면 API */
export const tdmApi = {
  // ── E01 법규관리(관리자) — 연결 책무이행점검(Ics01_Lookup_RelateTdm·Ics01_Lookup_SelectTdm) ──

  /** AS-IS tdm.Tdm45_ManlRelateIcs.selectByIcsId: 법규에 연결된 점검항목(관리자 회사만 행이 나온다) */
  searchManlRelateIcs: async (icsId: number, searchText: string): Promise<ManlRelateIcs[]> => {
    const res = await apiClient.get<ApiResponse<ManlRelateIcs[]>>('v1/tdm/manl-relate-ics', { params: { icsId, searchText } });
    return res.data.data ?? [];
  },

  /** AS-IS tdm.Tdm43_Manl.selectByExceptIcsId: 연결할 점검항목 후보 */
  searchManlCandidates: async (icsId: number, searchText: string): Promise<Manl[]> => {
    const res = await apiClient.get<ApiResponse<Manl[]>>('v1/tdm/manl-relate-ics/candidates', { params: { icsId, searchText } });
    return res.data.data ?? [];
  },

  /** AS-IS tdm.Tdm45_ManlRelateIcs.insertList → 새로 연결한 건수 */
  addManlRelateIcs: async (icsId: number, manlIds: number[]): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>('v1/tdm/manl-relate-ics', { icsId, manlIds });
    return res.data.data ?? 0;
  },

  /** AS-IS tdm.Tdm45_ManlRelateIcs.delete → 지운 건수 */
  deleteManlRelateIcs: async (icsId: number, manlRelateIcsIds: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/tdm/manl-relate-ics', { params: { icsId }, data: manlRelateIcsIds });
    return res.data.data ?? 0;
  },

  // ── E11 책무기술서 재생성(Tdm31_Tab_RoleDescAdmin) ──

  /** AS-IS tdm.Tdm31_RoleDesc.selectByRegDateAdmin (companyId 없음 = 전체, 관리자 회사만. 일자는 전체보기가 아닐 때만 건다) */
  searchRoleDescs: async (p: { companyId?: number; startDate: string; closeDate: string; searchText: string; endYn: boolean; notPeriodYn: boolean }): Promise<TdmRoleDesc[]> => {
    const res = await apiClient.get<ApiResponse<TdmRoleDesc[]>>('v1/tdm/role-descs', { params: p });
    return res.data.data ?? [];
  },

  /** 한 건 재생성 (AS-IS createRd 한 건 분량). RD 연동이 없는 동안 서버가 거절한다 */
  recreateRoleDesc: async (roleDescId: number): Promise<void> => {
    await apiClient.post<ApiResponse<null>>(`v1/tdm/role-descs/${roleDescId}/recreate`);
  },
};
