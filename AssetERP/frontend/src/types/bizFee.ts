/** EE21 Biz20_Tab_FeeCharge (최저보수 청구) — 백엔드 `/api/v1/biz/fee-charges`·`/fee-accounts` 응답. 날짜는 'yyyy-MM-dd' 문자열, 확정여부 등은 'true'/'false' 글자 */

/** biz20_fee_charge.selectByChargeDate — 목록 한 행 (AS-IS Biz20_FeeChargeModel). realFeeChargeId 가 없으면 당분기 청구내역이 없는 행(전분기만 있음) */
export interface BizFeeCharge {
  feeChargeId: number;
  corpNm: string | null;
  preOccFee: number | null;
  preRealChargeFee: number | null;
  occFee: number | null;
  realChargeFee: number | null;
  realFeeChargeId: number | null;
  fixNm: string | null;
  aprStatusNm: string | null;
  companyId: number;
  chargeDate: string;
  corpId: number;
  targetYn: string | null;
  chargeFee: number | null;
  tax: number | null;
  note: string | null;
  fixYn: string | null;
  apprId: number | null;
  contCorpId: number | null;
  trId: number | null;
  minFee: number | null;
  occStartDate: string | null;
  occCloseDate: string | null;
  occDays: number | null;
  manageType: string | null;
  manageTypeNm: string | null;
}

/** biz20_fee_charge.selectById — 저장 뒤 한 건 */
export interface BizFeeChargeDetail {
  feeChargeId: number;
  companyId: number;
  chargeDate: string;
  corpId: number;
  occFee: number | null;
  chargeFee: number | null;
  tax: number | null;
  fixYn: string | null;
  apprId: number | null;
  trId: number | null;
  note: string | null;
  contCorpId: number | null;
  realChargeFee: number | null;
  corpCd: string | null;
  corpNm: string | null;
  manageType: string | null;
  aprStatusNm: string | null;
  fixNm: string | null;
  manageTypeNm: string | null;
}

/** Biz20_Edit_FeeCharge 저장 */
export interface BizFeeChargeSaveReq {
  feeChargeId: number;
  chargeDate: string;
  corpId: number | null;
  contCorpId: number | null;
  occFee: number | null;
  chargeFee: number | null;
  tax: number | null;
  note: string | null;
}

/** biz20_fee_charge.getHtmlContent — 입금계좌가 있어야 한 건이 나온다 */
export interface BizFeeChargeAppr {
  corpNm: string | null;
  occFee: number | null;
  realChargeFee: number | null;
  minFee: number | null;
  occStartDate: string | null;
  occCloseDate: string | null;
  firstStartDate: string | null;
  accountNo: string | null;
  bankNm: string | null;
  accountNm: string | null;
}

/** biz22_fee_charge_calc 한 행 — 구간 계산정보 (Biz22_Lookup_FeeChargeCalc) */
export interface BizFeeChargeCalc {
  feeChargeCalcId: number;
  contCorpId: number;
  chargeDate: string;
  termStartDate: string;
  termCloseDate: string;
  termDays: number | null;
  minFeeYn: string | null;
  manageMinFee: number | null;
  manageTermMinFee: number | null;
  manageTermOccFee: number | null;
  manageTermWithFee: number | null;
  manageTermChargeFee: number | null;
  advMinFee: number | null;
  advTermMinFee: number | null;
  advTermOccFee: number | null;
  advTermWithFee: number | null;
  advTermChargeFee: number | null;
  discrMinFee: number | null;
  discrTermMinFee: number | null;
  discrTermOccFee: number | null;
  discrTermWithFee: number | null;
  discrTermChargeFee: number | null;
  withYn: string | null;
  withFee: number | null;
  withTermWithFee: number | null;
  withTermOccFee: number | null;
  withTermChargeFee: number | null;
}

/** biz29_account 한 행 — 보수입금계좌 (Biz29_Lookup_Account). 새 행은 임시 음수 ID */
export interface BizFeeAccount {
  accountId: number;
  companyId: number | null;
  corpId: number | null;
  startDate: string | null;
  bankCd: string | null;
  accountNo: string | null;
  accountNm: string | null;
  astClassTreeId: number | null;
  note: string | null;
  corpNm: string | null;
  bankNm: string | null;
  astClassTreeNm: string | null;
}

export interface BizFeeAccountSaveReq {
  accountId: number;
  corpId: number | null;
  startDate: string | null;
  bankCd: string | null;
  accountNo: string | null;
  accountNm: string | null;
  astClassTreeId: number | null;
  note: string | null;
}
