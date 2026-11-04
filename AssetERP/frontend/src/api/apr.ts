import { apiClient } from './client';
import { ApiResponse, PageRes } from '../types/auth';
import { readBlobError } from './file';
import { AprBookmarkList, AprLinkArgs, AprAltAppr, AprCorpStamp, AprReprCorpLookup, AprStampDoc, AprStampAppl, AprStampApplSaveReq, AprStampDocAppl, AprStampDocLookup, AprStampDocSaveReq, AprStampDocSum, AprStampList, AprStampCheck, AprStampApplAddReq, AprStampApplEdit,AprApprStepGroup, AprDcrWrite, AprDcrWriteParams, AprAltApprMgr, AprApprDel, AprApprStepGroupMember, AprDisposalAppr, AprDisposalList, AprDoc, AprDownloadHistory, AprDocSearch, AprFundDoc, AprIcsDoc, AprItemDoc, AprLoadDoc, AprApprActionRes, AprApprActionState, AprRecentDoc, AprApprNew, AprLinkSeed, AprApprSaveReq, AprApprSaveStep, AprApprWriteRes, AprStepEmp, AprNewStep, AprApprAdv, AprApprIdRow, AprApprDetail, AprAfterFile, AprAfterFund, AprDocForm, AprEditFile, AprFileDel, AprLoadDoc2, AprBookmark, AprComment, AprCommentNotice, AprDisposalCheck, AprDisposalConfirmEmp, AprPersonAuth, AprRelateIcsRow, AprRelateIcsSaveReq, AprTypo, AprTypoSaveReq, AprOpenHistory, AprApprFile, AprApprFund, AprApprStampAppl, AprApprStep, AprRelateAppr, AprRelateLaw, AprMyApprove, AprMyAuth, AprMyReference, AprMyRequest, AprPreProvide, AprPutSeal, AprRelateAdv, AprRelateFund, AprReprCorp, AprStamp, AprStampLine, AprStampManage, AprStampSeq, AprSubList, AprTotalList } from '../types/apr';

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

  /** AS-IS apr.Apr10_Stamp.selectByOrgId (Apr10_Lookup_Stamp flag=false, T25): 내 부서 소유 인감까지 포함, 사용기간 조건 없음 */
  searchStampsByOrg: async (searchText: string): Promise<AprStamp[]> => {
    const res = await apiClient.get<ApiResponse<AprStamp[]>>('v1/apr/stamps/by-org', { params: { searchText } });
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

  /** AS-IS apr.Apr30_ApprStepGroup.update (Apr30_Tab_ApprStepGroup, EE03) → 저장된 행(요청 순서). 새 행(id ≤ 0)은 id를 빼고 보낸다. companyId는 서버가 세션에서 */
  saveApprStepGroups: async (rows: AprApprStepGroup[]): Promise<AprApprStepGroup[]> => {
    const body = rows.map(({ apprStepGroupId, apprStepGroupName, note }) => ({ apprStepGroupId: apprStepGroupId > 0 ? apprStepGroupId : null, apprStepGroupName, note }));
    const res = await apiClient.put<ApiResponse<AprApprStepGroup[]>>('v1/apr/appr-step-groups', body);
    return res.data.data ?? [];
  },

  /** AS-IS apr.Apr30_ApprStepGroup.delete → 지운 건수 */
  deleteApprStepGroups: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/apr/appr-step-groups', { data: ids });
    return res.data.data ?? 0;
  },

  /** AS-IS apr.Apr31_ApprStepGroupMember.selectByApprStepGroupId (Apr31_Page_ApprStepGroupMember, EE03) */
  searchApprStepGroupMembers: async (apprStepGroupId: number): Promise<AprApprStepGroupMember[]> => {
    const res = await apiClient.get<ApiResponse<AprApprStepGroupMember[]>>('v1/apr/appr-step-group-members', { params: { apprStepGroupId } });
    return res.data.data ?? [];
  },

  /** AS-IS apr.Apr31_ApprStepGroupMember.update — 화면 순서가 결재 순서(서버가 seq 001~을 매긴다) */
  saveApprStepGroupMembers: async (apprStepGroupId: number, rows: AprApprStepGroupMember[]): Promise<void> => {
    const body = rows.map(({ apprStepGroupMemberId, stepTypeCode, stepEmpId, note }) =>
      ({ apprStepGroupMemberId: apprStepGroupMemberId > 0 ? apprStepGroupMemberId : null, stepTypeCode, stepEmpId, note }));
    await apiClient.put('v1/apr/appr-step-group-members', body, { params: { apprStepGroupId } });
  },

  /** AS-IS apr.Apr31_ApprStepGroupMember.delete → 지운 건수 */
  deleteApprStepGroupMembers: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/apr/appr-step-group-members', { data: ids });
    return res.data.data ?? 0;
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

  /** AS-IS apr.Apr01_Appr.selectByClassTreeId2 admin=true (Dcr01_Grid_DcrClassList, EE05 문서이동): 열람권한 조건 없이 문서분류의 문서 목록 */
  searchDocListAdmin: async (params: { classTreeId: number; startDate: string; endDate: string; searchText: string }): Promise<AprDoc[]> => {
    const res = await apiClient.get<ApiResponse<AprDoc[]>>('v1/apr/apprs/doc-list/admin', { params });
    return res.data.data ?? [];
  },

  /** AS-IS apr.Apr01_Appr.selectByClassTreeId2 admin=LoginUser.getIsManager() (Dcr01_Tab_DcrManager #1003, EE36): 관리자면 열람권한 조건 없이, 아니면 F02와 같게 */
  searchDocListManager: async (params: { classTreeId: number; startDate: string; endDate: string; searchText: string }): Promise<AprDoc[]> => {
    const res = await apiClient.get<ApiResponse<AprDoc[]>>('v1/apr/apprs/doc-list/manager', { params });
    return res.data.data ?? [];
  },

  /** AS-IS apr.Apr01_Appr.updateParentId (Dcr01_Move_DcrClass, EE05): 고른 문서를 최하위 문서분류로 이동 */
  moveDocClass: async (apprIds: number[], classTreeId: number): Promise<void> => {
    await apiClient.put('v1/apr/apprs/class-tree', { apprIds, classTreeId });
  },

  /** AS-IS apr.Apr03_RelateFund.selectByClassTreeId·selectBySearch (Apr05_Grid_RelateAprList, W05 ⓒ): searchText를 주지 않으면 분류 클릭 조회, 주면 [찾기](서버가 %…%로) */
  searchLoadDocs: async (classTreeId: number, searchText?: string): Promise<AprLoadDoc[]> => {
    const res = await apiClient.get<ApiResponse<AprLoadDoc[]>>('v1/apr/apprs/load-docs', { params: { classTreeId, searchText } });
    return res.data.data ?? [];
  },

  /** AS-IS apr.Apr03_RelateFund.selectByIcsClassTreeId (Ics01_Grid_ApprList): 법규분류에 연결된 문서 목록. searchText는 서버가 %…%로 */
  searchIcsDocList: async (params: { classTreeId: number; startDate: string; endDate: string; searchText: string }): Promise<AprIcsDoc[]> => {
    const res = await apiClient.get<ApiResponse<AprIcsDoc[]>>('v1/apr/apprs/ics-list', { params });
    return res.data.data ?? [];
  },

  /** AS-IS apr.Apr99_ApprDel.selectByCompanyId (Apr01_Tab_Restore): 폐기문서 목록. companyId는 서버가 세션에서, LIKE '%'는 서버가 만든다(빈 값=전체) */
  searchApprDels: async (params: { startDate: string; closeDate: string; orgName?: string; personName?: string; aprName?: string }): Promise<AprApprDel[]> => {
    const res = await apiClient.get<ApiResponse<AprApprDel[]>>('v1/apr/appr-dels', { params });
    return res.data.data ?? [];
  },

  /** AS-IS apr.Apr99_ApprDel.restore (Apr01_Tab_Restore): 폐기문서를 상신문서로 복구. companyId·regEmpId는 서버가 세션에서 */
  restoreApprDel: async (apprId: number): Promise<void> => {
    await apiClient.post('v1/apr/appr-dels/restore', { apprId });
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

  /** AS-IS apr.Apr90_DisposalList.selectByCompanyId (Apr90_Tab_DisposalListAdmin, EE04): 회사 전체 폐기 신청(confirmEmpId 조건 없음). disposalCode '%'=전체 */
  searchDisposalAdmin: async (params: { startDate: string; closeDate: string; disposalCode: string }): Promise<AprDisposalAppr[]> => {
    const res = await apiClient.get<ApiResponse<AprDisposalAppr[]>>('v1/apr/disposal-lists/admin', { params });
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

  /** AS-IS apr.Apr01_Appr.selectByText (L06 Apr01_Tab_BizPriorApproval 이익제공 사전승인신청): 내가 올린 PreProvideRcvType 문서 */
  searchPreProvide: async (startDate: string, endDate: string): Promise<AprPreProvide[]> => {
    const res = await apiClient.get<ApiResponse<AprPreProvide[]>>('v1/apr/apprs/pre-provide', { params: { startDate, endDate } });
    return res.data.data ?? [];
  },

  /** AS-IS apr.Apr01_Appr.selectByText (A40 Apr01_Tab_ExternalBiz 대외활동 신청서 작성): 내가 올린 문서 중 제목이 title로 시작하는 것 */
  searchByTitle: async (startDate: string, endDate: string, title: string): Promise<AprPreProvide[]> => {
    const res = await apiClient.get<ApiResponse<AprPreProvide[]>>('v1/apr/apprs/by-title', { params: { startDate, endDate, title } });
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

/** EE40 AS-IS Apr50_Lookup_ApprList (중요표시 문서) */
export const aprBookmarkListApi = {
  /** AS-IS apr.Apr50_Bookmark.selectByPersonIdPaging(+Total): 내가 중요표시했거나 전체공유된 문서 */
  search: async (searchText: string, offset: number, limit: number): Promise<PageRes<AprBookmarkList>> => {
    const res = await apiClient.get<ApiResponse<PageRes<AprBookmarkList>>>('v1/apr/bookmarks', { params: { searchText, offset, limit } });
    return res.data.data;
  },
};

/** G05 AS-IS Apr07_Tab_AltAppr (대결자 지정) */
export const aprAltApprApi = {
  /** AS-IS apr.Apr07_AltAppr.selectByEmpId */
  searchAltApprs: async (): Promise<AprAltAppr[]> => {
    const res = await apiClient.get<ApiResponse<AprAltAppr[]>>('v1/apr/alt-apprs');
    return res.data.data ?? [];
  },
  /** AS-IS apr.Apr07_AltAppr.selectByToDay (Apr07_Lookup_AltAppr) — 오늘 이후까지 걸친 대결자만 */
  searchAltApprsToday: async (): Promise<AprAltAppr[]> => {
    const res = await apiClient.get<ApiResponse<AprAltAppr[]>>('v1/apr/alt-apprs/today');
    return res.data.data ?? [];
  },
  /** AS-IS apr.Apr07_AltAppr.notAltApprIdList + update → 저장된 행(요청 순서). 새 행(id ≤ 0)은 id를 빼고 보낸다 */
  saveAltApprs: async (rows: AprAltAppr[]): Promise<AprAltAppr[]> => {
    const body = rows.map(({ altApprId, altEmpId, altEmpName, startDate, closeDate, stampYn, reasonCd, emgrPoint, leaveId }) =>
      ({ altApprId: altApprId > 0 ? altApprId : null, altEmpId, altEmpName, startDate, closeDate, stampYn, reasonCd, emgrPoint, leaveId: leaveId ?? null }));
    const res = await apiClient.put<ApiResponse<AprAltAppr[]>>('v1/apr/alt-apprs', body);
    return res.data.data ?? [];
  },
  /** AS-IS apr.Apr07_AltAppr.delete → 지운 건수 */
  deleteAltApprs: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/apr/alt-apprs', { data: ids });
    return res.data.data ?? 0;
  },
};

/** EE02 AS-IS Apr07_Tab_AltApprMgr (대결자 지정(관리자)) */
export const aprAltApprMgrApi = {
  /** AS-IS apr.Apr07_AltAppr.selectByText — companyId는 서버가 세션에서, searchText는 원결재자 이름(서버가 %로 감싼다) */
  search: async (params: { startDate: string; endDate: string; searchText: string }): Promise<AprAltApprMgr[]> => {
    const res = await apiClient.get<ApiResponse<AprAltApprMgr[]>>('v1/apr/alt-appr-mgrs', { params });
    return res.data.data ?? [];
  },
  /** AS-IS apr.Apr07_AltAppr.notAltApprIdList + update → 저장된 행(요청 순서). 새 행(id ≤ 0)은 id를 빼고 보낸다 */
  save: async (rows: AprAltApprMgr[]): Promise<AprAltApprMgr[]> => {
    const body = rows.map(({ altApprId, targetEmpId, targetEmpName, altEmpId, altEmpName, startDate, closeDate, stampYn, reasonCd, emgrPoint, note }) =>
      ({ altApprId: altApprId > 0 ? altApprId : null, targetEmpId, targetEmpName, altEmpId, altEmpName, startDate, closeDate, stampYn, reasonCd, emgrPoint, note }));
    const res = await apiClient.put<ApiResponse<AprAltApprMgr[]>>('v1/apr/alt-appr-mgrs', body);
    return res.data.data ?? [];
  },
  /** AS-IS apr.Apr07_AltAppr.delete → 지운 건수 */
  remove: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/apr/alt-appr-mgrs', { data: ids });
    return res.data.data ?? 0;
  },
};

/** T23 법인서류 매수관리 (AS-IS Apr16_StampDoc) */
export const aprStampDocApi = {
  /** AS-IS apr.Apr16_StampDoc.selectDocByRegDate — applType 없으면 인감증명서·등기부등본 모두 */
  search: async (params: { startDate: string; closeDate: string; applType?: string; stampReprCorpId?: number }): Promise<AprStampDoc[]> => {
    const res = await apiClient.get<ApiResponse<AprStampDoc[]>>('v1/apr/stamp-docs', { params });
    return res.data.data ?? [];
  },

  /** AS-IS apr.Apr16_StampDoc.selectDocGroupSum */
  searchSum: async (params: { applType?: string; stampReprCorpId?: number }): Promise<AprStampDocSum[]> => {
    const res = await apiClient.get<ApiResponse<AprStampDocSum[]>>('v1/apr/stamp-docs/sum', { params });
    return res.data.data ?? [];
  },

  /** AS-IS apr.Apr16_StampDoc.selectByApplType (Apr16_Lookup_StampReprCorp) */
  searchLookup: async (applType?: string): Promise<AprStampDocLookup[]> => {
    const res = await apiClient.get<ApiResponse<AprStampDocLookup[]>>('v1/apr/stamp-docs/lookup', { params: { applType } });
    return res.data.data ?? [];
  },

  /** AS-IS apr.Apr16_StampDoc.selectApplDocByRegDateIsNull — 등록일이 없는 신청내역 */
  searchAppl: async (): Promise<AprStampDocAppl[]> => {
    const res = await apiClient.get<ApiResponse<AprStampDocAppl[]>>('v1/apr/stamp-docs/appl');
    return res.data.data ?? [];
  },

  /** AS-IS apr.Apr16_StampDoc.update → 저장한 건수 */
  save: async (rows: AprStampDocSaveReq[]): Promise<number> => {
    const res = await apiClient.put<ApiResponse<number>>('v1/apr/stamp-docs', rows);
    return res.data.data ?? 0;
  },

  /** Y11 AS-IS apr.Apr16_StampDoc.selectByApplEmpId — 내 법인서류 및 날인신청(로그인 사원). procResult면 등록일·날인일자가 없는 것만 */
  searchMine: async (params: { startDate: string; closeDate: string; searchText?: string; procResult: boolean }): Promise<AprStampAppl[]> => {
    const res = await apiClient.get<ApiResponse<AprStampAppl[]>>('v1/apr/stamp-docs/mine', { params });
    return res.data.data ?? [];
  },

  /** Y11 AS-IS apr.Apr16_StampDoc.update (신청 창) → 저장한 행의 ID */
  saveMine: async (req: AprStampApplSaveReq): Promise<number> => {
    const res = await apiClient.put<ApiResponse<number>>('v1/apr/stamp-docs/mine', req);
    return res.data.data;
  },

  /** Y11 AS-IS apr.Apr16_StampDoc.delete → 지운 건수 */
  deleteMine: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/apr/stamp-docs/mine', { data: ids });
    return res.data.data ?? 0;
  },

  /** AS-IS apr.Apr16_StampDoc.deleteReg */
  deleteReg: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/apr/stamp-docs', { data: ids });
    return res.data.data ?? 0;
  },

  /** AS-IS apr.Apr16_StampDoc.updateRegDate — 신청내역 가져오기 */
  registerRegDate: async (ids: number[]): Promise<number> => {
    const res = await apiClient.put<ApiResponse<number>>('v1/apr/stamp-docs/reg-date', ids);
    return res.data.data ?? 0;
  },

  /** AS-IS sys.Sys99_Print.insertRdStampDocManager → rdGroupId */
  rdPrint: async (startDate: string, closeDate: string): Promise<string> => {
    const res = await apiClient.post<ApiResponse<string>>('v1/apr/stamp-docs/rd-print', null, { params: { startDate, closeDate } });
    return res.data.data;
  },

  /** T24·T25 AS-IS apr.Apr16_StampDoc.selectStampByCompanyId — org=true면 부서 인감날인대장(T25) */
  searchStampList: async (params: { startDate: string; closeDate: string; stampId?: number; outYn: boolean; searchText?: string; org?: boolean }): Promise<AprStampList[]> => {
    const res = await apiClient.get<ApiResponse<AprStampList[]>>('v1/apr/stamp-docs/stamp-list', { params });
    return res.data.data;
  },

  /** T24·T25 AS-IS sys.Sys99_Print.insertRdStampListApr16 → rdGroupId */
  stampListRdPrint: async (params: { startDate: string; closeDate: string; stampId?: number; outYn: boolean; searchText?: string; org?: boolean }): Promise<string> => {
    const res = await apiClient.post<ApiResponse<string>>('v1/apr/stamp-docs/stamp-list/rd-print', null, { params });
    return res.data.data;
  },

  /** T24·T25 AS-IS apr.Apr16_StampDoc.selectById — 날인일자 설정 창이 여는 값 */
  getStampDate: async (stampDocId: number): Promise<string | null> => {
    const res = await apiClient.get<ApiResponse<string | null>>(`v1/apr/stamp-docs/${stampDocId}/stamp-date`);
    return res.data.data ?? null;
  },

  /** T24·T25 AS-IS apr.Apr16_StampDoc.updateStampDate */
  updateStampDate: async (stampDocId: number, stampDate: string | null): Promise<number> => {
    const res = await apiClient.put<ApiResponse<number>>('v1/apr/stamp-docs/stamp-date', { stampDocId, stampDate });
    return res.data.data ?? 0;
  },

  /** T26 AS-IS apr.Apr16_StampDoc.selectStampCheck */
  searchStampCheck: async (params: { startDate: string; closeDate: string; stampId?: number; notStampFileYn: boolean }): Promise<AprStampCheck[]> => {
    const res = await apiClient.get<ApiResponse<AprStampCheck[]>>('v1/apr/stamp-docs/stamp-check', { params });
    return res.data.data;
  },

  /** T26 AS-IS apr.Apr16_StampDoc.updateConfirmDate — check=false면 확인취소 */
  confirm: async (ids: number[], check: boolean): Promise<number> => {
    const res = await apiClient.put<ApiResponse<number>>('v1/apr/stamp-docs/confirm', { ids, check });
    return res.data.data ?? 0;
  },

  /** AS-IS apr.Apr15_ReprCorp.selectByCompanyId (Apr15_Lookup_ReprCorp) */
  searchReprCorpLookup: async (companyAddYn: boolean): Promise<AprReprCorpLookup[]> => {
    const res = await apiClient.get<ApiResponse<AprReprCorpLookup[]>>('v1/apr/repr-corps/lookup', { params: { companyAddYn } });
    return res.data.data ?? [];
  },

  /** AS-IS apr.Apr15_ReprCorp.selectCorpRegYn — 등록 대표명의가 있는가 */
  existsCorpReg: async (): Promise<boolean> => {
    const res = await apiClient.get<ApiResponse<boolean>>('v1/apr/repr-corps/corp-reg-exists');
    return res.data.data;
  },

  /** AS-IS apr.Apr10_Stamp.selectCorpStampYn — 기본 법인인감(없으면 null) */
  getCorpStamp: async (): Promise<AprCorpStamp | null> => {
    const res = await apiClient.get<ApiResponse<AprCorpStamp | null>>('v1/apr/stamps/corp-stamp');
    return res.data.data ?? null;
  },
};

