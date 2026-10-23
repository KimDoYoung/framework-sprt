/** biz(이익제공·수령) 타입 (L01~) */

/** L01 Biz90_Tab_Limit 그리드 한 행 (AS-IS Biz90_LimitModel). 날짜는 'yyyy-MM-dd' */
export interface BizLimit {
  limitId: number;
  companyId: number | null;
  startDate: string | null;
  provideRcvType: string | null;
  provideRcvTypeName: string | null;
  saleRuleLimit1: number | null;
  saleRuleLimit2: number | null;
  companyLimit1: number | null;
  companyLimit2: number | null;
  companyLimit3: number | null;
}

/** L01 Biz04_Lookup_EmpSetup 오른쪽 그리드 한 행 (AS-IS Biz04_ProvideSetupModel). empSetYn은 'true'/'false' 문자열 */
export interface BizProvideSetup {
  provideSetupId: number;
  companyId: number;
  provideContentCode: string;
  provideContentName: string;
  empSetYn: string;
}

/** L02 Biz01_Tab_Card 그리드 한 행 (AS-IS Biz01_PromoModel). 날짜는 'yyyy-MM-dd…' */
export interface BizPromoCard {
  promoId: number;
  closeYn: boolean | null;
  /** 마감이면 '마감' */
  closeName: string | null;
  htmlCardName: string | null;
  approvalDt: string | null;
  franchiseName: string | null;
  sectorName: string | null;
  approvalAmount: number | null;
  providePurCode: string | null;
  providePurName: string | null;
  provideContentCode: string | null;
  provideContentName: string | null;
  accountCodeId: number | null;
  accountName: string | null;
  totalPeple: number | null;
  averagePrice: number | null;
  note: string | null;
}

/** L04 Biz01_Tab_CardContents 그리드 한 행 — 편집 칸(Biz01_Edit_Card)에 그대로 넘기므로 BizPromoCard에 관리자만 더한다 */
export interface BizCardContents extends BizPromoCard {
  regEmpName: string | null;
}

/** L04 [출력/다운로드]·[엑셀다운로드] 자료 만들기. managerId·providePurCode '%'는 전체 */
export interface BizCardContentsPrintReq {
  dataYm: string;
  managerId: string;
  providePurCode: string;
  searchText: string;
}

/** L08 Biz01_Tab_PriorApproval 그리드 한 행 (AS-IS Biz01_PromoModel). rowId = SQL의 row_number() */
export interface BizProvideList {
  rowId: number;
  provideDate: string | null;
  orgName: string | null;
  regEmpName: string | null;
  providePurName: string | null;
  provideContentName: string | null;
  targetName: string | null;
  targetCompanyName: string | null;
  targetEmpName: string | null;
  targetOrgName: string | null;
  averagePrice: number | null;
  note: string | null;
}

/** L08 조회·[출력/다운로드] 조건. provideRcvType '1' 이익제공 / '2' 이익수령, crmName '%'는 전체, empId는 없으면 조건 없음 */
export interface BizProvideListCond {
  startDate: string;
  endDate: string;
  provideRcvType: string;
  crmName: string;
  empId: number | null;
}

/** L02 Biz01_Edit_Card [저장] (AS-IS Biz01_Promo.modelUpdate) */
export interface BizPromoUpdateReq {
  providePurCode: string | null;
  provideContentCode: string | null;
  accountCodeId: number | null;
  note: string | null;
}

/** L02 Biz01_Lookup_CardManagement [저장] (AS-IS Biz01_Promo.updateAccount) */
export interface BizPromoAccountReq {
  promoIds: number[];
  providePurCode: string | null;
  provideContentCode: string | null;
  accountId: number | null;
  taxType: string | null;
  note: string | null;
  /** true면 과세구분까지(법인카드 화면은 false) */
  withTax: boolean;
}

