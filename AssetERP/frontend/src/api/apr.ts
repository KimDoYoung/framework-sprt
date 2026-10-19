import { apiClient } from './client';
import { ApiResponse, PageRes } from '../types/auth';
import { readBlobError } from './file';
import { AprApprStepGroup, AprDcrWrite, AprDcrWriteParams, AprDisposalList, AprDoc, AprDownloadHistory, AprDocSearch, AprFundDoc, AprIcsDoc, AprItemDoc, AprRelateAdv, AprRelateFund, AprStamp } from '../types/apr';

/** apr(전자결재) API (E16 조회창, F01 문서작성 목록, F02 업무별 문서작성 목록, F03 법규별 문서작성 목록, F04 폐기문서 신청현황) */
export interface DocTextParams {
  classTreeId?: number;
  startDate: string;
  endDate: string;
  searchText: string;
  receiveName: string;
  statusCode: string;
  inoutCode: string;
}

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

  /** AS-IS apr.Apr90_DisposalList.selectByPersonId (Apr90_Tab_DisposalList): 내가 신청한 폐기문서. personId는 서버가 세션에서 */
  searchDisposalListMine: async (params: { startDate: string; closeDate: string }): Promise<AprDisposalList[]> => {
    const res = await apiClient.get<ApiResponse<AprDisposalList[]>>('v1/apr/disposal-lists/mine', { params });
    return res.data.data ?? [];
  },

  /** AS-IS apr.Apr01_Appr.selectByText2 (Dcr00_Tab_DocList): 통합 문서검색. 검색어·수신처는 서버가 %…%로, 상태·문서구분은 '%'가 전체 */
  searchDocText: async (params: DocTextParams): Promise<AprDocSearch[]> => {
    const res = await apiClient.get<ApiResponse<AprDocSearch[]>>('v1/apr/apprs/search', { params });
    return res.data.data ?? [];
  },

  /** 엑셀다운로드 (AS-IS sys.Sys99_Print.insertRdDocList + RD 리포트 → xlsx) — 조회 조건 그대로, 브라우저 저장 */
  downloadDocTextExcel: async (params: DocTextParams, fileName: string): Promise<void> => {
    try {
      const res = await apiClient.get<Blob>('v1/apr/apprs/search/excel', { params, responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      throw await readBlobError(err);
    }
  },

  /** AS-IS apr.Apr01_Appr.selectByFundDocList (Apr01_Grid_FundDocList, F06): 고른 펀드의 문서 목록 */
  searchFundDocList: async (fundCodeId: number): Promise<AprFundDoc[]> => {
    const res = await apiClient.get<ApiResponse<AprFundDoc[]>>('v1/apr/apprs/fund-doc-list', { params: { fundCodeId } });
    return res.data.data ?? [];
  },

  /** AS-IS apr.Apr01_Appr.selectByItemDocList (Apr01_Grid_ItemDocList, F07): 고른 종목의 문서 목록. searchType 1 연관종목만·2 연관종목운용펀드포함, searchText는 서버가 %…%로 */
  searchItemDocList: async (params: { astClassTreeId: number; searchType: string; searchText: string }): Promise<AprItemDoc[]> => {
    const res = await apiClient.get<ApiResponse<AprItemDoc[]>>('v1/apr/apprs/item-doc-list', { params });
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

  /** AS-IS apr.Apr40_DownloadHistory.selectByTextPaging (Apr40_Lookup_DownloadHistory, F09): 다운로드 기록, 페이징. searchText는 서버가 %…%로 */
  searchDownloadHistories: async (params: { startDate: string; closeDate: string; searchText: string; offset: number; limit: number }): Promise<PageRes<AprDownloadHistory>> => {
    const res = await apiClient.get<ApiResponse<PageRes<AprDownloadHistory>>>('v1/apr/download-histories', { params });
    return res.data.data as PageRes<AprDownloadHistory>;
  },

  /** AS-IS apr.Apr40_DownloadHistory.updateList (Dcr00_Tab_ApprList.insertHistory, F09): 내려받은 문서마다 기록 1건 */
  createDownloadHistories: async (apprIds: number[]): Promise<void> => {
    await apiClient.post('v1/apr/download-histories', { apprIds });
  },
};
