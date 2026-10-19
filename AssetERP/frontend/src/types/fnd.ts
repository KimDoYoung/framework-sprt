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
