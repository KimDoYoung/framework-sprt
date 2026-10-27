/** 수탁사 한 행 (AS-IS Fnd03_ConsignmentModel — Fnd03_Tab_ConsignmentManager #1102 / Fnd03_Tab_Consignment #1051). useYn은 DB 형태('true'/'false') 그대로 */
export interface Consignment {
  consignmentId: number;
  consignmentCode?: string | null;
  consignmentName?: string | null;
  useYn?: string | null;
  note?: string | null;
  companyId?: number | null;
  etcConsignmentCode01?: string | null;
  etcConsignmentCode02?: string | null;
  etcConsignmentCode03?: string | null;
  etcConsignmentCode04?: string | null;
  etcConsignmentCode05?: string | null;
  etcConsignmentCode06?: string | null;
  etcConsignmentCode07?: string | null;
  etcConsignmentCode08?: string | null;
  etcConsignmentCode09?: string | null;
  etcConsignmentCode10?: string | null;
}

/** 사무수탁사 한 행 (AS-IS Fnd06_OfficeWorkModel — Fnd06_Tab_OfficeWorkManager #1094 / Fnd06_Tab_OfficeWork #1052). useYn·officeWorkUseYn은 DB 형태('true'/'false') 그대로 */
export interface OfficeWork {
  officeWorkId: number;
  officeWorkName?: string | null;
  officeWorkCode?: string | null;
  kofiaCode?: string | null;
  etcOfficeWorkCode01?: string | null;
  useYn?: string | null;
  note?: string | null;
  officeWorkUseYn?: string | null;
  officeWorkNote?: string | null;
  companyId?: number | null;
}

