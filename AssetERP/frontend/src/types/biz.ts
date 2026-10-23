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
