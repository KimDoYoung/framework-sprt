import { apiClient } from './client';
import { ApiResponse } from '../types/auth';
import { BmtBuy, BmtEmpIct, BmtHistory, BmtInfo, BmtInfoSaveReq, BmtPcHistory, BmtPcHistorySaveReq, BmtRelateAppr } from '../types/bmt';

/** L05 AS-IS Bmt01_Tab_Buy (판촉물 구매 및 제공내역) */
export const bmtBuyApi = {
  /** AS-IS bmt.Bmt01_Buy.selectByCompanyId — 날짜 'yyyy-MM-dd', leftYn = 재고없음 제외 */
  searchBuys: async (startDate: string, closeDate: string, leftYn: boolean): Promise<BmtBuy[]> => {
    const res = await apiClient.get<ApiResponse<BmtBuy[]>>('v1/bmt/buys', { params: { startDate, closeDate, leftYn } });
    return res.data.data ?? [];
  },
  /** AS-IS bmt.Bmt01_Buy.update — 변경 행(buyId ≤ 0은 새 행) → 다시 읽은 행들(요청 순서) */
  saveBuys: async (rows: BmtBuy[]): Promise<BmtBuy[]> => {
    const res = await apiClient.put<ApiResponse<BmtBuy[]>>('v1/bmt/buys', rows);
    return res.data.data ?? [];
  },
  /** AS-IS bmt.Bmt01_Buy.delete → 지운 건수 */
  deleteBuys: async (buyIds: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/bmt/buys', { data: buyIds });
    return res.data.data ?? 0;
  },
  /** AS-IS Bmt01_Tab_Buy.updateApprId → bmt.Bmt01_Buy.update (A04 상신 뒤 결재문서 ID 기록, V38) */
  updateApprId: async (buyId: number, apprId: number): Promise<void> => {
    await apiClient.put<ApiResponse<null>>(`v1/bmt/buys/${buyId}/appr-id`, { apprId });
  },
};

/** T20 AS-IS Bmt12_Tab_EmpIct (임직원 정보통신수단) */
export const bmtEmpIctApi = {
  /** AS-IS bmt.Bmt12_PcHistory.selectEmpICT — 기준일 'yyyy-MM-dd', searchText는 글자만(서버가 %로 감싼다) */
  search: async (stdDate: string, searchText: string): Promise<BmtEmpIct[]> => {
    const res = await apiClient.get<ApiResponse<BmtEmpIct[]>>('v1/bmt/emp-icts', { params: { stdDate, searchText } });
    return res.data.data ?? [];
  },
  /** AS-IS sys.Sys99_Print.insertRdEmplct → 출력 그룹 ID */
  rdPrint: async (stdDate: string, searchText: string): Promise<string> => {
    const res = await apiClient.post<ApiResponse<string>>('v1/bmt/emp-icts/rd-print', null, { params: { stdDate, searchText } });
    return res.data.data;
  },
};

/** W18 AS-IS Bmt10_Tab_Info·Bmt10_Edit_Info (전산장비관리) → server/bmt/Bmt10_Info */
export const bmtInfoApi = {
  /** AS-IS bmt.Bmt10_Info.selectByCompanyId — itemClassCode 없으면 전체, baseDate 'yyyy-MM-dd', checkYn = 폐기건 포함, searchText는 글자만(서버가 %로 감싼다) */
  search: async (p: { itemClassCode?: string | null; baseDate: string; checkYn: boolean; searchText?: string }): Promise<BmtInfo[]> => {
    const res = await apiClient.get<ApiResponse<BmtInfo[]>>('v1/bmt/infos', { params: { ...p, itemClassCode: p.itemClassCode ?? undefined, searchText: p.searchText ?? '' } });
    return res.data.data ?? [];
  },
  /** AS-IS bmt.Bmt10_Info.selectByBaseDate — 한 행 다시 읽기 */
  get: async (infoId: number, baseDate: string): Promise<BmtInfo> => {
    const res = await apiClient.get<ApiResponse<BmtInfo>>(`v1/bmt/infos/${infoId}`, { params: { baseDate } });
    return res.data.data;
  },
  /** AS-IS bmt.Bmt10_Info.modelUpdate (신규) → 새 ID */
  create: async (req: BmtInfoSaveReq): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>('v1/bmt/infos', req);
    return res.data.data;
  },
  /** AS-IS bmt.Bmt10_Info.modelUpdate (수정) */
  update: async (infoId: number, req: BmtInfoSaveReq): Promise<number> => {
    const res = await apiClient.put<ApiResponse<number>>(`v1/bmt/infos/${infoId}`, req);
    return res.data.data;
  },
  /** AS-IS bmt.Bmt10_Info.modelDelete */
  remove: async (infoId: number): Promise<void> => {
    await apiClient.delete<ApiResponse<null>>(`v1/bmt/infos/${infoId}`);
  },
};

