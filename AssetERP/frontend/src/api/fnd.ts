import { apiClient } from './client';
import { ApiResponse, PageRes } from '../types/auth';
import { readBlobError } from './file';
import { AstAssetItem, BookExtr, BookRelateAst, BookRelateFnd, Consignment, FundCode, FundDetail, FundHistory, FundInfo, FundLookup, FundMulti, FundPlan, FundRelate, FundSearch, FundSingle, FundTermsDetail, IpoAccount, FundPlanAuth, FundPlanList, OfficeWork, OprDemand, OprDemandOffer, OprDemandSave, OprFund, OprFundSave, OprSub, OprSubSave, Plan, Terms, TermsRevision, TermsRevisionSaveReq, TermsView, TrustBank } from '../types/fnd';

/** fnd(기관정보) 화면 API (D11~) */
export interface FundOrgAuthParams {
  closeYn: boolean;
  classFundExceptYn: boolean;
  fundName: string;
  fundTypeCode: string;
  classTypeCode: string;
}

export const fndApi = {
  // ── F06 펀드별 문서검색 (Apr01_Tab_FundDocument) ──

  /** AS-IS fnd.Fnd01_FundCode.selectByFundOrgAuth: 내 조직이 권한을 가진 펀드. 펀드명은 서버가 %…%로, 유형·클래스 구분은 '%'가 전체 */
  searchFundCodesByOrgAuth: async (params: FundOrgAuthParams): Promise<FundCode[]> => {
    const res = await apiClient.get<ApiResponse<FundCode[]>>('v1/fnd/fund-codes/org-auth', { params });
    return res.data.data ?? [];
  },

  // ── P01 신규기획펀드 등록 (Fnd01_Tab_FundPlan) ──

  /** AS-IS fnd.Fnd01_FundCode.selectByFundPlan: 로그인 회사의 임시펀드. 펀드명은 서버가 %…%로, 유형은 '%'가 전체 */
  searchFundPlans: async (params: { closeYn: boolean; fundName: string; fundTypeCode: string }): Promise<FundPlan[]> => {
    const res = await apiClient.get<ApiResponse<FundPlan[]>>('v1/fnd/fund-codes/plans', { params });
    return res.data.data ?? [];
  },

  /** AS-IS fnd.Fnd01_FundCode.selectByOverlap: 이미 쓰는 임시코드면 true */
  existsFundPlanCode: async (fundCode: string): Promise<boolean> => {
    const res = await apiClient.get<ApiResponse<boolean>>('v1/fnd/fund-codes/plans/overlap', { params: { fundCode } });
    return res.data.data ?? false;
  },

  /** AS-IS fnd.Fnd01_FundCode.update: 저장된 행을 돌려준다(새 행이면 서버가 매긴 id) */
  saveFundPlan: async (row: FundPlan): Promise<FundPlan> => {
    const res = await apiClient.put<ApiResponse<FundPlan>>('v1/fnd/fund-codes/plans', row);
    return res.data.data as FundPlan;
  },

  /** AS-IS fnd.Fnd01_FundCode.delete: ICAM관리 펀드가 있으면 서버가 거절 */
  deleteFundPlans: async (rows: FundPlan[]): Promise<void> => {
    await apiClient.delete('v1/fnd/fund-codes/plans', { data: rows.map(r => ({ fundCodeId: r.fundCodeId, fundInfoId: r.fundInfoId })) });
  },

  /** AS-IS fnd.Fnd00_Fund.selectByLookupFundCode: 펀드찾기(일반 펀드, 임시펀드 제외) */
  searchFundLookup: async (closeYn: boolean, fundName: string): Promise<FundLookup[]> => {
    const res = await apiClient.get<ApiResponse<FundLookup[]>>('v1/fnd/funds/lookup', { params: { closeYn, fundName } });
    return res.data.data ?? [];
  },

  // ── P02 신규기획펀드 권한설정 (Fnd08_Tab_OrgAuthTempFund) ──

  /** AS-IS fnd.Fnd01_FundCode.selectByFundName(권한부서 없음) / selectByFundOrgAuth(권한부서 orgId 있음): 임시펀드 목록 */
  searchFundPlanAuths: async (params: { closeYn: boolean; fundName: string; fundTypeCode: string; classTypeCode: string; orgId?: number | null }): Promise<FundPlanAuth[]> => {
    const res = await apiClient.get<ApiResponse<FundPlanAuth[]>>('v1/fnd/fund-codes/plan-auths', { params: { ...params, orgId: params.orgId ?? undefined } });
    return res.data.data ?? [];
  },

  // ── P08 펀드 조회(변경이력) (Fnd01_Tab_FundIcamHistory) ──

  /** AS-IS fnd.Fnd01_FundCode.selectByHistoryCompanyId: 오늘 기준 펀드별 최신 펀드정보 */
  searchFundHistory: async (params: { closeYn: boolean; searchText: string }): Promise<FundHistory[]> => {
    const res = await apiClient.get<ApiResponse<FundHistory[]>>('v1/fnd/fund-codes/history', { params });
    return res.data.data ?? [];
  },

  /** AS-IS fnd.Fnd02_FundInfo.selectByPaging: 한 펀드의 변경이력(작업일 내림차순) 페이지 */
  searchFundInfos: async (params: { fundCode: string; offset: number; limit: number }): Promise<PageRes<FundInfo>> => {
    const res = await apiClient.get<ApiResponse<PageRes<FundInfo>>>('v1/fnd/fund-infos', { params });
    return res.data.data;
  },

  // ── P09 펀드별 자산 조회(ICAM) (Fnd10_Tab_RelateAst) ──

  /** AS-IS fnd.Fnd01_FundCode.selectByCompanyId: 내 조직 권한 펀드(기준일 최신 펀드정보). fundType 없음 = 콤보 "전체"(null) */
  searchFundRelate: async (params: { stdDate: string; fundType?: string; searchText: string }): Promise<FundRelate[]> => {
    const res = await apiClient.get<ApiResponse<FundRelate[]>>('v1/fnd/fund-codes/relate', { params });
    return res.data.data ?? [];
  },

  /** AS-IS fnd.Fnd10_Book.selectByRelateAst: 고른 펀드의 기준일 운용자산 */
  searchBookRelateAst: async (params: { fundCodeId: number; stdDate: string }): Promise<BookRelateAst[]> => {
    const res = await apiClient.get<ApiResponse<BookRelateAst[]>>('v1/fnd/books/relate-ast', { params });
    return res.data.data ?? [];
  },

  // ── P10 자산별 펀드 조회(ICAM) (Fnd10_Tab_RelateFnd) ──

  /** AS-IS ast.Ast01_ClassTree.selectByAssetType: 기준일에 펀드 운용자산이 있는 종목 (assetType "2" = 운용자산) */
  searchAstAssetItems: async (params: { stdDate: string; assetType: string; searchText: string }): Promise<AstAssetItem[]> => {
    const res = await apiClient.get<ApiResponse<AstAssetItem[]>>('v1/ast/class-trees/by-asset-type', { params });
    return res.data.data ?? [];
  },

  /** AS-IS fnd.Fnd10_Book.selectByRelateFnd: 고른 종목을 가진 내 권한 펀드 */
  searchBookRelateFnd: async (params: { astClassTreeId: number; stdDate: string }): Promise<BookRelateFnd[]> => {
    const res = await apiClient.get<ApiResponse<BookRelateFnd[]>>('v1/fnd/books/relate-fnd', { params });
    return res.data.data ?? [];
  },

  // ── P07 펀드 조회 (Fnd01_Tab_FundSearch) ──

  /** AS-IS fnd.Fnd01_FundCode.selectByFundName: P05와 같은 조회 + 최종 규약(termsId·revisionNo·revisionDate) */
  searchFundSearch: async (params: { closeYn: boolean; fundName: string; fundTypeCode: string; classTypeCode: string }): Promise<FundSearch[]> => {
    const res = await apiClient.get<ApiResponse<FundSearch[]>>('v1/fnd/fund-codes/search', { params });
    return res.data.data ?? [];
  },

  /** AS-IS sys.Sys99_Print.insertRdFundSearch: 같은 조건의 조회 결과를 출력 자료로 담고 그룹 ID를 돌려준다 */
  rdDownloadFundSearch: async (body: { closeYn: boolean; fundName: string; fundTypeCode: string; classTypeCode: string }): Promise<string> => {
    const res = await apiClient.post<ApiResponse<string>>('v1/fnd/fund-codes/search/rd-download', body);
    return res.data.data ?? '';
  },

  /** AS-IS fnd.Fnd26_TermsDetail.selectByTermsId: 규약의 사용 중인 개정 목록(개정회차 내림차순) */
  searchTermsDetails: async (termsId: number): Promise<FundTermsDetail[]> => {
    const res = await apiClient.get<ApiResponse<FundTermsDetail[]>>(`v1/fnd/terms/${termsId}/details`);
    return res.data.data ?? [];
  },

  // ── P06 펀드 권한설정 (Fnd08_Tab_OrgAuth) ──

  /** AS-IS fnd.Fnd01_FundCode.selectByFundName(권한부서 없음) / selectByFundOrgAuth(권한부서 orgId 있음): 일반 펀드 목록 (P02와 같은 SQL, planYn만 false) */
  searchFundAuths: async (params: { closeYn: boolean; fundName: string; fundTypeCode: string; classTypeCode: string; orgId?: number | null }): Promise<FundPlanAuth[]> => {
    const res = await apiClient.get<ApiResponse<FundPlanAuth[]>>('v1/fnd/fund-codes/auths', { params: { ...params, orgId: params.orgId ?? undefined } });
    return res.data.data ?? [];
  },

  /** AS-IS fnd.Fnd00_Fund.selectBySearchText(orgId 없음 → selectBySearchTextAdmin): 연관펀드 조회창 (Fnd01_Lookup_SelectMulti.openAdmin). 검색어는 서버가 %…%로 */
  searchFundMulti: async (params: { planYn: boolean; fundType: string; searchText: string; closeYn: boolean; classYn: boolean }): Promise<FundMulti[]> => {
    const res = await apiClient.get<ApiResponse<FundMulti[]>>('v1/fnd/funds/multi', { params });
    return res.data.data ?? [];
  },

  /** AS-IS fnd.Fnd08_OrgAuth.updateAuthYn: 펀드 × 조직 모두에 권한 부여(confirm 'true') 또는 삭제('false') → 처리 건수 */
  updateOrgAuths: async (body: { fundCodeIds: number[]; orgCodeIds: number[]; confirm: 'true' | 'false' }): Promise<number> => {
    const res = await apiClient.put<ApiResponse<number>>('v1/fnd/org-auths', body);
    return res.data.data ?? 0;
  },

  // ── P03 상품기획일정 등록 (Fnd20_Tab_Plan) ──

  /** AS-IS fnd.Fnd01_FundCode.selectByPlan: 임시펀드 목록(관리자가 아니면 내 조직이 권한을 가진 것만). 펀드명은 서버가 %…%로, 유형은 '%'가 전체 */
  searchPlanFunds: async (params: { closeYn: boolean; fundName: string; fundTypeCode: string }): Promise<FundPlanList[]> => {
    const res = await apiClient.get<ApiResponse<FundPlanList[]>>('v1/fnd/fund-codes/plan-funds', { params });
    return res.data.data ?? [];
  },

  /** AS-IS fnd.Fnd20_Plan.selectByFundId: 그 펀드의 기획일정 */
  searchPlans: async (fundId: number): Promise<Plan[]> => {
    const res = await apiClient.get<ApiResponse<Plan[]>>('v1/fnd/plans', { params: { fundId } });
    return res.data.data ?? [];
  },

  /** AS-IS fnd.Fnd20_Plan.update: 바뀐 행만. planId가 0 이하면 새 행 — 저장된 행을 요청 순서대로 돌려준다 */
  savePlans: async (rows: Plan[]): Promise<Plan[]> => {
    const body = rows.map(r => ({ planId: r.planId, fundId: r.fundId, classTreeId: r.classTreeId, personId: r.personId ?? null, startDate: r.startDate ?? null, dueDate: r.dueDate ?? null, note: r.note ?? null }));
    const res = await apiClient.put<ApiResponse<Plan[]>>('v1/fnd/plans', body);
    return res.data.data ?? [];
  },

  /** AS-IS fnd.Fnd20_Plan.delete: 상신 문서가 있으면 그 문서도 함께 지운다 */
  deletePlans: async (planIds: number[]): Promise<void> => {
    await apiClient.delete('v1/fnd/plans', { data: planIds.map(planId => ({ planId })) });
  },

  // ── D11 수탁사정보 관리(관리자) (Fnd03_Tab_ConsignmentManager) ──

  /** AS-IS fnd.Fnd03_Consignment.selectByCompanyId0: 공통 회사(0) 전용 — 사용여부 체크면 사용 중인 것만 */
  searchConsignments: async (searchText: string, useYn: boolean): Promise<Consignment[]> => {
    const res = await apiClient.get<ApiResponse<Consignment[]>>('v1/fnd/consignments', { params: { searchText, useYn } });
    return res.data.data ?? [];
  },

  /** AS-IS fnd.Fnd03_Consignment.insertCheck → 저장된 행(요청 순서) */
  saveConsignments: async (rows: Consignment[]): Promise<Consignment[]> => {
    const body = rows.map(({ consignmentId, consignmentCode, consignmentName, useYn, note }) => ({ consignmentId, consignmentCode, consignmentName, useYn, note }));
    const res = await apiClient.put<ApiResponse<Consignment[]>>('v1/fnd/consignments', body);
    return res.data.data ?? [];
  },

  /** AS-IS fnd.Fnd03_Consignment.selectIcamConsignment: ICAM가져오기 — 외부 ICAM DB 연동이 없으면 오류 */
  importIcamConsignments: async (): Promise<void> => {
    await apiClient.post<ApiResponse<null>>('v1/fnd/consignments/import');
  },

  // ── R10 수탁사정보 관리 (Fnd03_Tab_Consignment, #1051) ──

  /** AS-IS fnd.Fnd03_Consignment.selectByCompanyId: 로그인 회사의 수탁사 목록 */
  searchCompanyConsignments: async (searchText: string, useYn: boolean): Promise<Consignment[]> => {
    const res = await apiClient.get<ApiResponse<Consignment[]>>('v1/fnd/consignments/company', { params: { searchText, useYn } });
    return res.data.data ?? [];
  },

  /** AS-IS fnd.Fnd03_Consignment.preUpdate + update → 저장된 행(요청 순서) */
  saveCompanyConsignments: async (rows: Consignment[]): Promise<Consignment[]> => {
    const res = await apiClient.put<ApiResponse<Consignment[]>>('v1/fnd/consignments/company', rows);
    return res.data.data ?? [];
  },

  /** AS-IS fnd.Fnd03_Consignment.delete */
  deleteCompanyConsignments: async (ids: number[]): Promise<number> => {
    await apiClient.delete<ApiResponse<null>>('v1/fnd/consignments/company', { data: ids });
    return ids.length;
  },

  /** AS-IS fnd.Fnd03_Consignment.selectIcamConsignment (회사별 화면) */
  importCompanyIcamConsignments: async (): Promise<void> => {
    await apiClient.post<ApiResponse<null>>('v1/fnd/consignments/company/import');
  },

  // ── D12 사무수탁사정보 관리(관리자) (Fnd06_Tab_OfficeWorkManager) ──

  /** AS-IS fnd.Fnd06_OfficeWork.selectByCompanyId0: 공통 회사(0) 전용 — 사용여부 체크면 사용 중인 것만 */
  searchOfficeWorks: async (searchText: string, useYn: boolean): Promise<OfficeWork[]> => {
    const res = await apiClient.get<ApiResponse<OfficeWork[]>>('v1/fnd/office-works', { params: { searchText, useYn } });
    return res.data.data ?? [];
  },

  /** AS-IS fnd.Fnd06_OfficeWork.update → 저장된 행(요청 순서) */
  saveOfficeWorks: async (rows: OfficeWork[]): Promise<OfficeWork[]> => {
    const body = rows.map(({ officeWorkId, officeWorkName, officeWorkCode, kofiaCode, etcOfficeWorkCode01, useYn, note }) =>
      ({ officeWorkId, officeWorkName, officeWorkCode, kofiaCode, etcOfficeWorkCode01, useYn, note }));
    const res = await apiClient.put<ApiResponse<OfficeWork[]>>('v1/fnd/office-works', body);
    return res.data.data ?? [];
  },

  /** AS-IS fnd.Fnd06_OfficeWork.selectIcamOfficeWork: ICAM가져오기 — 외부 ICAM DB 연동이 없으면 오류 */
  importIcamOfficeWorks: async (): Promise<void> => {
    await apiClient.post<ApiResponse<null>>('v1/fnd/office-works/import');
  },

  // ── R11 사무수탁사정보 관리 (Fnd06_Tab_OfficeWork, #1052) ──

  /** AS-IS fnd.Fnd06_OfficeWork.selectByCompanyId: 로그인 회사의 사무수탁사 목록 */
  searchCompanyOfficeWorks: async (searchText: string, useYn: boolean): Promise<OfficeWork[]> => {
    const res = await apiClient.get<ApiResponse<OfficeWork[]>>('v1/fnd/office-works/company', { params: { searchText, useYn } });
    return res.data.data ?? [];
  },

  /** AS-IS fnd.Fnd06_OfficeWork.preUpdate + update → 저장된 행(요청 순서) */
  saveCompanyOfficeWorks: async (rows: OfficeWork[]): Promise<OfficeWork[]> => {
    const res = await apiClient.put<ApiResponse<OfficeWork[]>>('v1/fnd/office-works/company', rows);
    return res.data.data ?? [];
  },

  /** AS-IS fnd.Fnd06_OfficeWork.delete */
  deleteCompanyOfficeWorks: async (ids: number[]): Promise<number> => {
    await apiClient.delete<ApiResponse<null>>('v1/fnd/office-works/company', { data: ids });
    return ids.length;
  },

  /** AS-IS fnd.Fnd06_OfficeWork.selectIcamOfficeWork (회사별 화면) */
  importCompanyIcamOfficeWorks: async (): Promise<void> => {
    await apiClient.post<ApiResponse<null>>('v1/fnd/office-works/company/import');
  },

  // ── D13 수탁은행정보 관리(관리자) (Fnd09_Tab_TrustBankManager) ──

  /** AS-IS fnd.Fnd09_TrustBank.selectByCompanyId0: 공통 회사(0) 전용 — 사용여부 체크면 사용 중인 것만 */
  searchTrustBanks: async (searchText: string, useYn: boolean): Promise<TrustBank[]> => {
    const res = await apiClient.get<ApiResponse<TrustBank[]>>('v1/fnd/trust-banks', { params: { searchText, useYn } });
    return res.data.data ?? [];
  },

  /** AS-IS fnd.Fnd09_TrustBank.insertCheck — 원본 서버에 없는 서비스라 서버가 거절 */
  saveTrustBanks: async (rows: TrustBank[]): Promise<TrustBank[]> => {
    const body = rows.map(({ trustBankId, trustBankCode, trustBankName, useYn, note }) => ({ trustBankId, trustBankCode, trustBankName, useYn, note }));
    const res = await apiClient.put<ApiResponse<TrustBank[]>>('v1/fnd/trust-banks', body);
    return res.data.data ?? [];
  },

  /** AS-IS fnd.Fnd09_TrustBank.selectIcamTrustBank: ICAM가져오기 — 외부 ICAM DB 연동이 없으면 오류 */
  importIcamTrustBanks: async (): Promise<void> => {
    await apiClient.post<ApiResponse<null>>('v1/fnd/trust-banks/import');
  },

  // ── R12 수탁은행정보 관리 (Fnd09_Tab_TrustBank, #1100) ──

  /** AS-IS fnd.Fnd09_TrustBank.selectByCompanyId: 로그인 회사의 수탁은행 목록 */
  searchCompanyTrustBanks: async (searchText: string, useYn: boolean): Promise<TrustBank[]> => {
    const res = await apiClient.get<ApiResponse<TrustBank[]>>('v1/fnd/trust-banks/company', { params: { searchText, useYn } });
    return res.data.data ?? [];
  },

  /** AS-IS fnd.Fnd09_TrustBank.preUpdate + update → 저장된 행(요청 순서) */
  saveCompanyTrustBanks: async (rows: TrustBank[]): Promise<TrustBank[]> => {
    const res = await apiClient.put<ApiResponse<TrustBank[]>>('v1/fnd/trust-banks/company', rows);
    return res.data.data ?? [];
  },

  /** AS-IS fnd.Fnd09_TrustBank.delete */
  deleteCompanyTrustBanks: async (ids: number[]): Promise<number> => {
    await apiClient.delete<ApiResponse<null>>('v1/fnd/trust-banks/company', { data: ids });
    return ids.length;
  },

  /** AS-IS fnd.Fnd09_TrustBank.selectIcamTrustBank (회사별 화면) */
  importCompanyIcamTrustBanks: async (): Promise<void> => {
    await apiClient.post<ApiResponse<null>>('v1/fnd/trust-banks/company/import');
  },

  // ── P05 펀드 등록 및 변경 (Fnd01_Tab_FundCode) ──

  /** AS-IS fnd.Fnd01_FundCode.selectByFundName: 로그인 회사의 일반 펀드. 펀드명은 서버가 %…%로, 유형·클래스구분은 '%'가 전체 */
  searchFunds: async (params: { closeYn: boolean; fundName: string; fundTypeCode: string; classTypeCode: string }): Promise<FundDetail[]> => {
    const res = await apiClient.get<ApiResponse<FundDetail[]>>('v1/fnd/fund-codes', { params });
    return res.data.data ?? [];
  },

  /** AS-IS fnd.Fnd01_FundCode.update / noteUpdate(ICAM관리 펀드는 서버가 비고만): 저장된 행을 돌려준다(새 행이면 서버가 매긴 id) */
  saveFund: async (row: FundDetail): Promise<FundDetail> => {
    const res = await apiClient.put<ApiResponse<FundDetail>>('v1/fnd/fund-codes', row.fundCodeId > 0 ? row : { ...row, fundCodeId: null });
    return res.data.data as FundDetail;
  },

  /** 템플릿 받기 (AS-IS downloadForm → ./excelTemplete/Template_펀드정보.xlsx) */
  downloadFundTemplate: async (): Promise<void> => {
    try {
      const res = await apiClient.get<Blob>('v1/fnd/fund-codes/template', { responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Template_펀드정보.xlsx';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      throw await readBlobError(err);
    }
  },

  /** 엑셀업로드 (AS-IS ExcelUpload?uploadType=fundUpload) → 등록·갱신한 건수 */
  uploadFundsExcel: async (file: File): Promise<number> => {
    const form = new FormData();
    form.append('excelUpload', file);
    const res = await apiClient.post<ApiResponse<number>>('v1/fnd/fund-codes/excel', form, { headers: { 'Content-Type': 'multipart/form-data' } });
    return res.data.data ?? 0;
  },

  // ── P05 조회창 (Fnd03_Lookup_Consignment · Fnd06_Lookup_OfficeWork · Fnd09_Lookup_TrustBank) ──

  /** AS-IS fnd.Fnd03_Consignment.selectByText: 로그인 회사의 수탁사, 이름 검색(서버가 %…%) */
  lookupConsignments: async (searchText: string): Promise<Consignment[]> => {
    const res = await apiClient.get<ApiResponse<Consignment[]>>('v1/fnd/consignments/lookup', { params: { searchText } });
    return res.data.data ?? [];
  },

  /** AS-IS fnd.Fnd06_OfficeWork.selectByText */
  lookupOfficeWorks: async (searchText: string): Promise<OfficeWork[]> => {
    const res = await apiClient.get<ApiResponse<OfficeWork[]>>('v1/fnd/office-works/lookup', { params: { searchText } });
    return res.data.data ?? [];
  },

  /** AS-IS fnd.Fnd09_TrustBank.selectByText */
  lookupTrustBanks: async (searchText: string): Promise<TrustBank[]> => {
    const res = await apiClient.get<ApiResponse<TrustBank[]>>('v1/fnd/trust-banks/lookup', { params: { searchText } });
    return res.data.data ?? [];
  },

  // ── P11 펀드보유주식등록(타사무) (Fnd11_Tab_BookExtr) ──

  /** AS-IS fnd.Fnd11_BookExtr.selectByStdDate: 로그인 회사의 그 기준일 보유종목, 검색어는 서버가 %…%로 */
  searchBookExtrs: async (params: { stdDate: string; searchText: string }): Promise<BookExtr[]> => {
    const res = await apiClient.get<ApiResponse<BookExtr[]>>('v1/fnd/book-extrs', { params });
    return res.data.data ?? [];
  },

  /** AS-IS fnd.Fnd11_BookExtr.selectRecentStdDate: 그 날 이전 가장 최근 기준일(yyyy-MM-dd), 없으면 null */
  getBookExtrRecentStdDate: async (stdDate: string): Promise<string | null> => {
    const res = await apiClient.get<ApiResponse<string | null>>('v1/fnd/book-extrs/recent-std-date', { params: { stdDate } });
    return res.data.data ?? null;
  },

  /** AS-IS fnd.Fnd11_BookExtr.update: 바뀐 행만. bookExtrId가 0 이하면 새 행 — 저장된 행을 요청 순서대로 돌려준다 */
  saveBookExtrs: async (rows: BookExtr[]): Promise<BookExtr[]> => {
    const body = rows.map(r => ({ bookExtrId: r.bookExtrId > 0 ? r.bookExtrId : null, stdDate: r.stdDate ?? null, fundCode: r.fundCode ?? null, fundName: r.fundName ?? null, itemCode: r.itemCode ?? null, itemName: r.itemName ?? null, itemType: r.itemType ?? null }));
    const res = await apiClient.put<ApiResponse<BookExtr[]>>('v1/fnd/book-extrs', body);
    return res.data.data ?? [];
  },

  /** AS-IS fnd.Fnd11_BookExtr.delete */
  deleteBookExtrs: async (ids: number[]): Promise<void> => {
    await apiClient.delete('v1/fnd/book-extrs', { data: ids });
  },

  /** 템플릿 받기 (AS-IS downloadForm → ./excelTemplete/Template_펀드보유주식등록(타사무).xlsx) */
  downloadBookExtrTemplate: async (): Promise<void> => {
    try {
      const res = await apiClient.get<Blob>('v1/fnd/book-extrs/template', { responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Template_펀드보유주식등록(타사무).xlsx';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      throw await readBlobError(err);
    }
  },

  /** 엑셀업로드 (AS-IS ExcelUpload?uploadType=bookFndExtrUpload) → 등록한 건수 */
  uploadBookExtrsExcel: async (file: File): Promise<number> => {
    const form = new FormData();
    form.append('excelUpload', file);
    const res = await apiClient.post<ApiResponse<number>>('v1/fnd/book-extrs/excel', form, { headers: { 'Content-Type': 'multipart/form-data' } });
    return res.data.data ?? 0;
  },

  // ── P12 펀드규약 등록 (Fnd25_Tab_FundTermsManager) ──

  /** AS-IS fnd.Fnd00_Fund.selectBySearchText(orgId 있음): 내 조직 권한 펀드 — 연관펀드 단일 선택 조회창. 펀드유형은 `%`가 전체 */
  searchFundSingle: async (params: { planYn: boolean; fundType: string; searchText: string; closeYn: boolean; classYn: boolean }): Promise<FundSingle[]> => {
    const res = await apiClient.get<ApiResponse<FundSingle[]>>('v1/fnd/funds/single', { params });
    return res.data.data ?? [];
  },

  /** AS-IS fnd.Fnd26_TermsDetail.selectBySearchText: 규약마다 사용 중인 최신 개정 (termsType `%`=전체) */
  searchTerms: async (params: { termsType: string; searchText: string }): Promise<Terms[]> => {
    const res = await apiClient.get<ApiResponse<Terms[]>>('v1/fnd/terms', { params });
    return res.data.data ?? [];
  },

  /** AS-IS fnd.Fnd26_TermsDetail.selectBySearchTextManager: 그 규약의 개정(개정회차 내림차순) */
  searchTermsRevisions: async (termsId: number, searchText: string): Promise<TermsRevision[]> => {
    const res = await apiClient.get<ApiResponse<TermsRevision[]>>(`v1/fnd/terms/${termsId}/revisions`, { params: { searchText } });
    return res.data.data ?? [];
  },

  /** AS-IS DBUtil.setSeq: 편집 창이 열릴 때 받는 새 개정 ID */
  getTermsNextId: async (): Promise<number> => {
    const res = await apiClient.get<ApiResponse<number>>('v1/fnd/terms/next-id');
    return res.data.data as number;
  },

  /** AS-IS fnd.Fnd26_TermsDetail.update (mode insert/new/copy/edit) */
  saveTermsRevision: async (req: TermsRevisionSaveReq): Promise<void> => {
    await apiClient.put('v1/fnd/terms/revisions', req);
  },

  /** AS-IS fnd.Fnd26_TermsDetail.update (mode fnd25update): 신청구분·조회순서·예탁원코드(펀드). 종료일은 원본 모델에 없어 null — 종료일이 지워진다 */
  updateTerms: async (termsId: number, req: { termsType: string | null; seq: number | null; fundId: number | null; closeDate: string | null; originFundId: number | null }): Promise<void> => {
    await apiClient.put(`v1/fnd/terms/${termsId}`, req);
  },

  /** AS-IS fnd.Fnd26_TermsDetail.delete: 고른 개정 */
  deleteTermsRevisions: async (termsDetailIds: number[]): Promise<void> => {
    await apiClient.delete('v1/fnd/terms/revisions', { data: termsDetailIds });
  },

  /** AS-IS fnd.Fnd26_TermsDetail.deleteAll: 개정 전부와 규약 */
  deleteTerms: async (termsId: number): Promise<void> => {
    await apiClient.delete(`v1/fnd/terms/${termsId}`);
  },

  // ── P13 펀드규약 (Fnd25_Tab_FundTerms) ──

  /** AS-IS fnd.Fnd25_Terms.selectBySearchTextManager: 규약마다 사용 중인 최신 개정 (termsType `%`=전체, 검색은 펀드규약명) */
  searchTermsView: async (params: { termsType: string; searchText: string }): Promise<TermsView[]> => {
    const res = await apiClient.get<ApiResponse<TermsView[]>>('v1/fnd/terms/list', { params });
    return res.data.data ?? [];
  },

  // ── Q05 공모주 수요예측 (Fnd30_Tab_DemandOpr) ──

  /** AS-IS fnd.Fnd30_Opr.selectByDemandDate: 로그인 회사의 신청일 기간 수요예측(oprCode "02"), 검색어(종목/주간사)는 서버가 %…%로 */
  searchDemandOprs: async (params: { startDate: string; closeDate: string; searchText: string }): Promise<OprDemand[]> => {
    const res = await apiClient.get<ApiResponse<OprDemand[]>>('v1/fnd/oprs/demand', { params: { ...params, oprCode: '02' } });
    return res.data.data ?? [];
  },

  /** AS-IS fnd.Fnd30_Opr.selectById: 상태 검사·펀드별 등록창의 신청가격 */
  getOpr: async (oprId: number): Promise<OprDemand> => {
    const res = await apiClient.get<ApiResponse<OprDemand>>(`v1/fnd/oprs/${oprId}`);
    return res.data.data as OprDemand;
  },

  /** AS-IS fnd.Fnd30_Opr.modelUpdate·multiUpdate(신규): insertCount가 1보다 크면 같은 내용을 건수만큼 */
  createDemandOpr: async (req: OprDemandSave): Promise<number[]> => {
    const res = await apiClient.post<ApiResponse<number[]>>('v1/fnd/oprs', req);
    return res.data.data ?? [];
  },

  /** AS-IS fnd.Fnd30_Opr.modelUpdate(수정) */
  updateDemandOpr: async (oprId: number, req: OprDemandSave): Promise<OprDemand> => {
    const res = await apiClient.put<ApiResponse<OprDemand>>(`v1/fnd/oprs/${oprId}`, req);
    return res.data.data as OprDemand;
  },

  /** AS-IS fnd.Fnd30_Opr.deleteApprId → deleteOprFund → delete (서버가 한 번에) */
  deleteOpr: async (oprId: number): Promise<void> => {
    await apiClient.delete(`v1/fnd/oprs/${oprId}`);
  },

  /** AS-IS fnd.Fnd31_OprFund.selectByOprId */
  searchOprFunds: async (oprId: number): Promise<OprFund[]> => {
    const res = await apiClient.get<ApiResponse<OprFund[]>>('v1/fnd/opr-funds', { params: { oprId } });
    return res.data.data ?? [];
  },

  /** AS-IS fnd.Fnd31_OprFund.modelUpdate: oprFundId가 없으면 새 행 */
  saveOprFund: async (req: OprFundSave): Promise<OprFund> => {
    const res = await apiClient.put<ApiResponse<OprFund>>('v1/fnd/opr-funds', req);
    return res.data.data as OprFund;
  },

  /** AS-IS fnd.Fnd31_OprFund.delete */
  deleteOprFunds: async (oprId: number, ids: number[]): Promise<void> => {
    await apiClient.delete('v1/fnd/opr-funds', { params: { oprId }, data: ids });
  },

  /** 템플릿 받기 (AS-IS downloadForm → ./excelTemplete/Template_공모주 수요예측 신청.xlsx) */
  downloadOprFundTemplate: async (subscription = false): Promise<void> => {
    try {
      const res = await apiClient.get<Blob>('v1/fnd/opr-funds/template', { params: { subscription }, responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = subscription ? 'Template_공모주청약 펀드배분.xlsx' : 'Template_공모주 수요예측 신청.xlsx';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      throw await readBlobError(err);
    }
  },

  /** 엑셀업로드 (AS-IS ExcelUpload?uploadType=demandOprFundUpload&oprId) → 등록한 건수 */
  uploadOprFundsExcel: async (oprId: number, file: File): Promise<number> => {
    const form = new FormData();
    form.append('excelUpload', file);
    const res = await apiClient.post<ApiResponse<number>>('v1/fnd/opr-funds/excel', form, { params: { oprId }, headers: { 'Content-Type': 'multipart/form-data' } });
    return res.data.data ?? 0;
  },

  // ── Q06 공모주청약 운용지시 (Fnd30_Tab_Opr) ──

  /** AS-IS fnd.Fnd30_Opr.selectByDate: 로그인 회사의 청약일 기간 공모주청약(oprCode "01"), 검색어(종목/주간사)는 서버가 %…%로 */
  searchSubscriptionOprs: async (params: { startDate: string; closeDate: string; searchText: string }): Promise<OprSub[]> => {
    const res = await apiClient.get<ApiResponse<OprSub[]>>('v1/fnd/oprs/subscription', { params });
    return res.data.data ?? [];
  },

  /** AS-IS fnd.Fnd30_Opr.selectById (공모주청약): 펀드별 배정 창의 발행가·수수료율·총배정수량 */
  getSubscriptionOpr: async (oprId: number): Promise<OprSub> => {
    const res = await apiClient.get<ApiResponse<OprSub>>(`v1/fnd/oprs/${oprId}/subscription`);
    return res.data.data as OprSub;
  },

  /** AS-IS fnd.Fnd30_Opr.selectByDemandOprCode: 청약을 만들 수 있는 수요예측(신청기간·종목명) */
  searchDemandOffers: async (params: { startDate: string; closeDate: string; searchText: string }): Promise<OprDemandOffer[]> => {
    const res = await apiClient.get<ApiResponse<OprDemandOffer[]>>('v1/fnd/oprs/demand-offers', { params });
    return res.data.data ?? [];
  },

  /** AS-IS fnd.Fnd30_Opr.modelUpdate·multiUpdate(신규): insertCount가 1보다 크면 건수만큼, demandId가 있으면 수요예측 비율로 펀드별 배정도 같이 */
  createSubscriptionOpr: async (req: OprSubSave): Promise<number[]> => {
    const res = await apiClient.post<ApiResponse<number[]>>('v1/fnd/oprs/subscription', req);
    return res.data.data ?? [];
  },

  /** AS-IS fnd.Fnd30_Opr.modelUpdate(수정) */
  updateSubscriptionOpr: async (oprId: number, req: OprSubSave): Promise<OprSub> => {
    const res = await apiClient.put<ApiResponse<OprSub>>(`v1/fnd/oprs/${oprId}/subscription`, req);
    return res.data.data as OprSub;
  },

  // ── Q07 공모주 참여계좌 관리 (Fnd32_Tab_Account) ──

  /** AS-IS fnd.Fnd32_Account.selectByText: 검색어(증권사/운용대상/구분/계좌번호/은행연계계좌/비고)는 서버가 %…%로, 계좌상태는 코드 또는 '%'(전체) */
  searchIpoAccounts: async (params: { searchText: string; accountStateCode: string }): Promise<IpoAccount[]> => {
    const res = await apiClient.get<ApiResponse<IpoAccount[]>>('v1/fnd/accounts', { params });
    return res.data.data ?? [];
  },

  /** AS-IS fnd.Fnd32_Account.updateList: 임시 행(ID ≤ 0)은 새 행 → 저장된 행(요청 순서) */
  saveIpoAccounts: async (rows: IpoAccount[]): Promise<IpoAccount[]> => {
    const res = await apiClient.put<ApiResponse<IpoAccount[]>>('v1/fnd/accounts', rows);
    return res.data.data ?? [];
  },

  /** AS-IS fnd.Fnd32_Account.copyUpdate: [등록(복사)]가 만든 새 행을 곧바로 저장 → 저장된 행 */
  copyIpoAccount: async (row: Partial<IpoAccount>): Promise<IpoAccount> => {
    const res = await apiClient.post<ApiResponse<IpoAccount>>('v1/fnd/accounts/copy', row);
    return res.data.data as IpoAccount;
  },

  /** AS-IS fnd.Fnd32_Account.delete */
  deleteIpoAccounts: async (ids: number[]): Promise<void> => {
    await apiClient.delete('v1/fnd/accounts', { data: ids });
  },

  /** 템플릿 받기 (AS-IS downloadForm → ./excelTemplete/Template_공모주참여계좌.xlsx) */
  downloadIpoAccountTemplate: async (): Promise<void> => {
    try {
      const res = await apiClient.get<Blob>('v1/fnd/accounts/template', { responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Template_공모주참여계좌.xlsx';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      throw await readBlobError(err);
    }
  },

  /** 엑셀업로드 (AS-IS ExcelUpload?uploadType=accountUpload) → 등록한 건수 */
  uploadIpoAccountsExcel: async (file: File): Promise<number> => {
    const form = new FormData();
    form.append('excelUpload', file);
    const res = await apiClient.post<ApiResponse<number>>('v1/fnd/accounts/excel', form, { headers: { 'Content-Type': 'multipart/form-data' } });
    return res.data.data ?? 0;
  },
};
