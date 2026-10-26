import { apiClient } from './client';
import { ApiResponse } from '../types/auth';
import { PfFeeType } from '../types/est';

/** est(부동산PF 용역수행) 화면 API (Q08~) */
export const estApi = {
  // ── Q08 부동산PF 수수료 (Est01_Tab_PfFeeType) ──

  /** AS-IS est.Est01_PfFeeType.selectByCompanyId */
  searchPfFeeTypes: async (): Promise<PfFeeType[]> => {
    const res = await apiClient.get<ApiResponse<PfFeeType[]>>('v1/est/pf-fee-types');
    return res.data.data ?? [];
  },

  /** AS-IS est.Est01_PfFeeType.update: 임시 행(ID ≤ 0)은 새 행 → 저장된 행(요청 순서) */
  savePfFeeTypes: async (rows: PfFeeType[]): Promise<PfFeeType[]> => {
    const res = await apiClient.put<ApiResponse<PfFeeType[]>>('v1/est/pf-fee-types', rows);
    return res.data.data ?? [];
  },

  /** AS-IS est.Est01_PfFeeType.delete */
  deletePfFeeTypes: async (ids: number[]): Promise<void> => {
    await apiClient.delete('v1/est/pf-fee-types', { data: ids });
  },

  /** AS-IS est.Est02_PfContract.checkList: 이 수수료 항목을 쓰는 용역계약 건수 */
  countPfFeeTypesInUse: async (ids: number[]): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>('v1/est/pf-fee-types/in-use', ids);
    return res.data.data ?? 0;
  },
};
