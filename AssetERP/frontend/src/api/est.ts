import { apiClient } from './client';
import { ApiResponse } from '../types/auth';
import { PfContract, PfContractSaveReq, PfFeeType } from '../types/est';

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

  /** AS-IS est.Est01_PfFeeType.selectByText (Est01_Lookup_PfFeeType): 조회일에 사용 중인 항목 중 이름·정의에 검색어가 든 것 */
  lookupPfFeeTypes: async (params: { startDate: string; searchText: string }): Promise<PfFeeType[]> => {
    const res = await apiClient.get<ApiResponse<PfFeeType[]>>('v1/est/pf-fee-types/lookup', { params });
    return res.data.data ?? [];
  },

  // ── Q09 용역계약체결 (Est02_Tab_PfContract) ──

  /** AS-IS est.Est02_PfContract.selectByText: 검색어(차주명/사업자명/수수료명)는 서버가 %…%로, 조회기준일에 수행 중인 계약 */
  searchPfContracts: async (params: { startDate: string; searchText: string }): Promise<PfContract[]> => {
    const res = await apiClient.get<ApiResponse<PfContract[]>>('v1/est/pf-contracts', { params });
    return res.data.data ?? [];
  },

  /** AS-IS dbConfig.getSeq: 등록 창의 새 번호. DB에는 쓰지 않는다 */
  nextPfContractId: async (): Promise<number> => {
    const res = await apiClient.get<ApiResponse<number>>('v1/est/pf-contracts/next-id');
    return res.data.data as number;
  },

  /** AS-IS est.Est02_PfContract.modelUpdate → 저장된 행 */
  savePfContract: async (req: PfContractSaveReq): Promise<PfContract> => {
    const res = await apiClient.put<ApiResponse<PfContract>>('v1/est/pf-contracts', req);
    return res.data.data as PfContract;
  },

  /** AS-IS est.Est02_PfContract.delete */
  deletePfContracts: async (ids: number[]): Promise<void> => {
    await apiClient.delete('v1/est/pf-contracts', { data: ids });
  },

  /** AS-IS est.Est03_PfHistory.checkList: 이 용역계약들의 수행내역 건수 */
  countPfContractHistories: async (ids: number[]): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>('v1/est/pf-contracts/history-count', ids);
    return res.data.data ?? 0;
  },
};