/** 전자결재 문서 열기 (AS-IS client/vi/apr/Apr01_Edit_ApprDoc 읽기, V01) */
export const aprDetailApi = {
  /** AS-IS apr.Apr01_Appr.selectById — 로그인 회사의 문서만 */
  getDetail: async (apprId: number): Promise<AprApprDetail> => {
    const res = await apiClient.get<ApiResponse<AprApprDetail>>(`v1/apr/apprs/${apprId}/detail`);
    return res.data.data;
  },

  /** AS-IS apr.Apr04_ApprStep.selectByApprId: 결재선 (결재자 문구는 서버가 만든다) */
  getSteps: async (apprId: number): Promise<AprApprStep[]> => {
    const res = await apiClient.get<ApiResponse<AprApprStep[]>>(`v1/apr/apprs/${apprId}/steps`);
    return res.data.data ?? [];
  },

  /** AS-IS apr.Apr03_RelateFund.selectByApprId: 연관펀드 (펀드유형·코드·펀드명·결재이후·출력) */
  getFunds: async (apprId: number): Promise<AprApprFund[]> => {
    const res = await apiClient.get<ApiResponse<AprApprFund[]>>(`v1/apr/apprs/${apprId}/funds`);
    return res.data.data ?? [];
  },

  /** AS-IS apr.Apr12_RelateAdv.selectByApprId: 연관일임 */
  getAdvs: async (apprId: number): Promise<AprApprAdv[]> => {
    const res = await apiClient.get<ApiResponse<AprApprAdv[]>>(`v1/apr/apprs/${apprId}/advs`);
    return res.data.data ?? [];
  },

  /** AS-IS apr.Apr21_RelateAppr.selectByApprId */
  getRelateApprs: async (apprId: number): Promise<AprRelateAppr[]> => {
    const res = await apiClient.get<ApiResponse<AprRelateAppr[]>>(`v1/apr/apprs/${apprId}/relate-apprs`);
    return res.data.data ?? [];
  },

  /** AS-IS apr.Apr20_RelateIcs.selectByApprId */
  getRelateIcs: async (apprId: number): Promise<AprRelateLaw[]> => {
    const res = await apiClient.get<ApiResponse<AprRelateLaw[]>>(`v1/apr/apprs/${apprId}/relate-ics`);
    return res.data.data ?? [];
  },

  /** AS-IS apr.Apr22_RelateIcr.selectByApprId */
  getRelateIcr: async (apprId: number): Promise<AprRelateLaw[]> => {
    const res = await apiClient.get<ApiResponse<AprRelateLaw[]>>(`v1/apr/apprs/${apprId}/relate-icr`);
    return res.data.data ?? [];
  },

  /** AS-IS apr.Apr16_StampDoc.selectByApprId: 날인신청 */
  getStampAppls: async (apprId: number): Promise<AprApprStampAppl[]> => {
    const res = await apiClient.get<ApiResponse<AprApprStampAppl[]>>(`v1/apr/apprs/${apprId}/stamp-appls`);
    return res.data.data ?? [];
  },

  /** AS-IS sys.Sys10_File.selectByParentId: 첨부파일 (표지 제외) */
  getFiles: async (apprId: number): Promise<AprApprFile[]> => {
    const res = await apiClient.get<ApiResponse<AprApprFile[]>>(`v1/apr/apprs/${apprId}/files`);
    return res.data.data ?? [];
  },

  /** AS-IS apr.Apr50_Bookmark.selectByPublicYn: 북마크 켜짐 */
  isBookmarked: async (apprId: number): Promise<boolean> => {
    const res = await apiClient.get<ApiResponse<boolean>>(`v1/apr/apprs/${apprId}/bookmark`);
    return !!res.data.data;
  },

  /** AS-IS apr.Apr42_Comment.getSize: 댓글 건수 */
  getCommentSize: async (apprId: number): Promise<number> => {
    const res = await apiClient.get<ApiResponse<number>>(`v1/apr/apprs/${apprId}/comment-size`);
    return res.data.data ?? 0;
  },

  /** AS-IS apr.Apr41_OpenHistory.insert: 열람기록 (임시저장·관리자는 서버가 건너뛴다) */
  recordOpen: async (apprId: number): Promise<void> => {
    await apiClient.post(`v1/apr/apprs/${apprId}/open-history`);
  },
};

