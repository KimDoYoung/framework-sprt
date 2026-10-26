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

/** 펀드 권한설정 목록 한 행 (P02 Fnd08_Tab_OrgAuthTempFund·P06 Fnd08_Tab_OrgAuth, AS-IS Fnd01_FundCodeModel 중 그리드 열) */
export interface FundPlanAuth {
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
}

/** 펀드 조회 한 행 (P07, 펀드 등록 및 변경 행 + 최종 규약: AS-IS Fnd01_FundCodeModel의 termsId·revisionNo·revisionDate) */
export interface FundSearch extends FundDetail {
  termsId?: number | null;
  revisionNo?: number | null;
  revisionDate?: string | null;
}

/** 규약 내용 조회창 한 행 (P07, AS-IS Fnd26_TermsDetailModel 중 그리드 열과 본문) */
export interface FundTermsDetail {
  termsDetailId: number;
  revisionDate?: string | null;
  revisionNo?: number | null;
  fileCnt?: number | null;
  content?: string | null;
}

/** 연관펀드 조회창 한 행 (P06, AS-IS Fnd00_FundModel 중 Fnd01_Lookup_SelectMulti 그리드 열) */
export interface FundMulti {
  fundId: number;
  fundCode?: string | null;
  fundName?: string | null;
  kofiaFundTypeName?: string | null;
  kofiaClassTypeName?: string | null;
  consignmentName?: string | null;
  startDate?: string | null;
  empName1?: string | null;
  note?: string | null;
}

/** 상품기획일정 등록 위 그리드 한 행 (P03, AS-IS Fnd01_FundCodeModel 중 Fnd20_Tab_Plan 그리드 열, selectByPlan) */
export interface FundPlanList {
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
}

/** 기획일정 한 행 (P03, AS-IS Fnd20_PlanModel). planId는 새 행이면 임시 음수. closeYn은 상신 문서 상태 이름 */
export interface Plan {
  planId: number;
  fundId: number;
  classTreeId: number;
  classTreeFullName?: string | null;
  approvalTypeName?: string | null;
  personId?: number | null;
  personName?: string | null;
  orgName?: string | null;
  startDate?: string | null;
  dueDate?: string | null;
  closeYn?: string | null;
  note?: string | null;
  managerId?: number | null;
  apprId?: number | null;
}

/**
 * 펀드 등록 및 변경 한 행 (P05, AS-IS Fnd01_FundCodeModel + Fnd02_FundInfoModel 중 그리드·편집 폼 열). 날짜는 'yyyy-MM-dd'.
 * fundCodeId는 새 행이면 임시 음수. icamYn은 DB 형태('true'면 ICAM관리 펀드 — 비고만 저장)
 */
export interface FundDetail {
  fundCodeId: number;
  fundInfoId?: number | null;
  fundCode?: string | null;
  kofiaFundCode?: string | null;
  ksdFundCode?: string | null;
  ksdItemCode?: string | null;
  fundFullName?: string | null;
  fundName?: string | null;
  cur?: string | null;
  seoljAek?: number | null;
  sunjasanAek?: number | null;
  startDate?: string | null;
  nextCloseDate?: string | null;
  nextFeeDate?: string | null;
  endExpectDate?: string | null;
  endDate?: string | null;
  closeYn?: string | null;
  closeName?: string | null;
  orgCodeName?: string | null;
  operator1?: string | null;
  operator2?: string | null;
  consignmentCode?: string | null;
  consignmentName?: string | null;
  officeWorkCode?: string | null;
  officeWorkName?: string | null;
  trustBankCode?: string | null;
  trustBankName?: string | null;
  kofiaTrustCode?: string | null;
  kofiaTrustName?: string | null;
  kofiaFundTypeCode?: string | null;
  kofiaFundTypeName?: string | null;
  kofiaPublicCode?: string | null;
  kofiaPublicName?: string | null;
  kofiaParentCode?: string | null;
  kofiaParentName?: string | null;
  kofiaClassTypeCode?: string | null;
  kofiaClassTypeName?: string | null;
  kofiaFundUnitCode?: string | null;
  kofiaFundUnitName?: string | null;
  kofiaCharClassCode?: string | null;
  kofiaCharClassName?: string | null;
  managementRate?: number | null;
  salesRate?: number | null;
  consignmentRate?: number | null;
  officeWorkRate?: number | null;
  note?: string | null;
  icamYn?: string | null;
  workDate?: string | null;
  companyId?: number | null;
}

/** 펀드 조회(변경이력) 왼쪽 목록 한 행 (P08, AS-IS Fnd01_FundCodeModel — 오늘 기준 펀드별 최신 펀드정보) */
export interface FundHistory {
  fundCodeId: number;
  fundCode: string;
  fundName?: string | null;
  workDate?: string | null;
  startDate?: string | null;
  endDate?: string | null;
}

/** 펀드 변경이력 한 행 (P08, AS-IS Fnd02_FundInfoModel 중 Fnd01_Grid_FundIcamHistory 열) */
export interface FundInfo {
  fundInfoId: number;
  workDate?: string | null;
  fundName?: string | null;
  fundFullName?: string | null;
  kofiaFundCode?: string | null;
  ksdFundCode?: string | null;
  ksdItemCode?: string | null;
  kofiaTrustName?: string | null;
  kofiaFundTypeName?: string | null;
  kofiaPublicName?: string | null;
  kofiaParentName?: string | null;
  kofiaClassTypeName?: string | null;
  kofiaFundUnitName?: string | null;
  kofiaCharClassName?: string | null;
  orgCodeName?: string | null;
  operator1?: string | null;
  operator2?: string | null;
  cur?: string | null;
  seoljAek?: number | null;
  sunjasanAek?: number | null;
  stdPrice?: number | null;
  nextCloseDate?: string | null;
  nextFeeDate?: string | null;
  endExpectDate?: string | null;
  consignmentName?: string | null;
  trustBankName?: string | null;
  officeWorkName?: string | null;
  managementRate?: number | null;
  salesRate?: number | null;
  consignmentRate?: number | null;
  officeWorkRate?: number | null;
}

/** 펀드별 자산 조회 왼쪽 펀드 목록 한 행 (P09, AS-IS Fnd01_FundCodeModel 중 펀드코드·펀드명) */
export interface FundRelate {
  fundCodeId: number;
  fundCode: string;
  fundName?: string | null;
}

/** 펀드별 자산 한 행 (P09, AS-IS Fnd10_BookModel — "종목명" 열은 note(비고)를 쓴다) */
export interface BookRelateAst {
  bookId: number;
  itemCode?: string | null;
  note?: string | null;
  evalAmt?: number | null;
}

/** 자산별 펀드 조회 왼쪽 자산(종목) 목록 한 행 (P10, AS-IS Ast01_ClassTreeModel 중 종목코드·종목명 전체경로) */
export interface AstAssetItem {
  classTreeId: number;
  isin?: string | null;
  classTreeFullName?: string | null;
}

/** 자산별 펀드 한 행 (P10, AS-IS Fnd10_BookModel 중 펀드코드·펀드명) */
export interface BookRelateFnd {
  bookId: number;
  fundCode?: string | null;
  fundName?: string | null;
}
