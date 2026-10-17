import { apiClient } from './client';
import { ApiResponse } from '../types/auth';
import { FltItemType } from '../types/flt';

/** flt(임직원매매) 화면 API (E08~) */
export const fltApi = {
  // ── E08 임직원매매 종목유형관리 (Flt05_Tab_ItemTypeAdmin) ──

  /** AS-IS flt.Flt05_ItemType.selectBySearchText: companyId가 없으면 로그인 회사, 다른 회사는 관리자 회사만 */
  searchItemTypes: async (searchText: string, companyId?: number): Promise<FltItemType[]> => {
    const res = await apiClient.get<ApiResponse<FltItemType[]>>('v1/flt/item-types', { params: { companyId, searchText } });
    return res.data.data ?? [];
  },

  /** AS-IS flt.Flt05_ItemType.update → 저장된 행(요청 순서) */
  updateItemTypes: async (rows: FltItemType[], companyId?: number): Promise<FltItemType[]> => {
    const body = rows.map(({ itemTypeId, itemTypeCode, itemTypeName, seq, startDate, targetYn, sellPreApprYn, lockUpCheckYn, stkPriceYn, listStkYn }) =>
      ({ itemTypeId, itemTypeCode, itemTypeName, seq, startDate, targetYn, sellPreApprYn, lockUpCheckYn, stkPriceYn, listStkYn }));
    const res = await apiClient.put<ApiResponse<FltItemType[]>>('v1/flt/item-types', body, { params: { companyId } });
    return res.data.data ?? [];
  },

  /** AS-IS flt.Flt05_ItemType.delete → 지운 건수 */
  deleteItemTypes: async (ids: number[], companyId?: number): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/flt/item-types', { data: ids, params: { companyId } });
    return res.data.data ?? 0;
  },

  /** AS-IS flt.Flt05_ItemType.insertInitData: 고른 종목유형을 고객사로 복사 (관리자) → 복사한 건수 */
  copyItemTypes: async (companyId: number, itemTypeIds: number[]): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>('v1/flt/item-types/copy', { companyId, itemTypeIds });
    return res.data.data ?? 0;
  },
};