/** 전자결재 결재 처리 (AS-IS client/vi/apr/Apr01_Edit_ApprDoc 승인·반려·승인취소·상신취소, V02) */
export const aprActionApi = {
  /** AS-IS retrieveApproval/myTurnCheck/myCancelApprovalCheck: 이 사원에게 켜질 단추 */
  getState: async (apprId: number): Promise<AprApprActionState> => {
    const res = await apiClient.get<ApiResponse<AprApprActionState>>(`v1/apr/apprs/${apprId}/action-state`);
    return res.data.data;
  },

  /** AS-IS apr.Apr04_ApprStep.confirmCheck: [승인]·[반려]를 누른 직후(의견 창 전) 앞 결재가 끝났는지 */
  confirmCheck: async (apprId: number): Promise<AprApprActionRes> => {
    const res = await apiClient.post<ApiResponse<AprApprActionRes>>(`v1/apr/apprs/${apprId}/confirm-check`);
    return res.data.data;
  },

  /** AS-IS apr.Apr04_ApprStep.confirmUpdate: action 'confirm'(승인, message=결재의견) | 'reject'(반려, message=반려사유) */
  confirm: async (apprId: number, action: 'confirm' | 'reject', message: string): Promise<AprApprActionRes> => {
    const res = await apiClient.post<ApiResponse<AprApprActionRes>>(`v1/apr/apprs/${apprId}/confirm`, { action, message });
    return res.data.data;
  },

  /** AS-IS apr.Apr04_ApprStep.nextTurnCheck + clearApprStepId: 승인취소 */
  cancelApproval: async (apprId: number): Promise<AprApprActionRes> => {
    const res = await apiClient.post<ApiResponse<AprApprActionRes>>(`v1/apr/apprs/${apprId}/cancel-approval`);
    return res.data.data;
  },

  /** AS-IS 상신취소 (cancelCheck01~cancel2, 특정 화면 상신 문서는 deleteChk01): needConfirm이면 확인을 받고 confirmed=true로 다시 */
  cancelRequest: async (apprId: number, confirmed: boolean): Promise<AprApprActionRes> => {
    const res = await apiClient.post<ApiResponse<AprApprActionRes>>(`v1/apr/apprs/${apprId}/cancel-request`, { confirmed });
    return res.data.data;
  },
};

