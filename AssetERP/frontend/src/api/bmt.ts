import { apiClient } from './client';
import { ApiResponse } from '../types/auth';
import { BmtBuy } from '../types/bmt';

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
