import { apiClient } from './client';
import { ApiResponse } from '../types/auth';
import { Manl, ManlRelateIcs, TdmManlFormFile, TdmManlItem, TdmManlOrg, TdmManlRelates, TdmManlSaveReq, TdmRoleDesc, TdmRoleDigm } from '../types/tdm';

/** tdm(책무) 화면 API */
export const tdmApi = {
  // ── E01 법규관리(관리자) — 연결 책무이행점검(Ics01_Lookup_RelateTdm·Ics01_Lookup_SelectTdm) ──

  /** AS-IS tdm.Tdm45_ManlRelateIcs.selectByIcsId: 법규에 연결된 점검항목(관리자 회사만 행이 나온다) */
  searchManlRelateIcs: async (icsId: number, searchText: string): Promise<ManlRelateIcs[]> => {
    const res = await apiClient.get<ApiResponse<ManlRelateIcs[]>>('v1/tdm/manl-relate-ics', { params: { icsId, searchText } });
    return res.data.data ?? [];
  },

  /** AS-IS tdm.Tdm43_Manl.selectByExceptIcsId: 연결할 점검항목 후보 */
  searchManlCandidates: async (icsId: number, searchText: string): Promise<Manl[]> => {
    const res = await apiClient.get<ApiResponse<Manl[]>>('v1/tdm/manl-relate-ics/candidates', { params: { icsId, searchText } });
    return res.data.data ?? [];
  },

  /** AS-IS tdm.Tdm45_ManlRelateIcs.insertList → 새로 연결한 건수 */
  addManlRelateIcs: async (icsId: number, manlIds: number[]): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>('v1/tdm/manl-relate-ics', { icsId, manlIds });
    return res.data.data ?? 0;
  },

  /** AS-IS tdm.Tdm45_ManlRelateIcs.delete → 지운 건수 */
  deleteManlRelateIcs: async (icsId: number, manlRelateIcsIds: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/tdm/manl-relate-ics', { params: { icsId }, data: manlRelateIcsIds });
    return res.data.data ?? 0;
  },

  // ── E11 책무기술서 재생성(Tdm31_Tab_RoleDescAdmin) ──

  /** AS-IS tdm.Tdm31_RoleDesc.selectByRegDateAdmin (companyId 없음 = 전체, 관리자 회사만. 일자는 전체보기가 아닐 때만 건다) */
  searchRoleDescs: async (p: { companyId?: number; startDate: string; closeDate: string; searchText: string; endYn: boolean; notPeriodYn: boolean }): Promise<TdmRoleDesc[]> => {
    const res = await apiClient.get<ApiResponse<TdmRoleDesc[]>>('v1/tdm/role-descs', { params: p });
    return res.data.data ?? [];
  },

  /** 한 건 재생성 (AS-IS createRd 한 건 분량). RD 연동이 없는 동안 서버가 거절한다 */
  recreateRoleDesc: async (roleDescId: number): Promise<void> => {
    await apiClient.post<ApiResponse<null>>(`v1/tdm/role-descs/${roleDescId}/recreate`);
  },

  // ── E12 책무체계도 재생성(Tdm32_Tab_RoleDigmAdmin) ──

  /** AS-IS tdm.Tdm32_RoleDigm.selectByRegDateAdmin (companyId 없음 = 전체, 관리자 회사만. 일자는 전체보기가 아닐 때만 건다. 원본은 상신건만(endYn=true) 고정) */
  searchRoleDigms: async (p: { companyId?: number; startDate: string; closeDate: string; endYn: boolean; notPeriodYn: boolean }): Promise<TdmRoleDigm[]> => {
    const res = await apiClient.get<ApiResponse<TdmRoleDigm[]>>('v1/tdm/role-digms', { params: p });
    return res.data.data ?? [];
  },

  /** AS-IS tdm.Tdm33_RoleDigmFile.selectByFileType: 책무체계도의 파일정보 ID들 (fileType 1 시스템 생성 / 2 사용자 업로드) */
  getRoleDigmFileIds: async (roleDigmId: number, fileType: string): Promise<number[]> => {
    const res = await apiClient.get<ApiResponse<number[]>>(`v1/tdm/role-digms/${roleDigmId}/file-ids`, { params: { fileType } });
    return res.data.data ?? [];
  },

  /** 한 건 재생성 (AS-IS createRd 한 건 분량). RD 연동이 없는 동안 서버가 거절한다 */
  recreateRoleDigm: async (roleDigmId: number): Promise<void> => {
    await apiClient.post<ApiResponse<null>>(`v1/tdm/role-digms/${roleDigmId}/recreate`);
  },

  // ── E13 책무매뉴얼 재생성(Tdm42_Tab_ManlManagerAdmin) · 점검항목 조회창(Tdm43_Lookup_ManlItem) ──

  /** AS-IS tdm.Tdm42_ManlOrg.selectByText (companyId 없음 = 전체. 원본은 상신건만(adminYn=true)·useYn=false 고정. 일자는 전체보기가 아닐 때만 건다) */
  searchManlOrgs: async (p: { companyId?: number; orgId?: number; searchText: string; notPeriodYn: boolean; startDate: string; closeDate: string }): Promise<TdmManlOrg[]> => {
    const res = await apiClient.get<ApiResponse<TdmManlOrg[]>>('v1/tdm/manl-orgs', { params: p });
    return res.data.data ?? [];
  },

  /** 한 건 재생성 (AS-IS createRd 한 건 분량). RD 연동이 없는 동안 서버가 거절한다 */
  recreateManlOrg: async (manlOrgId: number): Promise<void> => {
    await apiClient.post<ApiResponse<null>>(`v1/tdm/manl-orgs/${manlOrgId}/recreate`);
  },

  /** AS-IS tdm.Tdm43_Manl.selectByManlOrgId (useYn: '%' 전체 / 'true' 사용 / 'false' 미사용) */
  searchManlItems: async (manlOrgId: number, useYn: string, searchText: string): Promise<TdmManlItem[]> => {
    const res = await apiClient.get<ApiResponse<TdmManlItem[]>>('v1/tdm/manls', { params: { manlOrgId, useYn, searchText } });
    return res.data.data ?? [];
  },

  // ── E13-2 점검항목 등록·수정창(Tdm43_Edit_Manl)·연관 페이지(Tdm43_Page_Relate) ──

  /** 등록창을 열 때 받는 새 점검항목 번호 (AS-IS DBUtil.setSeq) */
  nextManlId: async (manlOrgId: number): Promise<number> => {
    const res = await apiClient.get<ApiResponse<number>>('v1/tdm/manls/next-id', { params: { manlOrgId } });
    return res.data.data;
  },

  /** AS-IS Tdm45·46·47_…selectByManlId·Sys11_RelateFile.selectByParentId (등록 직후 번호는 빈 목록) */
  getManlRelates: async (manlOrgId: number, manlId: number): Promise<TdmManlRelates> => {
    const res = await apiClient.get<ApiResponse<TdmManlRelates>>(`v1/tdm/manls/${manlId}/relates`, { params: { manlOrgId } });
    return res.data.data;
  },

  /** AS-IS tdm.Tdm43_Manl.modelUpdate (manlId가 이미 있으면 수정, 없으면 등록) */
  saveManl: async (req: TdmManlSaveReq): Promise<void> => {
    await apiClient.put<ApiResponse<null>>('v1/tdm/manls', req);
  },

  /** 연결 한 건 삭제 — kind: ics·icr·form·dcr */
  deleteManlRelate: async (manlOrgId: number, manlId: number, kind: 'ics' | 'icr' | 'form' | 'dcr', relateId: number): Promise<void> => {
    await apiClient.delete<ApiResponse<null>>(`v1/tdm/manls/${manlId}/relates/${kind}/${relateId}`, { params: { manlOrgId } });
  },

  /** AS-IS sys.Sys10_File.selectUnConnTdmFormFile (formType: '%' 전체 / 코드) */
  searchManlFormFiles: async (formType: string, searchText: string, relateId: number): Promise<TdmManlFormFile[]> => {
    const res = await apiClient.get<ApiResponse<TdmManlFormFile[]>>('v1/tdm/manls/form-files', { params: { formType, searchText, relateId } });
    return res.data.data ?? [];
  },

  /** AS-IS tdm.Tdm43_Manl.delete (선택한 한 건 + 연결 법규·내규·양식·첨부) */
  deleteManlItem: async (manlOrgId: number, manlId: number): Promise<void> => {
    await apiClient.delete<ApiResponse<null>>(`v1/tdm/manls/${manlId}`, { params: { manlOrgId } });
  },
};
