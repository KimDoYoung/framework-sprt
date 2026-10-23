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
