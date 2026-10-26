import { apiClient } from './client';
import { ApiResponse } from '../types/auth';
import { readBlobError } from './file';
import { Consignment, FundCode, FundDetail, FundLookup, FundMulti, FundPlan, FundSearch, FundTermsDetail, FundPlanAuth, FundPlanList, OfficeWork, Plan, TrustBank } from '../types/fnd';

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
};
