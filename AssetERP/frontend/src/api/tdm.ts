import { apiClient } from './client';
import { ApiResponse } from '../types/auth';
import { Manl, ManlRelateIcs } from '../types/tdm';

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
};