/** W18 AS-IS Bmt11_TabPage_History (전산장비 사용자이력) → server/bmt/Bmt11_History */
export const bmtHistoryApi = {
  /** AS-IS bmt.Bmt11_History.selectByInfoId */
  search: async (infoId: number): Promise<BmtHistory[]> => {
    const res = await apiClient.get<ApiResponse<BmtHistory[]>>('v1/bmt/histories', { params: { infoId } });
    return res.data.data ?? [];
  },
  /** AS-IS bmt.Bmt11_History.update — 변경 행(historyId ≤ 0은 새 행) → 다시 읽은 행들(요청 순서) */
  save: async (infoId: number, rows: BmtHistory[]): Promise<BmtHistory[]> => {
    const res = await apiClient.put<ApiResponse<BmtHistory[]>>('v1/bmt/histories', rows, { params: { infoId } });
    return res.data.data ?? [];
  },
  /** AS-IS bmt.Bmt11_History.delete → 지운 건수 */
  remove: async (historyIds: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/bmt/histories', { data: historyIds });
    return res.data.data ?? 0;
  },
};

/** W18 AS-IS Bmt10_Lookup_History·Bmt12_Edit_PcHistory (PC 이력) → server/bmt/Bmt12_PcHistory */
export const bmtPcHistoryApi = {
  /** AS-IS bmt.Bmt12_PcHistory.selectByInfoId */
  search: async (infoId: number): Promise<BmtPcHistory[]> => {
    const res = await apiClient.get<ApiResponse<BmtPcHistory[]>>('v1/bmt/pc-histories', { params: { infoId } });
    return res.data.data ?? [];
  },
  /** AS-IS bmt.Bmt12_PcHistory.modelUpdate (신규·추가등록) → 저장한 행 */
  create: async (req: BmtPcHistorySaveReq): Promise<BmtPcHistory> => {
    const res = await apiClient.post<ApiResponse<BmtPcHistory>>('v1/bmt/pc-histories', req);
    return res.data.data;
  },
  /** AS-IS bmt.Bmt12_PcHistory.modelUpdate (정보수정) → 저장한 행 */
  update: async (pcHistoryId: number, req: BmtPcHistorySaveReq): Promise<BmtPcHistory> => {
    const res = await apiClient.put<ApiResponse<BmtPcHistory>>(`v1/bmt/pc-histories/${pcHistoryId}`, req);
    return res.data.data;
  },
  /** AS-IS bmt.Bmt12_PcHistory.delete → 지운 건수 */
  remove: async (pcHistoryIds: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/bmt/pc-histories', { data: pcHistoryIds });
    return res.data.data ?? 0;
  },
};

/** W18 AS-IS Bmt20_Lookup_RelateAppr (전산장비 연관문서) → server/bmt/Bmt20_RelateAppr */
export const bmtRelateApprApi = {
  /** AS-IS bmt.Bmt20_RelateAppr.selectByInfoId */
  search: async (infoId: number): Promise<BmtRelateAppr[]> => {
    const res = await apiClient.get<ApiResponse<BmtRelateAppr[]>>('v1/bmt/relate-apprs', { params: { infoId } });
    return res.data.data ?? [];
  },
  /** AS-IS bmt.Bmt20_RelateAppr.modelUpdate → 새 ID */
  create: async (infoId: number, apprId: number): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>('v1/bmt/relate-apprs', { infoId, apprId });
    return res.data.data;
  },
  /** AS-IS bmt.Bmt20_RelateAppr.delete → 지운 건수 */
  remove: async (relateApprIds: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/bmt/relate-apprs', { data: relateApprIds });
    return res.data.data ?? 0;
  },
};