/** 전자결재 새 문서·상신·임시저장 (AS-IS client/vi/apr/Apr01_Edit_ApprDoc.insertApproval·save·update·deleteChk01, V03·V06) */
export const aprWriteApi = {
  /** AS-IS insertApproval: 문서 번호·기본 제목/본문·기본 결재선·연관법규/내규 (DB는 안 바뀐다) */
  openNew: async (classTreeId: number): Promise<AprApprNew> => {
    const res = await apiClient.get<ApiResponse<AprApprNew>>('v1/apr/apprs/new', { params: { classTreeId } });
    return res.data.data;
  },

  /** AS-IS insertLinkApproval: 링크코드별 제목·본문·시행일자 (V17, DB는 안 바뀐다) */
  /** AS-IS apr.Apr01_Appr.selectByApprIdList — 결재문서 번호들로 상신일자·제목·상태를 읽는다 (Apr01_Lookup_ApprLink, V34) */
  searchByApprIds: async (apprIds: number[]): Promise<AprApprIdRow[]> => {
    const res = await apiClient.get<ApiResponse<AprApprIdRow[]>>('v1/apr/apprs/by-ids', { params: { apprIds: apprIds.join(',') } });
    return res.data.data ?? [];
  },

  linkSeed: async (classTreeId: number, linkCode: string, refId?: number | null, args?: AprLinkArgs): Promise<AprLinkSeed> => {
    const res = await apiClient.get<ApiResponse<AprLinkSeed>>('v1/apr/apprs/link-seed', { params: { classTreeId, linkCode, refId: refId ?? undefined, ...args } });
    return res.data.data;
  },

  /**
   * AS-IS 인감을 고른 뒤 결재선 다시 만들기 (V12): retrieveRoleStamp(checkRole, 새 문서의 기본 인감) · findLookupStamp/대표회사 선택의 resetApprStep.
   * stampId가 없으면 인감 줄이 없는 기본 결재선
   */
  stampLine: async (classTreeId: number, stampId: number | null, checkRole = false): Promise<AprStampLine> => {
    const res = await apiClient.get<ApiResponse<AprStampLine>>('v1/apr/apprs/stamp-line', { params: { classTreeId, stampId: stampId ?? undefined, checkRole } });
    return res.data.data;
  },

  /** AS-IS apr.Apr01_Appr.update: mode 'save'(임시저장) | 'request'(결재요청) */
  save: async (apprId: number, req: AprApprSaveReq): Promise<AprApprWriteRes> => {
    const res = await apiClient.put<ApiResponse<AprApprWriteRes>>(`v1/apr/apprs/${apprId}`, req);
    return res.data.data;
  },

  /** AS-IS deleteChk01 → apr.Apr01_Appr.deleteByApprId (임시저장 문서) */
  remove: async (apprId: number): Promise<AprApprWriteRes> => {
    const res = await apiClient.delete<ApiResponse<AprApprWriteRes>>(`v1/apr/apprs/${apprId}`);
    return res.data.data;
  },
};

