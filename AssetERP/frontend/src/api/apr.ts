import { apiClient } from './client';
import { ApiResponse, PageRes } from '../types/auth';
import { readBlobError } from './file';
import { AprAltAppr, AprApprStepGroup, AprDcrWrite, AprDcrWriteParams, AprDisposalAppr, AprDisposalList, AprDoc, AprDownloadHistory, AprDocSearch, AprFundDoc, AprIcsDoc, AprItemDoc, AprMyApprove, AprMyAuth, AprMyReference, AprMyRequest, AprPutSeal, AprRelateAdv, AprRelateFund, AprReprCorp, AprStamp, AprStampManage, AprStampSeq, AprSubList, AprTotalList } from '../types/apr';

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

/** 참조내역 조회(G03) 조건. statusCode '%'가 전체, aprYn 완료/반려건 포함 */
export type MyReferenceParams = MyRequestParams;

/** 공람내역 조회(G04) 조건. statusCode '%'가 전체 (완료·반려만 보는 조건은 서버 SQL 고정) */
export interface MyAuthParams {
  classTreeId?: number;
  startDate: string;
  closeDate: string;
  statusCode: string;
  searchText: string;
}

/** 운영현황표(G16) 조건. 기간은 시행일 기준, orgName·personName은 포함 검색(서버가 %…%) */
export interface TotalListParams {
  startDate: string;
  closeDate: string;
  orgName: string;
  personName: string;
}

/** 건별명세(G17) 조건. docType 일반·내부통제, statusCode true(완료)·false(미처리) — 비면 전체 */
export interface SubListParams extends TotalListParams {
  docType?: string;
  statusCode?: string;
}

/** 상신내역 조회(G02) 조건. statusCode '%'가 전체, aprYn 완료/반려건 포함 */
export interface MyRequestParams {
  classTreeId?: number;
  startDate: string;
  closeDate: string;
  statusCode: string;
  aprYn: boolean;
  searchText: string;
}

/** 결재내역 조회(G01) 조건. dateType reg(상신일)/effect(시행일), statusCode '%'가 전체, aprYn 완료/반려건 포함 */
export interface MyApproveParams {
  classTreeId?: number;
  startDate: string;
  closeDate: string;
  statusCode: string;
  aprYn: boolean;
  dateType: 'reg' | 'effect';
  searchText: string;
}

function saveBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export const aprApi = {
  /** AS-IS apr.Apr10_Stamp.selectBySearchText2: 문서분류에서 쓸 수 있는 인감 (Apr10_Lookup_DocStamp) */
  searchDocStamps: async (classTreeId: number, searchText: string): Promise<AprStamp[]> => {
    const res = await apiClient.get<ApiResponse<AprStamp[]>>('v1/apr/stamps/doc', { params: { classTreeId, searchText } });
    return res.data.data ?? [];
  },

  /** AS-IS apr.Apr10_Stamp.selectBySearchText: 내 조직이 쓸 수 있는 인감 (Apr10_Lookup_Stamp, G06) */
  searchStamps: async (searchText: string): Promise<AprStamp[]> => {
    const res = await apiClient.get<ApiResponse<AprStamp[]>>('v1/apr/stamps', { params: { searchText } });
    return res.data.data ?? [];
  },

  /** AS-IS apr.Apr10_Stamp.selectByCodeName (Apr10_Tab_Stamp, G07): 회사의 모든 인감 */
  searchStampManage: async (): Promise<AprStampManage[]> => {
    const res = await apiClient.get<ApiResponse<AprStampManage[]>>('v1/apr/stamps/manage');
    return res.data.data ?? [];
  },

  /** AS-IS LoginUser.getOrgCodeId() (G07): 새 행의 부서 기본값. 회사관리자는 0 */
  getMyOrgCodeId: async (): Promise<number> => {
    const res = await apiClient.get<ApiResponse<number>>('v1/apr/stamps/manage/my-org-code-id');
    return res.data.data ?? 0;
  },

  /** AS-IS apr.Apr10_Stamp.update (G07): 새 행(stampId 0 이하)은 서버가 채번. 저장한 행을 요청 순서로 */
  saveStampManage: async (rows: AprStampManage[]): Promise<AprStampManage[]> => {
    const res = await apiClient.put<ApiResponse<AprStampManage[]>>('v1/apr/stamps/manage', rows);
    return res.data.data ?? [];
  },

  /** AS-IS apr.Apr10_Stamp.delete (G07) → 지운 건수 */
  deleteStampManage: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/apr/stamps/manage', { data: ids });
    return res.data.data;
  },

  /** AS-IS apr.Apr15_ReprCorp.selectByCompanyId (Apr15_Tab_ReprCorp, G08): 로그인 회사의 추가 대표명의 */
  searchReprCorps: async (): Promise<AprReprCorp[]> => {
    const res = await apiClient.get<ApiResponse<AprReprCorp[]>>('v1/apr/repr-corps');
    return res.data.data ?? [];
  },

  /** AS-IS apr.Apr15_ReprCorp.update (G08): 새 행(reprCorpId 0 이하)은 서버가 채번. 저장한 행을 요청 순서로 */
  saveReprCorps: async (rows: AprReprCorp[]): Promise<AprReprCorp[]> => {
    const res = await apiClient.put<ApiResponse<AprReprCorp[]>>('v1/apr/repr-corps', rows);
    return res.data.data ?? [];
  },

  /** AS-IS apr.Apr15_ReprCorp.delete (G08) → 지운 건수. 사용이력이 있으면 서버가 거절 */
  deleteReprCorps: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/apr/repr-corps', { data: ids });
    return res.data.data;
  },

  /** AS-IS apr.Apr01_Appr.selectByApprDate (Apr01_Tab_StampSeq, G06): 인감대장. stampId 없음·0이면 모든 인감 */
  searchStampSeq: async (params: { startDate: string; endDate: string; stampId?: number }): Promise<AprStampSeq[]> => {
    const res = await apiClient.get<ApiResponse<AprStampSeq[]>>('v1/apr/apprs/stamp-seq', { params });
    return res.data.data ?? [];
  },

  /** AS-IS apr.Apr01_Appr.updatePutSealEmpId (G06 [확인자입력]): 인감확인자 = 로그인 사용자, 확인일시 = 서버 시각 */
  updatePutSeal: async (apprId: number): Promise<AprPutSeal> => {
    const res = await apiClient.put<ApiResponse<AprPutSeal>>(`v1/apr/apprs/${apprId}/put-seal`);
    return res.data.data;
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

  /** AS-IS apr.Apr90_DisposalList.selectByCompanyId (Apr90_Tab_DisposalAppr): 내게 지정된 폐기 승인 건. companyId·confirmEmpId는 서버가 세션에서, disposalCode '%'=전체 */
  searchDisposalAppr: async (params: { startDate: string; closeDate: string; disposalCode: string }): Promise<AprDisposalAppr[]> => {
    const res = await apiClient.get<ApiResponse<AprDisposalAppr[]>>('v1/apr/disposal-lists/approvals', { params });
    return res.data.data ?? [];
  },

  /** AS-IS apr.Apr90_DisposalList.updateAppr: 선택한 폐기 신청을 승인(20)·반려(99) */
  updateDisposalCode: async (disposalCode: '20' | '99', disposalListIds: number[]): Promise<void> => {
    await apiClient.put('v1/apr/disposal-lists/disposal-code', { disposalCode, disposalListIds });
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

  /** AS-IS apr.Apr01_Appr.selectApprListByEmpId (Apr01_Tab_MyApproveList, G01): 내가 결재자(대결 포함)인 문서. 검색어는 서버가 %…%로 */
  searchMyApprove: async (params: MyApproveParams): Promise<AprMyApprove[]> => {
    const res = await apiClient.get<ApiResponse<AprMyApprove[]>>('v1/apr/apprs/my-approve', { params });
    return res.data.data ?? [];
  },

  /** 출력/다운로드 (AS-IS sys.Sys99_Print.insertRdApproveList + RD 리포트 Apr01_Rd_MyApproveList → xlsx) — 조회 조건 그대로, 브라우저 저장 */
  downloadMyApproveExcel: async (params: MyApproveParams, fileName: string): Promise<void> => {
    try {
      const res = await apiClient.get<Blob>('v1/apr/apprs/my-approve/excel', { params, responseType: 'blob' });
      saveBlob(res.data, fileName);
    } catch (err) {
      throw await readBlobError(err);
    }
  },

  /** AS-IS apr.Apr01_Appr.selectByRequestEmpId (Apr01_Tab_MyRequestList, G02): 내가 상신한 문서. 검색어는 서버가 %…%로 */
  searchMyRequest: async (params: MyRequestParams): Promise<AprMyRequest[]> => {
    const res = await apiClient.get<ApiResponse<AprMyRequest[]>>('v1/apr/apprs/my-request', { params });
    return res.data.data ?? [];
  },

  /** 출력/다운로드 (AS-IS sys.Sys99_Print.insertRdRequestList + RD 리포트 Apr01_Rd_MyRequestList → xlsx) — 조회 조건 그대로, 브라우저 저장 */
  downloadMyRequestExcel: async (params: MyRequestParams, fileName: string): Promise<void> => {
    try {
      const res = await apiClient.get<Blob>('v1/apr/apprs/my-request/excel', { params, responseType: 'blob' });
      saveBlob(res.data, fileName);
    } catch (err) {
      throw await readBlobError(err);
    }
  },

  /** AS-IS apr.Apr01_Appr.selectByReferenceEmpId (Apr01_Tab_MyReferenceList, G03): 내가 참조자인 문서. 검색어는 서버가 %…%로 */
  searchMyReference: async (params: MyReferenceParams): Promise<AprMyReference[]> => {
    const res = await apiClient.get<ApiResponse<AprMyReference[]>>('v1/apr/apprs/my-reference', { params });
    return res.data.data ?? [];
  },

  /** 출력/다운로드 (AS-IS sys.Sys99_Print.insertRdReferenceList + RD 리포트 Apr01_Rd_MyReferenceList → xlsx) — 조회 조건 그대로, 브라우저 저장 */
  downloadMyReferenceExcel: async (params: MyReferenceParams, fileName: string): Promise<void> => {
    try {
      const res = await apiClient.get<Blob>('v1/apr/apprs/my-reference/excel', { params, responseType: 'blob' });
      saveBlob(res.data, fileName);
    } catch (err) {
      throw await readBlobError(err);
    }
  },

  /** AS-IS apr.Apr01_Appr.selectByAuthEmpId (Apr01_Tab_MyAuthList, G04): 내가 공람 대상인 완료·반려 문서. 검색어는 서버가 %…%로 */
  searchMyAuth: async (params: MyAuthParams): Promise<AprMyAuth[]> => {
    const res = await apiClient.get<ApiResponse<AprMyAuth[]>>('v1/apr/apprs/my-auth', { params });
    return res.data.data ?? [];
  },

  /** AS-IS apr.Apr01_Appr.selectByTotalList (Apr01_Tab_TotalList, G16): 시행일 기준 담당자별 발생·처리·미처리 건수 */
  searchTotalList: async (params: TotalListParams): Promise<AprTotalList[]> => {
    const res = await apiClient.get<ApiResponse<AprTotalList[]>>('v1/apr/apprs/total-list', { params });
    return res.data.data ?? [];
  },

  /** AS-IS apr.Apr01_Appr.selectBySubList (Apr01_Tab_SubList, G17): 시행일 기준 건별 명세. docType 일반·내부통제, statusCode true(완료)·false(미처리), 비면 전체 */
  searchSubList: async (params: SubListParams): Promise<AprSubList[]> => {
    const res = await apiClient.get<ApiResponse<AprSubList[]>>('v1/apr/apprs/sub-list', { params });
    return res.data.data ?? [];
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

/** G05 AS-IS Apr07_Tab_AltAppr (대결자 지정) */
export const aprAltApprApi = {
  /** AS-IS apr.Apr07_AltAppr.selectByEmpId */
  searchAltApprs: async (): Promise<AprAltAppr[]> => {
    const res = await apiClient.get<ApiResponse<AprAltAppr[]>>('v1/apr/alt-apprs');
    return res.data.data ?? [];
  },
  /** AS-IS apr.Apr07_AltAppr.notAltApprIdList + update → 저장된 행(요청 순서). 새 행(id ≤ 0)은 id를 빼고 보낸다 */
  saveAltApprs: async (rows: AprAltAppr[]): Promise<AprAltAppr[]> => {
    const body = rows.map(({ altApprId, altEmpId, altEmpName, startDate, closeDate, stampYn, reasonCd, emgrPoint }) =>
      ({ altApprId: altApprId > 0 ? altApprId : null, altEmpId, altEmpName, startDate, closeDate, stampYn, reasonCd, emgrPoint }));
    const res = await apiClient.put<ApiResponse<AprAltAppr[]>>('v1/apr/alt-apprs', body);
    return res.data.data ?? [];
  },
  /** AS-IS apr.Apr07_AltAppr.delete → 지운 건수 */
  deleteAltApprs: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/apr/alt-apprs', { data: ids });
    return res.data.data ?? 0;
  },
};
