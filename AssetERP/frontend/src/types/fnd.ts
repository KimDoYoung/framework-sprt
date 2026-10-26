/** 수탁사 한 행 (AS-IS Fnd03_ConsignmentModel 중 Fnd03_Tab_ConsignmentManager 그리드 열). useYn은 DB 형태('true'/'false') 그대로 */
export interface Consignment {
  consignmentId: number;
  consignmentCode?: string | null;
  consignmentName?: string | null;
  useYn?: string | null;
  note?: string | null;
  companyId?: number | null;
}

/** 사무수탁사 한 행 (AS-IS Fnd06_OfficeWorkModel 중 Fnd06_Tab_OfficeWorkManager 그리드 열). useYn은 DB 형태('true'/'false') 그대로 */
export interface OfficeWork {
  officeWorkId: number;
  officeWorkName?: string | null;
  officeWorkCode?: string | null;
  kofiaCode?: string | null;
  etcOfficeWorkCode01?: string | null;
  useYn?: string | null;
  note?: string | null;
  companyId?: number | null;
}

/** 수탁은행 한 행 (AS-IS Fnd09_TrustBankModel 중 Fnd09_Tab_TrustBankManager 그리드 열). useYn은 DB 형태('true'/'false') 그대로 */
export interface TrustBank {
  trustBankId: number;
  trustBankCode?: string | null;
  trustBankName?: string | null;
  useYn?: string | null;
  note?: string | null;
  companyId?: number | null;
}

/** 펀드별 문서검색 펀드 목록 한 행 (AS-IS Fnd01_FundCodeModel 중 Apr01_Tab_FundDocument가 쓰는 열) */
export interface FundCode {
  fundCodeId: number;
  fundCode?: string | null;
  fundName?: string | null;
  kofiaFundTypeName?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  closeName?: string | null;
  kofiaTrustName?: string | null;
  kofiaPublicName?: string | null;
  orgCodeName?: string | null;
  operator1?: string | null;
  operator2?: string | null;
  note?: string | null;
  apprCount?: number | null;
}

/** 신규기획펀드 한 행 (P01, AS-IS Fnd01_FundCodeModel 임시펀드). fundCodeId가 0 이하면 아직 저장하지 않은 새 행 */
export interface FundPlan {
  fundCodeId: number;
  fundInfoId?: number | null;
  fundCode?: string | null;
  fundName?: string | null;
  kofiaFundTypeCode?: string | null;
  kofiaFundTypeName?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  closeYn?: string | null;
  closeName?: string | null;
  kofiaTrustCode?: string | null;
  kofiaTrustName?: string | null;
  kofiaPublicCode?: string | null;
  kofiaPublicName?: string | null;
  orgCodeName?: string | null;
  operator1?: string | null;
  operator2?: string | null;
  realFundId?: number | null;
  realFundCode?: string | null;
  realFundName?: string | null;
  workDate?: string | null;
  planInvestorDscr?: string | null;
  planNote?: string | null;
  note?: string | null;
  icamYn?: string | null;
  companyId?: number | null;
}

/** 펀드찾기(Fnd00_Lookup_FundCode) 한 행 (AS-IS Fnd00_FundModel 중 그리드 열) */
export interface FundLookup {
  fundId: number;
  fundCode?: string | null;
  fundName?: string | null;
  fundTypeName?: string | null;
  orgCodeName?: string | null;
  startDate?: string | null;
  closeName?: string | null;
  note?: string | null;
}

/** 신규기획펀드 권한설정 목록 한 행 (P02, AS-IS Fnd01_FundCodeModel 중 Fnd08_Tab_OrgAuthTempFund 그리드 열) */
export interface FundPlanAuth {
  fundCodeId: number;
  fundCode?: string | null;
  fundName?: string | null;
  kofiaFundTypeName?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  closeName?: string | null;
  orgCodeName?: string | null;
  operator1?: string | null;
  note?: string | null;
}