/** 결재선 설정 창 (AS-IS client/vi/apr/Apr04_Edit_ApprStep, V07) */
export const aprStepEditApi = {
  /** mode: text(selectByText) | org(selectByOrgCodeId) | all(getTransDate) | orgDown(getOrgCodeId, includeYn이면 하위 조직까지) */
  emps: async (mode: 'text' | 'org' | 'all' | 'orgDown', params: { searchText?: string; orgCodeId?: number; includeYn?: boolean } = {}): Promise<AprStepEmp[]> => {
    const res = await apiClient.get<ApiResponse<AprStepEmp[]>>('v1/apr/step-lines/emps', { params: { mode, ...params } });
    return res.data.data ?? [];
  },

  /** AS-IS insertApprovalEmp: 고른 사원으로 결재선 줄 만들기 (stepTypeCode 10 결재·20 합의·30 참조) */
  lines: async (stepTypeCode: string, persons: { personId: number; orgCodeId: number }[]): Promise<AprNewStep[]> => {
    const res = await apiClient.post<ApiResponse<AprNewStep[]>>('v1/apr/step-lines/lines', { stepTypeCode, persons });
    return res.data.data ?? [];
  },

  /** AS-IS arrayPosCode: 직급순 재정렬용 직위 코드 */
  posCodes: async (personIds: number[]): Promise<{ personId: number; posCode?: string | null }[]> => {
    const res = await apiClient.post<ApiResponse<{ personId: number; posCode?: string | null }[]>>('v1/apr/step-lines/pos-codes', personIds);
    return res.data.data ?? [];
  },

  /** AS-IS apprStepLockYnChk: 회사가 결재선을 잠그면 [불러오기]를 숨긴다 */
  locked: async (): Promise<boolean> => {
    const res = await apiClient.get<ApiResponse<boolean>>('v1/apr/step-lines/lock');
    return res.data.data;
  },

  /** AS-IS apr.Apr01_Appr.selectByWeek(week) · selectByDcrGroup(group): 최근결재선 불러오기 창의 내 상신 문서 */
  recentDocs: async (mode: 'week' | 'group', searchText = ''): Promise<AprRecentDoc[]> => {
    const res = await apiClient.get<ApiResponse<AprRecentDoc[]>>('v1/apr/step-lines/recent-docs', { params: { mode, searchText } });
    return res.data.data ?? [];
  },

  /** AS-IS getApprStepList + recentLoad: 고른 문서의 결재선(상신자 제외)을 지금 재직 정보로 다시 만든 줄 */
  recentLines: async (apprId: number): Promise<AprNewStep[]> => {
    const res = await apiClient.get<ApiResponse<AprNewStep[]>>(`v1/apr/step-lines/recent-docs/${apprId}/lines`);
    return res.data.data ?? [];
  },

  /** AS-IS apr.Apr04_ApprStep.updateList: 결재중 문서의 결재선 수정 (steps = 창에 남은 전체, deleteStepIds = 지운 기존 줄) */
  retouch: async (apprId: number, steps: AprApprSaveStep[], deleteStepIds: number[]): Promise<AprApprWriteRes> => {
    const res = await apiClient.put<ApiResponse<AprApprWriteRes>>(`v1/apr/step-lines/apprs/${apprId}`, { steps, deleteStepIds });
    return res.data.data;
  },
};

