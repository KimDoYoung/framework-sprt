import { apiClient } from './client';
import { ApiResponse } from '../types/auth';
import { OrgCode, OrgCodeSaveReq, OrgInfoHist } from '../types/org';

/** 날짜 칸은 'yyyy-MM-dd'로 맞춘다 (서버 LocalDateTime 'yyyy-MM-ddTHH:mm:ss') */
const day = (v?: string | null) => (v ? v.slice(0, 10) : v);
const toCode = (r: OrgCode): OrgCode => ({ ...r, modDate: day(r.modDate), openDate: day(r.openDate), closeDate: day(r.closeDate) });

/** C02 조직정보 등록 (Org01_Tab_OrgCode → server/org/Org01_Code, Org02_Info) */
export const orgCodeApi = {
  /** AS-IS org.Org01_Code.selectByCompanyId: 전체 조직, 전위 순서 + depth */
  searchOrgCodes: async (baseDate: string): Promise<OrgCode[]> => {
    const res = await apiClient.get<ApiResponse<OrgCode[]>>('v1/org/org-codes', { params: { baseDate } });
    return res.data.data.map(toCode);
  },

  /** AS-IS org.Org01_Code.update (신규 조직 — codeId·infoId는 서버가 채번) */
  createOrgCode: async (req: OrgCodeSaveReq): Promise<OrgCode | null> => {
    const res = await apiClient.post<ApiResponse<OrgCode | null>>('v1/org/org-codes', req);
    return res.data.data ? toCode(res.data.data) : null;
  },

  /** AS-IS org.Org01_Code.update (수정 — 변경일이 바뀌면 새 이력) */
  updateOrgCode: async (codeId: number, req: OrgCodeSaveReq): Promise<OrgCode | null> => {
    const res = await apiClient.put<ApiResponse<OrgCode | null>>(`v1/org/org-codes/${codeId}`, req);
    return res.data.data ? toCode(res.data.data) : null;
  },

  /** AS-IS org.Org01_Code.delete: 이력이 2건 이상이면 그 이력만, 아니면 org01_code 행만 */
  deleteOrgCode: async (codeId: number, infoId: number): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>(`v1/org/org-codes/${codeId}`, { params: { infoId } });
    return res.data.data;
  },

  /** AS-IS org.Org02_Info.selectByOnlyOrgCodeId: 변경일 내림차순 */
  searchInfos: async (codeId: number): Promise<OrgInfoHist[]> => {
    const res = await apiClient.get<ApiResponse<OrgInfoHist[]>>(`v1/org/org-codes/${codeId}/infos`);
    return res.data.data.map(r => ({ ...r, modDate: day(r.modDate) }));
  },

  /** AS-IS org.Org02_Info.delete (선택 이력) */
  deleteInfos: async (codeId: number, infoIds: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>(`v1/org/org-codes/${codeId}/infos`, { data: infoIds });
    return res.data.data;
  },

  /** AS-IS org.Org02_Info.deleteCheck → 1 / -1(하위부서) / -2(사원) */
  deleteCheck: async (codeId: number): Promise<number> => {
    const res = await apiClient.get<ApiResponse<number>>(`v1/org/org-codes/${codeId}/delete-check`);
    return res.data.data;
  },

  /** AS-IS org.Org02_Info.deleteOrg (조직 전체) */
  deleteOrg: async (codeId: number): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>(`v1/org/org-codes/${codeId}/all`);
    return res.data.data;
  },
};
