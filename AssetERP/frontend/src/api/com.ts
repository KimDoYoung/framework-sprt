import { apiClient } from './client';
import { ApiResponse, PageRes } from '../types/auth';
import { Com50Item, ComRelateAppr, FormMapping, FormMappingMulti } from '../types/com';

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

/** EE34 증빙자료 창 Com01_Lookup_RelateAppr (AS-IS server/com/Com01_RelateAppr) */
export const comRelateApprApi = {
  /** AS-IS com.Com01_RelateAppr.selectByKeyTableId */
  search: async (keyTableId: number): Promise<ComRelateAppr[]> => {
    const res = await apiClient.get<ApiResponse<ComRelateAppr[]>>('v1/com/relate-apprs', { params: { keyTableId } });
    return res.data.data ?? [];
  },
  /** AS-IS com.Com01_RelateAppr.modelUpdate·listUpdate — 문서마다 연결 한 행. keyTable 은 연결 테이블명 앞 5자리 */
  add: async (keyTable: string, keyTableId: number, apprIds: number[]): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>('v1/com/relate-apprs', { keyTable, keyTableId, apprIds });
    return res.data.data ?? 0;
  },
  /** AS-IS com.Com01_RelateAppr.delete */
  delete: async (relateApprIds: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/com/relate-apprs', { data: relateApprIds });
    return res.data.data ?? 0;
  },
  /** erpProductCode 가 S1이 아닌 회사만 [신규문서 작성]을 둔다 */
  apprButton: async (): Promise<boolean> => {
    const res = await apiClient.get<ApiResponse<boolean>>('v1/com/relate-apprs/appr-button');
    return res.data.data ?? false;
  },
  /** AS-IS apr.Apr01_Appr.permissionsCheck — 상세보기 열람권한 */
  permission: async (apprId: number): Promise<boolean> => {
    const res = await apiClient.get<ApiResponse<boolean>>(`v1/com/relate-apprs/${apprId}/permission`);
    return res.data.data ?? false;
  },
};