/** 전자결재 문서창의 [열람기록]·[댓글] (AS-IS client/vi/apr/Apr41_Lookup_OpenHistory · Apr42_Lookup_Comment, V04) */
export const aprCommentApi = {
  /** AS-IS apr.Apr41_OpenHistory.selectByApprIdPaging(+Total) */
  searchOpenHistories: async (apprId: number, offset: number, limit: number): Promise<PageRes<AprOpenHistory>> => {
    const res = await apiClient.get<ApiResponse<PageRes<AprOpenHistory>>>(`v1/apr/apprs/${apprId}/open-histories`, { params: { offset, limit } });
    return res.data.data;
  },

  /** AS-IS apr.Apr42_Comment.selectByApprId */
  searchComments: async (apprId: number): Promise<AprComment[]> => {
    const res = await apiClient.get<ApiResponse<AprComment[]>>(`v1/apr/apprs/${apprId}/comments`);
    return res.data.data ?? [];
  },

  /** AS-IS apr.Apr42_Comment.modelUpdate */
  createComment: async (apprId: number, comment: string): Promise<void> => {
    await apiClient.post(`v1/apr/apprs/${apprId}/comments`, { comment });
  },

  /** AS-IS apr.Apr42_Comment.delete (작성자만) */
  deleteComment: async (apprId: number, commentId: number): Promise<void> => {
    await apiClient.delete(`v1/apr/apprs/${apprId}/comments/${commentId}`);
  },

  /** AS-IS Apr42_Lookup_Comment [알림발송]: 결재선 사원 + 문구 */
  getNotice: async (apprId: number): Promise<AprCommentNotice> => {
    const res = await apiClient.get<ApiResponse<AprCommentNotice>>(`v1/apr/apprs/${apprId}/comment-notice`);
    return res.data.data;
  },
};