/** 수탁은행 한 행 (AS-IS Fnd09_TrustBankModel — Fnd09_Tab_TrustBankManager #1103 / Fnd09_Tab_TrustBank #1100). useYn은 DB 형태('true'/'false') 그대로 */
export interface TrustBank {
  trustBankId: number;
  trustBankCode?: string | null;
  trustBankName?: string | null;
  useYn?: string | null;
  note?: string | null;
  companyId?: number | null;
  etcTrustBankCode01?: string | null;
  etcTrustBankCode02?: string | null;
  etcTrustBankCode03?: string | null;
  etcTrustBankCode04?: string | null;
  etcTrustBankCode05?: string | null;
  etcTrustBankCode06?: string | null;
  etcTrustBankCode07?: string | null;
  etcTrustBankCode08?: string | null;
  etcTrustBankCode09?: string | null;
  etcTrustBankCode10?: string | null;
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

/** 펀드보유주식(타사무) 한 행 (P11, AS-IS Fnd11_BookExtrModel). bookExtrId가 0 이하면 새 행 */
export interface BookExtr {
  bookExtrId: number;
  stdDate?: string | null;
  fundCode?: string | null;
  fundName?: string | null;
  itemCode?: string | null;
  itemName?: string | null;
  itemType?: string | null;
  itemTypeName?: string | null;
}

/** 연관펀드 단일 선택 조회창 한 행 (P12, AS-IS Fnd00_FundModel 중 Fnd01_Lookup_SelectSingle 그리드 열) */
export interface FundSingle {
  fundId: number;
  fundCode?: string | null;
  ksdFundCode?: string | null;
  fundName?: string | null;
  kofiaFundTypeName?: string | null;
  kofiaClassTypeName?: string | null;
  kofiaTrustName?: string | null;
  startDate?: string | null;
  empName1?: string | null;
  note?: string | null;
}

/** 펀드규약 한 행 (P12 왼쪽 목록, AS-IS Fnd26_TermsDetailModel — 규약마다 사용 중인 최신 개정) */
export interface Terms {
  termsId: number;
  termsType?: string | null;
  termsTypeName?: string | null;
  termsName?: string | null;
  seq?: number | null;
  fundId?: number | null;
  ksdFundCode?: string | null;
  fundName?: string | null;
  trustBankName?: string | null;
  fundStartDate?: string | null;
  revisionDate?: string | null;
  revisionNo?: number | null;
}

/** 펀드규약 개정 한 행 (P12 오른쪽 목록·편집 창, AS-IS Fnd26_TermsDetailModel) */
export interface TermsRevision {
  termsDetailId: number;
  termsId?: number | null;
  termsName?: string | null;
  termsType?: string | null;
  termsTypeName?: string | null;
  seq?: number | null;
  fundId?: number | null;
  ksdFundCode?: string | null;
  revisionDate?: string | null;
  revisionNo?: number | null;
  fileCnt?: number | null;
  useYn?: boolean | null;
  closeDate?: string | null;
  content?: string | null;
  note?: string | null;
  updName?: string | null;
  updDateStr?: string | null;
}

/** 개정 저장 요청 (P12, AS-IS Fnd26_TermsDetail.update). mode: insert / new / copy / edit */
export interface TermsRevisionSaveReq {
  mode: 'insert' | 'new' | 'copy' | 'edit';
  originRevisionNo?: number | null;
  originFundId?: number | null;
  termsDetailId: number;
  termsId?: number | null;
  termsType?: string | null;
  termsName?: string | null;
  seq?: number | null;
  fundId?: number | null;
  closeDate?: string | null;
  content?: string | null;
  note?: string | null;
  revisionDate?: string | null;
  revisionNo?: number | null;
  useYn: boolean;
}

/** 펀드규약 조회 한 행 (P13, AS-IS Fnd25_TermsModel 중 selectBySearchTextManager 그리드 열) */
export interface TermsView {
  termsId: number;
  termsTypeName?: string | null;
  termsName?: string | null;
  ksdFundCode?: string | null;
  fundName?: string | null;
  trustBankName?: string | null;
  fundStartDate?: string | null;
  kofiaFundTypeName?: string | null;
  revisionDate?: string | null;
  revisionNo?: number | null;
  endExpectDate?: string | null;
}

/** 수요예측 한 건 (Q05, AS-IS Fnd30_OprModel — fnd30_opr.selectByDemandDate·selectById). 결재문서가 없으면 apprId·apprStatusCode는 null */
export interface OprDemand {
  oprId: number;
  oprCode?: string | null;
  demandDate?: string | null;
  itemName?: string | null;
  market?: string | null;
  leadManager?: string | null;
  demandPeriod?: string | null;
  priceBracket?: string | null;
  price?: number | null;
  priceAcceptYn?: boolean | null;
  priceAcceptStr?: string | null;
  lockPeriod?: string | null;
  apprId?: number | null;
  apprStatusCode?: string | null;
  apprStatusName?: string | null;
  cancelYn?: boolean | null;
  cancelName?: string | null;
  note?: string | null;
}

/** 수요예측 등록·수정 (AS-IS Fnd30_Edit_DemandOpr). insertCount는 신규일 때만(1보다 크면 건수만큼), cancelYn은 수정 창에만 있다 */
export interface OprDemandSave {
  demandDate: string | null;
  itemName: string | null;
  leadManager: string | null;
  demandPeriod: string | null;
  market: string | null;
  priceBracket: string | null;
  price: number | null;
  priceAcceptYn: boolean;
  lockPeriod: string | null;
  note: string | null;
  cancelYn: boolean;
  insertCount?: number;
  /** 공모주 일정조회가 넘기는 납입일자(신규만, 창에는 없다) */
  payDate?: string | null;
}

/** 수요예측 펀드별 신청 한 행 (Q05, AS-IS Fnd31_OprFundModel). fundAdviceType 1:운용펀드 / 2:일임(자문) */
export interface OprFund {
  oprFundId: number;
  oprId: number;
  fundId: number;
  fundAdviceType?: string | null;
  fundCode?: string | null;
  fundName?: string | null;
  price?: number | null;
  qty?: number | null;
  /** 공모주청약 배정금액 · 수수료 (수요예측은 없다) */
  contAmt?: number | null;
  fee?: number | null;
  settleAmt?: number | null;
}

/** 펀드별 수요예측 신청 한 건 저장. oprFundId가 없으면 새 행 */
export interface OprFundSave {
  oprFundId: number | null;
  oprId: number;
  fundId: number;
  fundAdviceType: string | null;
  price: number | null;
  qty: number | null;
  /** 공모주청약 배정 창만 보낸다 */
  contAmt?: number | null;
  fee?: number | null;
  settleAmt: number | null;
}

/** 공모주청약 한 건 (Q06, AS-IS Fnd30_OprModel — fnd30_opr.selectByDate·selectById). 결재문서가 없으면 apprId·apprStatusCode는 null */
export interface OprSub {
  oprId: number;
  oprCode?: string | null;
  subscriptionDate?: string | null;
  itemName?: string | null;
  corpId?: number | null;
  corpName?: string | null;
  price?: number | null;
  feeRate?: number | null;
  payDate?: string | null;
  qty?: number | null;
  lockPeriod?: string | null;
  apprId?: number | null;
  apprStatusCode?: string | null;
  apprStatusName?: string | null;
  note?: string | null;
  demandId?: number | null;
}

/** 공모주청약 등록·수정 (AS-IS Fnd30_Edit_Opr). insertCount는 신규일 때만, demandId는 수요예측 신청내역에서 등록할 때만 */
export interface OprSubSave {
  subscriptionDate: string | null;
  payDate: string | null;
  itemName: string | null;
  corpId: number | null;
  price: number | null;
  feeRate: number | null;
  qty: number | null;
  lockPeriod: string | null;
  note: string | null;
  insertCount?: number;
  demandId?: number | null;
}

/** 청약을 만들 수 있는 수요예측 한 건 (Q06, AS-IS Fnd30_Lookup_DemandOprList) */
export interface OprDemandOffer {
  oprId: number;
  demandDate?: string | null;
  itemName?: string | null;
  market?: string | null;
  leadManager?: string | null;
  price?: number | null;
  lockPeriod?: string | null;
  apprStatusCode?: string | null;
  schPayDate?: string | null;
  note?: string | null;
}

/** 공모주 참여계좌 한 행 (Q07, AS-IS Fnd32_AccountModel — fnd32_account.selectByText). decAccountNo·decBankLinkNo는 복호화한 값 */
export interface IpoAccount {
  accountId: number;
  setupDate?: string | null;
  corpId?: number | null;
  corpName?: string | null;
  branch?: string | null;
  accountCode1?: string | null;
  accountName1?: string | null;
  accountCode2?: string | null;
  accountName2?: string | null;
  accountName?: string | null;
  decAccountNo?: string | null;
  bankCorpId?: number | null;
  bankCorpName?: string | null;
  decBankLinkNo?: string | null;
  accountStateCode?: string | null;
  accountStateName?: string | null;
  ipoOutCode?: string | null;
  ipoOutName?: string | null;
  managerTel?: string | null;
  note?: string | null;
}
