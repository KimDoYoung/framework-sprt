import { apiClient } from './client';
import { ApiResponse } from '../types/auth';
import { OprCreate, OprFund } from '../types/opr';

/** opr(운용계획서) API — 펀드찾기 창 (EE100 Opr02_Lookup_Fund) */
export const oprApi = {
  /** AS-IS opr.Opr01_Create.selectByLookupTitle — 제목·작성자 이름, 년도 */
  searchCreates: async (title: string, year: string): Promise<OprCreate[]> => {
    const res = await apiClient.get<ApiResponse<OprCreate[]>>('v1/opr/creates', { params: { title, year } });
    return res.data.data ?? [];
  },

  /** AS-IS opr.Opr02_Fund.selectByCreateId — 내 조직 권한이 있는 연관펀드 */
  searchFunds: async (createId: number): Promise<OprFund[]> => {
    const res = await apiClient.get<ApiResponse<OprFund[]>>(`v1/opr/creates/${createId}/funds`);
    return res.data.data ?? [];
  },
};