/** 전자결재 문서창의 [오타수정]·[중요표시]·[공람설정]·[문서폐기 신청] (AS-IS client/vi/apr/Apr01_Edit_ApprModi · Apr50_Lookup_PersonList · Apr13_Lookup_PersonAuth · Apr90_Lookup_DisposalList, V09) */
export const aprExtraApi = {
  /** AS-IS apr.Apr92_ApprModi.selectByPersonId (personId 없으면 로그인 사원). 기록이 없으면 null */
  getTypo: async (apprId: number, personId?: number | null): Promise<AprTypo | null> => {
    const res = await apiClient.get<ApiResponse<AprTypo | null>>(`v1/apr/apprs/${apprId}/typo`, { params: personId != null ? { personId } : {} });
    return res.data.data ?? null;
  },

  /** AS-IS apr.Apr01_Appr.modelUpdate (오타수정) — 바뀐 문서를 돌려준다 */
  saveTypo: async (apprId: number, req: AprTypoSaveReq): Promise<AprApprDetail> => {
    const res = await apiClient.put<ApiResponse<AprApprDetail>>(`v1/apr/apprs/${apprId}/typo`, req);
    return res.data.data;
  },

  /** AS-IS apr.Apr50_Bookmark.selectByApprId */
  getBookmarks: async (apprId: number): Promise<AprBookmark[]> => {
    const res = await apiClient.get<ApiResponse<AprBookmark[]>>(`v1/apr/apprs/${apprId}/bookmarks`);
    return res.data.data ?? [];
  },

  /** AS-IS apr.Apr50_Bookmark.insert (전체 중요표시 스위치) */
  setBookmarkPublic: async (apprId: number, publicYn: boolean): Promise<void> => {
    await apiClient.put(`v1/apr/apprs/${apprId}/bookmarks/public`, { publicYn });
  },

  /** AS-IS apr.Apr50_Bookmark.update (새 사원 줄) */
  addBookmarkPersons: async (apprId: number, personIds: number[]): Promise<void> => {
    await apiClient.put(`v1/apr/apprs/${apprId}/bookmarks`, { personIds });
  },

  /** AS-IS apr.Apr50_Bookmark.delete (체크한 줄) */
  deleteBookmarks: async (apprId: number, ids: number[]): Promise<void> => {
    await apiClient.delete(`v1/apr/apprs/${apprId}/bookmarks`, { params: { ids: ids.join(',') } });
  },

  /** AS-IS apr.Apr50_Bookmark.deleteByApprId ([초기화]) */
  clearBookmarks: async (apprId: number): Promise<void> => {
    await apiClient.delete(`v1/apr/apprs/${apprId}/bookmarks/all`);
  },

  /** AS-IS apr.Apr13_PersonAuth.selectByApprId */
  getPersonAuths: async (apprId: number): Promise<AprPersonAuth[]> => {
    const res = await apiClient.get<ApiResponse<AprPersonAuth[]>>(`v1/apr/apprs/${apprId}/person-auths`);
    return res.data.data ?? [];
  },

  /** AS-IS apr.Apr13_PersonAuth.update + delete */
  savePersonAuths: async (apprId: number, addPersonIds: number[], deleteIds: number[]): Promise<void> => {
    await apiClient.put(`v1/apr/apprs/${apprId}/person-auths`, { addPersonIds, deleteIds });
  },

  /** AS-IS apr.Apr90_DisposalList.checkDisposal */
  checkDisposal: async (apprId: number): Promise<AprDisposalCheck> => {
    const res = await apiClient.get<ApiResponse<AprDisposalCheck>>(`v1/apr/apprs/${apprId}/disposal-check`);
    return res.data.data;
  },

  /** AS-IS Apr90_Lookup_ConfirmEmp.getApprStep — 승인자 처음 값 (없으면 null) */
  getDisposalConfirmEmp: async (): Promise<AprDisposalConfirmEmp | null> => {
    const res = await apiClient.get<ApiResponse<AprDisposalConfirmEmp | null>>('v1/apr/apprs/disposal-confirm-emp');
    return res.data.data ?? null;
  },

  /** AS-IS apr.Apr90_DisposalList.modelUpdate */
  submitDisposal: async (apprId: number, reason: string, confirmEmpId: number): Promise<void> => {
    await apiClient.post(`v1/apr/apprs/${apprId}/disposal`, { reason, confirmEmpId });
  },
};

