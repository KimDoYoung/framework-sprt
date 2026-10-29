import { apiClient } from './client';
import { ApiResponse } from '../types/auth';
import { BmtBuy, BmtEmpIct } from '../types/bmt';

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
