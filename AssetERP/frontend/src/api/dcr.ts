import { apiClient } from './client';
import { ApiResponse } from '../types/auth';
import {
  DcrCheckRes, DcrCheckRowReq, DcrClassDetail, DcrClassTree, DcrClassTreeAll, DcrClassTreeLookup, DcrClassTreeSaveReq,
  DcrCopyCompany, DcrDocType, DcrDocTypeRow, DcrDocTypeSaveReq, DcrDocTypeUpdateReq, DcrRelateDocType, DcrRelateIcr,
  DcrRelateIcs, DcrRelateSaveReq, DcrUseYnReq,
} from '../types/dcr';

/** dcr(문서분류) API (E13-3 조회창, E16 문서분류) */
export const dcrApi = {
  /** AS-IS dcr.Dcr01_ClassTree.selectByText(typeCode T, useYn true): 문서분류 조회창. relateTable 'TDM47'+점검항목 ID면 그 점검항목에 연결 안 된 것만 */
  searchLookup: async (searchText: string, relateTable?: string, relateId?: number): Promise<DcrClassTreeLookup[]> => {
    const res = await apiClient.get<ApiResponse<DcrClassTreeLookup[]>>('v1/dcr/class-trees/lookup', { params: { searchText, relateTable, relateId } });
    return res.data.data ?? [];
  },

  // ── E16 문서분류 (Dcr01_Tab_ClassTree 외) ──

  /** AS-IS dcr.Dcr01_ClassTree.selectByCompanyId: 사용 중인 분류 트리(전위 순서, depth). typeCode 기본 'C', 이동·반영 창은 '%' */
  searchClassTree: async (typeCode = 'C'): Promise<DcrClassTree[]> => {
    const res = await apiClient.get<ApiResponse<DcrClassTree[]>>('v1/dcr/class-trees', { params: { typeCode } });
    return res.data.data ?? [];
  },

  /** AS-IS dcr.Dcr01_ClassTree.selectByAll: 사용 여부와 관계없는 전체 트리 */
  searchClassTreeAll: async (typeCode = '%'): Promise<DcrClassTreeAll[]> => {
    const res = await apiClient.get<ApiResponse<DcrClassTreeAll[]>>('v1/dcr/class-trees/all', { params: { typeCode } });
    return res.data.data ?? [];
  },

  /** AS-IS dcr.Dcr01_ClassTree.selectByClassTreeId: 고른 분류 아래 문서구분(T) */
  searchDocTypeRows: async (parentId: number, searchText: string): Promise<DcrDocTypeRow[]> => {
    const res = await apiClient.get<ApiResponse<DcrDocTypeRow[]>>(`v1/dcr/class-trees/${parentId}/doc-types`, { params: { searchText } });
    return res.data.data ?? [];
  },

  /** AS-IS dcr.Dcr01_ClassTree.update (새 문서분류 C) → 저장된 행 */
  createClassTree: async (req: DcrClassTreeSaveReq): Promise<DcrClassTree> => {
    const res = await apiClient.post<ApiResponse<DcrClassTree>>('v1/dcr/class-trees', req);
    return res.data.data;
  },

  /** AS-IS dcr.Dcr01_ClassTree.update (수정) → 저장된 행 */
  updateClassTree: async (classTreeId: number, req: DcrClassTreeSaveReq): Promise<DcrClassTree> => {
    const res = await apiClient.put<ApiResponse<DcrClassTree>>(`v1/dcr/class-trees/${classTreeId}`, req);
    return res.data.data;
  },

  /** AS-IS dcr.Dcr01_ClassTree.update (상위 분류 이동) → 저장된 행 */
  moveClassTree: async (classTreeId: number, parentTreeId: number): Promise<DcrClassTree> => {
    const res = await apiClient.put<ApiResponse<DcrClassTree>>(`v1/dcr/class-trees/${classTreeId}/parent`, { parentTreeId });
    return res.data.data;
  },

  /** AS-IS dcr.Dcr01_ClassTree.update (문서구분 T 그리드 저장) → 저장된 행(요청 순서) */
  saveDocTypeRows: async (rows: DcrDocTypeSaveReq[]): Promise<DcrDocTypeRow[]> => {
    const res = await apiClient.put<ApiResponse<DcrDocTypeRow[]>>('v1/dcr/class-trees/doc-types', rows);
    return res.data.data ?? [];
  },

  /** AS-IS dcr.Dcr01_ClassTree.update (사용여부 설정) → 바뀐 건수 */
  updateUseYn: async (rows: DcrUseYnReq[]): Promise<number> => {
    const res = await apiClient.put<ApiResponse<number>>('v1/dcr/class-trees/use-yn', rows);
    return res.data.data ?? 0;
  },

  /** AS-IS dcr.Dcr01_ClassTree.updateCheck: status 1 통과, -1이면 message */
  checkUpdate: async (rows: DcrCheckRowReq[]): Promise<DcrCheckRes> => {
    const res = await apiClient.post<ApiResponse<DcrCheckRes>>('v1/dcr/class-trees/check-update', rows);
    return res.data.data;
  },

  /** AS-IS dcr.Dcr01_ClassTree.deleteCheck: status 0이면 지워도 됨 */
  checkDelete: async (classTreeId: number): Promise<DcrCheckRes> => {
    const res = await apiClient.get<ApiResponse<DcrCheckRes>>(`v1/dcr/class-trees/${classTreeId}/delete-check`);
    return res.data.data;
  },

  /** AS-IS dcr.Dcr01_ClassTree.deleteAll → 지운 분류 수 */
  deleteClassTree: async (classTreeId: number): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>(`v1/dcr/class-trees/${classTreeId}`);
    return res.data.data ?? 0;
  },

  /** AS-IS sys.Sys01_Company.selectByUseYn (문서분류 반영 대상 운용사, 관리자 회사만) */
  searchCopyCompanies: async (): Promise<DcrCopyCompany[]> => {
    const res = await apiClient.get<ApiResponse<DcrCopyCompany[]>>('v1/dcr/class-trees/copy-companies');
    return res.data.data ?? [];
  },

  /** AS-IS dcr.Dcr01_ClassTree.insertAdminCopy (관리자 회사만) → 반영한 회사 수 */
  adminCopy: async (dcrClassTreeId: number, companyIds: number[]): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>('v1/dcr/class-trees/admin-copy', { dcrClassTreeId, companyIds });
    return res.data.data ?? 0;
  },

  /** 로그인 회사의 AssetERP 상품코드 (S1이면 사용여부설정 버튼을 숨김) */
  getProductCode: async (): Promise<string | null> => {
    const res = await apiClient.get<ApiResponse<string | null>>('v1/dcr/class-trees/product-code');
    return res.data.data ?? null;
  },

  // ── 세부분류 (Dcr07_Lookup_ClassDetail) ──

  searchClassDetails: async (classTreeId: number): Promise<DcrClassDetail[]> => {
    const res = await apiClient.get<ApiResponse<DcrClassDetail[]>>('v1/dcr/class-details', { params: { classTreeId } });
    return res.data.data ?? [];
  },

  saveClassDetails: async (rows: DcrClassDetail[]): Promise<DcrClassDetail[]> => {
    const res = await apiClient.put<ApiResponse<DcrClassDetail[]>>('v1/dcr/class-details', rows);
    return res.data.data ?? [];
  },

  deleteClassDetails: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/dcr/class-details', { data: ids });
    return res.data.data ?? 0;
  },

  // ── 연결 문서양식 (Dcr06_Lookup_Form) ──

  searchRelateDocTypes: async (classTreeId: number): Promise<DcrRelateDocType[]> => {
    const res = await apiClient.get<ApiResponse<DcrRelateDocType[]>>('v1/dcr/relate-doc-types', { params: { classTreeId } });
    return res.data.data ?? [];
  },

  saveRelateDocTypes: async (rows: DcrRelateDocType[]): Promise<DcrRelateDocType[]> => {
    const res = await apiClient.put<ApiResponse<DcrRelateDocType[]>>('v1/dcr/relate-doc-types', rows);
    return res.data.data ?? [];
  },

  deleteRelateDocTypes: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/dcr/relate-doc-types', { data: ids });
    return res.data.data ?? 0;
  },

  // ── 연결 법규 (Dcr20_Lookup_Ics) · 연결 내규 (Dcr21_Lookup_Icr) ──

  searchRelateIcs: async (dcrClassTreeId: number): Promise<DcrRelateIcs[]> => {
    const res = await apiClient.get<ApiResponse<DcrRelateIcs[]>>('v1/dcr/relate-ics', { params: { dcrClassTreeId } });
    return res.data.data ?? [];
  },

  saveRelateIcs: async (rows: DcrRelateSaveReq[]): Promise<DcrRelateIcs[]> => {
    const res = await apiClient.put<ApiResponse<DcrRelateIcs[]>>('v1/dcr/relate-ics', rows);
    return res.data.data ?? [];
  },

  deleteRelateIcs: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/dcr/relate-ics', { data: ids });
    return res.data.data ?? 0;
  },

  searchRelateIcr: async (dcrClassTreeId: number): Promise<DcrRelateIcr[]> => {
    const res = await apiClient.get<ApiResponse<DcrRelateIcr[]>>('v1/dcr/relate-icr', { params: { dcrClassTreeId } });
    return res.data.data ?? [];
  },

  saveRelateIcr: async (rows: DcrRelateSaveReq[]): Promise<DcrRelateIcr[]> => {
    const res = await apiClient.put<ApiResponse<DcrRelateIcr[]>>('v1/dcr/relate-icr', rows);
    return res.data.data ?? [];
  },

  deleteRelateIcr: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/dcr/relate-icr', { data: ids });
    return res.data.data ?? 0;
  },

  // ── 문서양식 (Dcr05_Lookup_DocType·Dcr05_Edit_Update) ──

  /** AS-IS dcr.Dcr05_DocType.selectByName */
  searchDocTypes: async (searchText: string, formClassCode?: string): Promise<DcrDocType[]> => {
    const res = await apiClient.get<ApiResponse<DcrDocType[]>>('v1/dcr/doc-types', { params: { searchText, formClassCode } });
    return res.data.data ?? [];
  },

  /** AS-IS dcr.Dcr05_DocType.updateEdit → 저장된 행 */
  updateDocType: async (docTypeId: number, req: DcrDocTypeUpdateReq): Promise<DcrDocType> => {
    const res = await apiClient.put<ApiResponse<DcrDocType>>(`v1/dcr/doc-types/${docTypeId}`, req);
    return res.data.data;
  },
};
