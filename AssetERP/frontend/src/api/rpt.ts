import { apiClient } from './client';
import { ApiResponse } from '../types/auth';
import { RptFssSubmit, RptFssSubmitSaveReq } from '../types/rpt';

/** rpt(보고서) API (E19 금감원 업무보고서) */
export const rptApi = {
  /** AS-IS rpt.Rpt10_FssSubmit.selectBySearchText — 서버가 "%검색어%"로 감싼다 */
  searchFssSubmits: async (searchText: string): Promise<RptFssSubmit[]> => {
    const res = await apiClient.get<ApiResponse<RptFssSubmit[]>>('v1/rpt/fss-submits', { params: { searchText } });
    return res.data.data ?? [];
  },

  /** AS-IS rpt.Rpt10_FssSubmit.modelUpdate → 저장된 행 (submitId 없으면 등록) */
  saveFssSubmit: async (req: RptFssSubmitSaveReq): Promise<RptFssSubmit> => {
    const res = await apiClient.put<ApiResponse<RptFssSubmit>>('v1/rpt/fss-submits', req);
    return res.data.data;
  },

  /** AS-IS rpt.Rpt10_FssSubmit.delete → 지운 건수 */
  deleteFssSubmits: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/rpt/fss-submits', { data: ids });
    return res.data.data ?? 0;
  },
};
