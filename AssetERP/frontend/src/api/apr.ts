import { apiClient } from './client';
import { ApiResponse, PageRes } from '../types/auth';
import { AprApprStepGroup, AprDcrWrite, AprDcrWriteParams, AprDoc, AprIcsDoc, AprRelateAdv, AprRelateFund, AprStamp } from '../types/apr';

/** apr(전자결재) API (E16 조회창, F01 문서작성 목록, F02 업무별 문서작성 목록, F03 법규별 문서작성 목록) */
export const aprApi = {
  /** AS-IS apr.Apr10_Stamp.selectBySearchText2: 문서분류에서 쓸 수 있는 인감 (Apr10_Lookup_DocStamp) */
  searchDocStamps: async (classTreeId: number, searchText: string): Promise<AprStamp[]> => {
    const res = await apiClient.get<ApiResponse<AprStamp[]>>('v1/apr/stamps/doc', { params: { classTreeId, searchText } });
    return res.data.data ?? [];
  },

  /** AS-IS apr.Apr30_ApprStepGroup.selectByCompanyId (Apr30_Lookup_ApprStepGroup) */
  searchApprStepGroups: async (): Promise<AprApprStepGroup[]> => {
    const res = await apiClient.get<ApiResponse<AprApprStepGroup[]>>('v1/apr/appr-step-groups');
    return res.data.data ?? [];
  },

  /** AS-IS apr.Apr01_Appr.selectByPaging (Dcr01_Tab_DcrWrite): 내가 등록·결재·열람하는 문서, 페이징 */
  searchDcrWrite: async (params: AprDcrWriteParams): Promise<PageRes<AprDcrWrite>> => {
    const res = await apiClient.get<ApiResponse<PageRes<AprDcrWrite>>>('v1/apr/apprs/dcr-write', { params });
    return res.data.data as PageRes<AprDcrWrite>;
  },

  /** AS-IS apr.Apr01_Appr.selectByClassTreeId2 (Apr01_Grid_DocList): 문서분류의 문서 목록. searchText는 서버가 %…%로 */
  searchDocList: async (params: { classTreeId: number; startDate: string; endDate: string; searchText: string }): Promise<AprDoc[]> => {
    const res = await apiClient.get<ApiResponse<AprDoc[]>>('v1/apr/apprs/doc-list', { params });
    return res.data.data ?? [];
  },

  /** AS-IS apr.Apr03_RelateFund.selectByIcsClassTreeId (Ics01_Grid_ApprList): 법규분류에 연결된 문서 목록. searchText는 서버가 %…%로 */
  searchIcsDocList: async (params: { classTreeId: number; startDate: string; endDate: string; searchText: string }): Promise<AprIcsDoc[]> => {
    const res = await apiClient.get<ApiResponse<AprIcsDoc[]>>('v1/apr/apprs/ics-list', { params });
    return res.data.data ?? [];
  },

  /** AS-IS apr.Apr03_RelateFund.selectByApprId (Apr03_TabPage_Relate) */
  searchRelateFunds: async (apprId: number): Promise<AprRelateFund[]> => {
    const res = await apiClient.get<ApiResponse<AprRelateFund[]>>(`v1/apr/apprs/${apprId}/relate-funds`);
    return res.data.data ?? [];
  },

  /** AS-IS apr.Apr12_RelateAdv.selectByApprId (Apr03_TabPage_Relate) */
  searchRelateAdvs: async (apprId: number): Promise<AprRelateAdv[]> => {
    const res = await apiClient.get<ApiResponse<AprRelateAdv[]>>(`v1/apr/apprs/${apprId}/relate-advs`);
    return res.data.data ?? [];
  },
};
