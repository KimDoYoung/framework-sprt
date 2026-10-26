import { apiClient } from './client';
import { ApiResponse } from '../types/auth';
import { Consignment, FundCode, FundLookup, FundPlan, FundPlanAuth, FundPlanList, OfficeWork, Plan, TrustBank } from '../types/fnd';

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
};
