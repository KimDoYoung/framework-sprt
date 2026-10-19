import { apiClient } from './client';
import { ApiResponse } from '../types/auth';
import {
  DcrCheckRes, DcrCheckRowReq, DcrClassDetail, DcrClassTree, DcrClassTreeAll, DcrClassTreeLookup, DcrClassTreeSaveReq,
  DcrCopyCompany, DcrDocFile, DcrDocType, DcrDocTypeRow, DcrDocTypeSaveReq, DcrDocTypeUpdateReq, DcrClassLink, DcrLink, DcrLinkSaveReq, DcrRelateDocType, DcrRelateIcr,
  DcrOftenUse, DcrRelateIcs, DcrRelateSaveReq, DcrUseYnReq, DcrWriteCode, DcrWriteTree,
} from '../types/dcr';

/** dcr(문서분류) API (E13-3 조회창, E16 문서분류, F02 업무별 문서작성) */
export const dcrApi = {
  /** AS-IS dcr.Dcr01_ClassTree.selectByText(typeCode T, useYn true): 문서분류 조회창. relateTable 'TDM47'+점검항목 ID면 그 점검항목에 연결 안 된 것만 */
  searchLookup: async (searchText: string, relateTable?: string, relateId?: number): Promise<DcrClassTreeLookup[]> => {
    const res = await apiClient.get<ApiResponse<DcrClassTreeLookup[]>>('v1/dcr/class-trees/lookup', { params: { searchText, relateTable, relateId } });
    return res.data.data ?? [];
  },

  // ── E16 문서분류 (Dcr01_Tab_ClassTree 외) ──

  /** AS-IS dcr.Dcr01_ClassTree.selectByCompanyId: 사용 중인 분류 트리(전위 순서, depth). typeCode 기본 'C', 이동·반영 창은 '%'. companyId(E17)는 다른 회사 지정 — 관리자 회사만 */
  searchClassTree: async (typeCode = 'C', companyId?: number): Promise<DcrClassTree[]> => {
    const res = await apiClient.get<ApiResponse<DcrClassTree[]>>('v1/dcr/class-trees', { params: { typeCode, companyId } });
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

  /** AS-IS dcr.Dcr01_ClassTree.selectByOrgIdRoleWrite (Dcr01_Tab_DcrUser): 내 조직이 작성권한을 가진 분류 트리 (전위 순서 평평한 목록 + depth) */
  searchWriteTree: async (): Promise<DcrWriteTree[]> => {
    const res = await apiClient.get<ApiResponse<DcrWriteTree[]>>('v1/dcr/class-trees/write');
    return res.data.data ?? [];
  },

  /** AS-IS dcr.Dcr30_Link.selectByClassTreeId (Apr01_Grid_DocList): 문서분류에 걸린 Link (없으면 빈 목록) */
  searchLinksByClassTree: async (classTreeId: number): Promise<DcrClassLink[]> => {
    const res = await apiClient.get<ApiResponse<DcrClassLink[]>>('v1/dcr/links/by-class-tree', { params: { classTreeId } });
    return res.data.data ?? [];
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

  /** AS-IS dcr.Dcr07_ClassDetail.selectById (Dcr01_Tab_DcrWrite getClassDetailModel) */
  getClassDetail: async (classDetailId: number): Promise<DcrClassDetail> => {
    const res = await apiClient.get<ApiResponse<DcrClassDetail>>(`v1/dcr/class-details/${classDetailId}`);
    return res.data.data as DcrClassDetail;
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

  /** AS-IS dcr.Dcr05_DocType.selectByName — companyId는 KFS 관리자만 다른 회사를 고를 수 있다(없으면 로그인 회사) */
  searchDocTypes: async (searchText: string, formClassCode?: string, companyId?: number): Promise<DcrDocType[]> => {
    const res = await apiClient.get<ApiResponse<DcrDocType[]>>('v1/dcr/doc-types', { params: { searchText, formClassCode, companyId } });
    return res.data.data ?? [];
  },

  /** AS-IS dcr.Dcr05_DocType.updateEdit → 저장된 행 */
  updateDocType: async (docTypeId: number, req: DcrDocTypeUpdateReq, companyId?: number): Promise<DcrDocType> => {
    const res = await apiClient.put<ApiResponse<DcrDocType>>(`v1/dcr/doc-types/${docTypeId}`, req, { params: { companyId } });
    return res.data.data;
  },

  /** AS-IS dcr.Dcr05_DocType.update (Dcr05_Edit_DocType) → 로그인 회사에 새 양식 */
  createDocType: async (req: DcrDocTypeUpdateReq): Promise<DcrDocType> => {
    const res = await apiClient.post<ApiResponse<DcrDocType>>('v1/dcr/doc-types', req);
    return res.data.data;
  },

  /** AS-IS dcr.Dcr05_DocType.delete — 문서분류에 지정된 양식이 있으면 서버가 거절 */
  deleteDocTypes: async (ids: number[], companyId?: number): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/dcr/doc-types', { data: ids, params: { companyId } });
    return res.data.data ?? 0;
  },

  /** AS-IS dcr.Dcr05_DocType.pushData — 고른 양식을 목적지 회사로 복사 */
  pushDocTypes: async (targetCompanyId: number, sourceCompanyId: number | undefined, docTypeIds: number[]): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>('v1/dcr/doc-types/push', { targetCompanyId, sourceCompanyId, docTypeIds });
    return res.data.data ?? 0;
  },

  /** AS-IS dcr.Dcr05_DocType.checkDocFormClassCode — 쓰는 양식이 있으면 서버가 오류 문구로 거절 */
  checkDocFormClassCode: async (docFormClassCode: string): Promise<void> => {
    await apiClient.get<ApiResponse<void>>('v1/dcr/doc-types/check-form-class', { params: { docFormClassCode } });
  },

  // ── E17 문서분류지정 (Dcr30_Tab_LinkAdmin) ──

  /** AS-IS dcr.Dcr30_Link.selectBySearchId: companyId가 없으면 로그인 회사, 다른 회사는 관리자 회사만. searchText는 서버가 %…%로 감싼다 */
  searchLinks: async (searchText: string, companyId?: number): Promise<DcrLink[]> => {
    const res = await apiClient.get<ApiResponse<DcrLink[]>>('v1/dcr/links', { params: { companyId, searchText } });
    return res.data.data ?? [];
  },

  /** AS-IS dcr.Dcr30_Link.linkCheck: 없는 Link를 모든 회사에 넣는다(조회가 쓰기, 관리자 회사만) → 새로 넣은 건수 */
  linkCheck: async (): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>('v1/dcr/links/check');
    return res.data.data ?? 0;
  },

  /** AS-IS dcr.Dcr30_Link.update + updateDcrAuth → 저장한 건수 */
  updateLinks: async (rows: DcrLinkSaveReq[], companyId?: number): Promise<number> => {
    const res = await apiClient.put<ApiResponse<number>>('v1/dcr/links', rows, { params: { companyId } });
    return res.data.data ?? 0;
  },

  /** AS-IS dcr.Dcr30_Link.updateNote */
  updateLinkNote: async (linkId: number, note: string | null): Promise<void> => {
    await apiClient.put(`v1/dcr/links/${linkId}/note`, { note });
  },

  /** AS-IS dcr.Dcr30_Link.updateLink: 문서분류지정복사 → 처리한 건수 */
  copyLinks: async (companyIds: number[], linkIds: number[]): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>('v1/dcr/links/copy-link', { companyIds, linkIds });
    return res.data.data ?? 0;
  },

  /** AS-IS dcr.Dcr30_Link.updateForm: 양식복사 → 처리한 건수 */
  copyLinkForms: async (companyIds: number[], linkIds: number[]): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>('v1/dcr/links/copy-form', { companyIds, linkIds });
    return res.data.data ?? 0;
  },

  // ── 문서작성 (Dcr01_Tab_DcrWrite · Dcr08_Lookup_SelectSingle) ──

  /** AS-IS sys.Sys09_Code.selectByDcrLv1~3: level 1=대분류, 2=중분류, 3=문서분류 (2·3은 부모 분류 ID). 조직이 수정 권한을 가진 분류만 */
  searchWriteClasses: async (level: 1 | 2 | 3, dcrParentId?: number): Promise<DcrWriteCode[]> => {
    const res = await apiClient.get<ApiResponse<DcrWriteCode[]>>('v1/dcr/write-codes/classes', { params: { level, dcrParentId } });
    return res.data.data ?? [];
  },

  /** AS-IS sys.Sys09_Code.selectByDcrDetail: 문서분류의 세부분류 */
  searchWriteDetails: async (classTreeId: number): Promise<DcrWriteCode[]> => {
    const res = await apiClient.get<ApiResponse<DcrWriteCode[]>>('v1/dcr/write-codes/details', { params: { classTreeId } });
    return res.data.data ?? [];
  },

  /** AS-IS dcr.Dcr08_OftenUse.selectByPersonId: 로그인 사용자가 최근 쓴 문서분류 (사용횟수순) */
  searchOftenUses: async (): Promise<DcrOftenUse[]> => {
    const res = await apiClient.get<ApiResponse<DcrOftenUse[]>>('v1/dcr/often-uses');
    return res.data.data ?? [];
  },

  /** AS-IS dcr.Dcr00_DocList.getFile (Dcr00_Tab_FileList, F08): 문서별 첨부파일 검색. searchText는 서버가 %…%로 */
  searchDocFiles: async (params: { classTreeId?: number; startDate: string; endDate: string; searchText: string }): Promise<DcrDocFile[]> => {
    const res = await apiClient.get<ApiResponse<DcrDocFile[]>>('v1/dcr/doc-lists/files', { params });
    return res.data.data ?? [];
  },
};
