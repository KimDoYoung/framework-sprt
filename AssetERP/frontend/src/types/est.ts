/** 부동산PF 수수료 항목 한 행 (GET /api/v1/est/pf-fee-types, AS-IS Est01_PfFeeTypeModel). 날짜는 'yyyy-MM-dd' */
export interface PfFeeType {
  pfFeeTypeId: number;
  feeCode: string | null;
  feeName: string | null;
  feeDesc: string | null;
  seq: number | null;
  startDate: string | null;
  closeDate: string | null;
  note: string | null;
}