/** L03 Biz01_Tab_Other 그리드 한 행 (AS-IS Biz01_PromoModel). 날짜는 'yyyy-MM-dd'. 아직 저장 전인 새 행은 promoId가 음수(임시) */
export interface BizPromoOther {
  promoId: number;
  provideRcvType: string | null;
  provideRcvTypeName: string | null;
  provideDate: string | null;
  providePurCode: string | null;
  providePurName: string | null;
  provideContentCode: string | null;
  provideContentName: string | null;
  provideAmt: number | null;
  totalPeple: number | null;
  averagePrice: number | null;
  note: string | null;
}

/** L03 Biz01_Edit_Other [저장] (AS-IS Biz01_Promo.modelUpdate) */
export interface BizPromoOtherReq {
  provideRcvType: string | null;
  provideDate: string | null;
  providePurCode: string | null;
  provideContentCode: string | null;
  provideAmt: number | null;
  note: string | null;
}

/**
 * L05 Biz01_TabPage_List 그리드 한 행 (AS-IS Biz01_PromoModel). 날짜는 'yyyy-MM-dd'. 새 행은 promoId가 음수(임시)이고
 * 구매내역에서 넘겨받은 값(buyId·품목·금액·담당자)을 함께 가진다 — 서버에서 읽은 행에는 provideAmt·personId가 없다
 */
export interface BizBuyPromo {
  promoId: number;
  buyId: number | null;
  provideDate: string | null;
  provideContentCode: string | null;
  provideContentName: string | null;
  providePurCode: string | null;
  providePurName: string | null;
  targetCompanyName: string | null;
  targetEmpName: string | null;
  note: string | null;
  provideAmt?: number | null;
  personId?: number | null;
}

/** 코드 콤보 한 항목 (AS-IS sys09_code 코드·이름) */
export interface BizCodeOption {
  code: string;
  name: string;
}

/** 제공내역에 연결된 계정과목 (AS-IS sys.Sys00_Common.selectByProvideContentCode) */
export interface BizAccountOption {
  accountCodeId: number;
  accountCode: string;
  accountName: string;
}

/** 링크코드에 지정된 문서분류 (AS-IS dcr.Dcr30_Link.selectByLinkCode) */
export interface BizDocClass {
  classTreeId: number;
  classTreeFullName: string | null;
}

/** L02 Biz02_Grid_InternalList·ExternalList 한 행 (AS-IS Biz02_PersonModel). 직원은 empName·orgName, 거래상대방은 target* */
export interface BizPerson {
  personId: number;
  promoId: number;
  empYn: boolean | null;
  empId: number | null;
  empName?: string | null;
  orgName?: string | null;
  targetCompanyName?: string | null;
  targetEmpName?: string | null;
  targetOrgName?: string | null;
}

/** L02 상신문서 연결 한 행 (AS-IS Biz05_RelateApprModel). 사용자별 조회는 상태 열만 채워진다 */
export interface BizRelateAppr {
  relateApprId: number;
  promoId: number | null;
  apprId: number | null;
  statusCode: string | null;
  statusName: string | null;
  title?: string | null;
  regDate?: string | null;
  effectDate?: string | null;
  regEmpName?: string | null;
}

/** 이익제공 한도초과현황 — 인별 1회 초과건 한 행 (AS-IS Biz01_PromoModel 중 Biz01_TabPage_PersonDay 그리드 열, L07) */
export interface BizLimitPersonDay {
  provideRcvTypeName?: string | null;
  regEmpName?: string | null;
  provideDate?: string | null;
  providePurName?: string | null;
  provideContentName?: string | null;
  targetEmpName?: string | null;
  averagePrice?: number | null;
  note?: string | null;
}

/** 인별 연간 초과건 한 행 (Biz01_TabPage_PersonYear, L07) */
export interface BizLimitPersonYear {
  provideRcvTypeName?: string | null;
  targetCompanyName?: string | null;
  targetEmpName?: string | null;
  averagePrice?: number | null;
}

/** 회사별 연간 초과건 한 행 (Biz01_TabPage_CompanyYear, L07) */
export interface BizLimitCompanyYear {
  provideRcvTypeName?: string | null;
  targetCompanyName?: string | null;
  averagePrice?: number | null;
}
