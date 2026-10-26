import { apiClient } from './client';
import { ApiResponse, PageRes } from '../types/auth';
import { Com50Item, FormMapping, FormMappingMulti } from '../types/com';

/** com(공통) 화면 API (E17~) */
export const comApi = {
  /** AS-IS com.Com10_FormMapping.selectById: 없으면 null(화면이 새 양식으로 연다) */
  getFormMapping: async (formMappingId: number): Promise<FormMapping | null> => {
    const res = await apiClient.get<ApiResponse<FormMapping | null>>(`v1/com/form-mappings/${formMappingId}`);
    return res.data.data ?? null;
  },

  /** AS-IS com.Com10_FormMapping.modelUpdate: 번호가 없으면 새로 만들고 linkId가 있으면 그 Link에 연결 → 양식 번호 */
  updateFormMapping: async (req: { formMappingId?: number | null; linkId?: number | null; content: string }): Promise<number> => {
    const res = await apiClient.put<ApiResponse<number>>('v1/com/form-mappings', req);
    return res.data.data;
  },

  // ── E20 종목(주식/ETF) 찾기·상장주식 종목 등록 (Com50_Lookup_StkItem) ──

  /** AS-IS com.Com50_Item.selectByTextPaging (+Total): itemType 2010=주식, 한 쪽 limit건 */
  searchItems: async (itemType: string, searchText: string, limit: number, offset: number): Promise<PageRes<Com50Item>> => {
    const res = await apiClient.get<ApiResponse<PageRes<Com50Item>>>('v1/com/items', { params: { itemType, searchText, limit, offset } });
    return res.data.data ?? { total: 0, rows: [] };
  },

  /** AS-IS com.Com50_Item.update → 저장된 행(요청 순서) */
  updateItems: async (rows: Com50Item[]): Promise<Com50Item[]> => {
    const body = rows.map(({ itemId, itemCode, itemName, itemType }) => ({ itemId, itemCode, itemName, itemType }));
    const res = await apiClient.put<ApiResponse<Com50Item[]>>('v1/com/items', body);
    return res.data.data ?? [];
  },

  /** AS-IS com.Com50_Item.delete → 지운 건수 */
  deleteItems: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/com/items', { data: ids });
    return res.data.data ?? 0;
  },

  /** AS-IS com.Com11_FormMappingMulti.getUpdateModel: 저장된 양식, 없으면 번호만 새로 받은 빈 양식 */
  getFormMappingMulti: async (kindCode: string, detailCode: string | null, linkCode: string): Promise<FormMappingMulti> => {
    const res = await apiClient.get<ApiResponse<FormMappingMulti>>('v1/com/form-mapping-multis', { params: { kindCode, detailCode, linkCode } });
    return res.data.data as FormMappingMulti;
  },

  /** AS-IS com.Com11_FormMappingMulti.modelUpdate → 양식 번호 */
  updateFormMappingMulti: async (req: { formMappingMultiId: number; sysKindCode: string; sysDetailCode: string | null; linkCode: string; content: string }): Promise<number> => {
    const res = await apiClient.put<ApiResponse<number>>('v1/com/form-mapping-multis', req);
    return res.data.data as number;
  },
};