/** 전자결재 문서창의 [연관법규 추가/수정/삭제]·[결재완료후 첨부파일등록] (AS-IS client/vi/apr/Apr20_Lookup_RelateIcsList · Apr20_Lookup_RelateIcs · Apr01_Lookup_ApprFile, V10) */
export const aprRelateEditApi = {
  /** AS-IS apr.Apr20_RelateIcs.selectByApprId */
  getRelateIcs: async (apprId: number): Promise<AprRelateIcsRow[]> => {
    const res = await apiClient.get<ApiResponse<AprRelateIcsRow[]>>(`v1/apr/apprs/${apprId}/relate-ics-edit`);
    return res.data.data ?? [];
  },

  /** AS-IS apr.Apr20_RelateIcs.check + deleteList — 변경이 있어 저장했으면 true */
  saveRelateIcs: async (apprId: number, req: AprRelateIcsSaveReq): Promise<boolean> => {
    const res = await apiClient.put<ApiResponse<boolean>>(`v1/apr/apprs/${apprId}/relate-ics`, req);
    return !!res.data.data;
  },

  /** [행 추가]로 고른 법규·기한의 보기 값 */
  getRelateIcsInfo: async (classTreeId: number, deadlineId: number | null, withLaw = false): Promise<AprRelateIcsRow> => {
    const res = await apiClient.get<ApiResponse<AprRelateIcsRow>>('v1/apr/relate-ics/info', { params: { classTreeId, ...(deadlineId != null ? { deadlineId } : {}), ...(withLaw ? { withLaw } : {}) } });
    return res.data.data;
  },

  /** [등록]으로 고른 내규·기한의 보기 값 (V13) */
  getRelateIcrInfo: async (classTreeId: number, deadlineId: number | null): Promise<AprRelateIcsRow> => {
    const res = await apiClient.get<ApiResponse<AprRelateIcsRow>>('v1/apr/relate-icr/info', { params: deadlineId != null ? { classTreeId, deadlineId } : { classTreeId } });
    return res.data.data;
  },

  /** AS-IS apr.Apr20_RelateIcs.getCloseDate */
  getCloseDate: async (deadlineId: number, standDate: string): Promise<string | null> => {
    const res = await apiClient.get<ApiResponse<string | null>>('v1/apr/relate-ics/close-date', { params: { deadlineId, standDate } });
    return res.data.data ?? null;
  },

  /** AS-IS sys.Sys10_File.selectByFileYn */
  getAfterFiles: async (apprId: number): Promise<AprAfterFile[]> => {
    const res = await apiClient.get<ApiResponse<AprAfterFile[]>>(`v1/apr/apprs/${apprId}/after-files`);
    return res.data.data ?? [];
  },

  /** AS-IS sys.Sys10_File.update (인감날인본) */
  saveAfterFiles: async (apprId: number, items: { fileId: number; stampYn: boolean }[]): Promise<void> => {
    await apiClient.put(`v1/apr/apprs/${apprId}/after-files`, { items });
  },

  /** AS-IS apr.Apr03_RelateFund.selectByAfterYn — [연관펀드설정] 창 (V16) */
  getAfterFunds: async (apprId: number): Promise<AprAfterFund[]> => {
    const res = await apiClient.get<ApiResponse<AprAfterFund[]>>(`v1/apr/apprs/${apprId}/after-relate-funds`);
    return res.data.data ?? [];
  },

  /** AS-IS apr.Apr03_RelateFund.insert — [확정]: 창에 보이는 전체 줄 (V16) */
  saveAfterFunds: async (apprId: number, funds: { relateFundId: number; fundId: number; printYn?: string | null; afterYn?: string | null }[]): Promise<void> => {
    await apiClient.put(`v1/apr/apprs/${apprId}/after-relate-funds`, { funds });
  },

  /** AS-IS apr.Apr21_RelateAppr.insert — [확정]: 창에 보이는 전체 줄 (V16). 읽기는 aprDetailApi.getRelateApprs */
  saveAfterApprs: async (apprId: number, apprs: { relateApprId: number; targetApprId: number }[]): Promise<void> => {
    await apiClient.put(`v1/apr/apprs/${apprId}/after-relate-apprs`, { apprs });
  },
};

/** 상신 편집창의 [불러오기]·[양식]과 첨부파일 옵션설정·추가/삭제 (AS-IS client/vi/apr/Apr05_Lookup_LoadDoc2 · dcr/Dcr05_Lookup_FormView · apr/Apr01_Lookup_ApprFileList · sys/Sys61_Lookup_FileList·DelList, V05) */
export const aprAttachApi = {
  /** AS-IS dcr.Dcr00_DocList.selectByText */
  loadDocs: async (params: { classTreeId?: number | null; startDate: string; endDate: string; searchText: string }): Promise<AprLoadDoc2[]> => {
    const res = await apiClient.get<ApiResponse<AprLoadDoc2[]>>('v1/apr/doc-picks', { params: { ...params, classTreeId: params.classTreeId ?? undefined } });
    return res.data.data ?? [];
  },

  /** AS-IS dcr.Dcr05_DocType.selectByClassTreeId (all=false) / selectByName (all=true) */
  docForms: async (params: { classTreeId?: number | null; all: boolean; searchText: string; formClassCode?: string }): Promise<AprDocForm[]> => {
    const res = await apiClient.get<ApiResponse<AprDocForm[]>>('v1/apr/doc-forms', { params: { ...params, classTreeId: params.classTreeId ?? undefined } });
    return res.data.data ?? [];
  },

  /** AS-IS sys.Sys10_File.selectByParentId (옵션 열 포함) */
  getEditFiles: async (apprId: number): Promise<AprEditFile[]> => {
    const res = await apiClient.get<ApiResponse<AprEditFile[]>>(`v1/apr/apprs/${apprId}/edit-files`);
    return res.data.data ?? [];
  },

  /** AS-IS sys.Sys10_File.updateOthers */
  saveOptions: async (apprId: number, items: { fileId: number; printYn: boolean; extYn: boolean; seq: string }[]): Promise<void> => {
    await apiClient.put(`v1/apr/apprs/${apprId}/edit-files/options`, { items });
  },

  /** AS-IS sys.Sys61_FileDel.selectByParentId */
  getFileDels: async (apprId: number): Promise<AprFileDel[]> => {
    const res = await apiClient.get<ApiResponse<AprFileDel[]>>(`v1/apr/apprs/${apprId}/file-dels`);
    return res.data.data ?? [];
  },

  /** AS-IS sys.Sys61_FileDel.insert */
  deleteFiles: async (apprId: number, fileIds: number[], reason: string): Promise<void> => {
    await apiClient.post(`v1/apr/apprs/${apprId}/file-dels`, { fileIds, reason });
  },
};

/** 상신 문서창 날인신청 탭 (AS-IS client/vi/apr/Apr16_Grid_StampDoc · Apr16_Grid_StampApplList · Apr16_Lookup_StampApplQty, V14) */
export const aprStampApplApi = {
  /** AS-IS apr.Apr16_StampDoc.selectByApprId + selectProvideCoByApprId + apr.Apr04_ApprStep.checkApprId */
  get: async (apprId: number): Promise<AprStampApplEdit> => {
    const res = await apiClient.get<ApiResponse<AprStampApplEdit>>(`v1/apr/apprs/${apprId}/stamp-docs`);
    return res.data.data;
  },

  /** AS-IS apr.Apr16_StampDoc.modelUpdate — 그 자리에서 DB에 넣는다 */
  add: async (apprId: number, req: AprStampApplAddReq): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>(`v1/apr/apprs/${apprId}/stamp-docs`, req);
    return res.data.data;
  },

  /** AS-IS apr.Apr16_StampDoc.delete */
  remove: async (apprId: number, stampDocId: number): Promise<void> => {
    await apiClient.delete(`v1/apr/apprs/${apprId}/stamp-docs/${stampDocId}`);
  },
};
