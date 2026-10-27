import { apiClient } from './client';
import { ApiResponse } from '../types/auth';
import { PfConfirmer, PfContract, PfContractSaveReq, PfFeeType, PfFile, PfHistory, PfHistorySaveReq } from '../types/est';

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

  // ── Q10 용역수행내역 등록 (Est03_Tab_PfHistory) ──

  /** AS-IS est.Est03_PfHistory.selectByPfContractId */
  searchPfHistories: async (pfContractId: number): Promise<PfHistory[]> => {
    const res = await apiClient.get<ApiResponse<PfHistory[]>>('v1/est/pf-histories', { params: { pfContractId } });
    return res.data.data ?? [];
  },

  /** AS-IS dbConfig.getSeq: [등록] 행·[행 추가] 증빙 행의 새 번호. DB에는 쓰지 않는다 */
  nextPfHistoryId: async (): Promise<number> => {
    const res = await apiClient.get<ApiResponse<number>>('v1/est/pf-histories/next-id');
    return res.data.data as number;
  },

  /** AS-IS est.Est03_PfHistory.getConfirmerParent: 로그인 사용자의 승인자(오늘 기준) */
  getPfConfirmerParent: async (date: string): Promise<PfConfirmer> => {
    const res = await apiClient.get<ApiResponse<PfConfirmer>>('v1/est/pf-histories/confirmer-parent', { params: { date } });
    return res.data.data ?? { confirmerId: null, confirmerName: null };
  },

  /** AS-IS est.Est04_PfFile.selectByPfHistoryId */
  searchPfFiles: async (pfHistoryId: number): Promise<PfFile[]> => {
    const res = await apiClient.get<ApiResponse<PfFile[]>>(`v1/est/pf-histories/${pfHistoryId}/files`);
    return res.data.data ?? [];
  },

  /** AS-IS est.Est04_PfFile.update·delete + est.Est03_PfHistory.modelUpdate(한 트랜잭션) → 저장된 행 */
  savePfHistory: async (req: PfHistorySaveReq): Promise<PfHistory> => {
    const res = await apiClient.put<ApiResponse<PfHistory>>('v1/est/pf-histories', req);
    return res.data.data as PfHistory;
  },

  /** AS-IS est.Est03_PfHistory.delete */
  deletePfHistories: async (ids: number[]): Promise<void> => {
    await apiClient.delete('v1/est/pf-histories', { data: ids });
  },

  // ── Q11 용역수행내역 승인 (Est03_Tab_PfHistoryConfirm) ──

  /** AS-IS est.Est03_PfHistory.selectByConfirmer01 (일자기준): 내가 승인자인 신청·승인 내역. confirm이 true면 미승인만. 검색어는 서버가 %…%로 */
  searchPfHistoriesByConfirmer: async (params: { startDate: string; searchText: string; confirm: boolean }): Promise<PfHistory[]> => {
    const res = await apiClient.get<ApiResponse<PfHistory[]>>('v1/est/pf-histories/confirm', { params });
    return res.data.data ?? [];
  },

  /** AS-IS est.Est03_PfHistory.selectByConfirmer02 (체결용역 기준) */
  searchPfHistoriesByConfirmerContract: async (pfContractId: number): Promise<PfHistory[]> => {
    const res = await apiClient.get<ApiResponse<PfHistory[]>>('v1/est/pf-histories/confirm/by-contract', { params: { pfContractId } });
    return res.data.data ?? [];
  },

  /** AS-IS est.Est03_PfHistory.updateConfirm: true 승인(20), false 승인취소(10) */
  updatePfHistoryConfirm: async (pfHistoryId: number, confirm: boolean): Promise<void> => {
    await apiClient.put(`v1/est/pf-histories/${pfHistoryId}/confirm`, null, { params: { confirm } });
  },

  /** AS-IS est.Est02_PfContract.selectById: 승인취소 전에 결과보고서(resultApprId)가 있는지 본다 */
  getPfContract: async (pfContractId: number): Promise<PfContract> => {
    const res = await apiClient.get<ApiResponse<PfContract>>(`v1/est/pf-contracts/${pfContractId}`);
    return res.data.data as PfContract;
  },
};
