/** EE22 Biz51_Tab_ErpContCorp (AssetERP 계약사 관리) — 백엔드 `/api/v1/biz/erp-cont-corps`·`erp-fees`·`erp-setups` 응답. 날짜는 'yyyy-MM-dd' 문자열, 추가요금 여부 등은 'true'/'false' 글자 */

/** biz51_erp_cont_corp 한 행 (AS-IS Biz51_ErpContCorpModel) */
export interface BizErpContCorp {
  erpContCorpId: number;
  contCorpNm: string | null;
  serviceType: string | null;
  firstContDate: string | null;
  contDate: string | null;
  contEndDate: string | null;
  contStatusCd: string | null;
  erpStartDate: string | null;
  erpEndDate: string | null;
  managerNm: string | null;
  managerTel: string | null;
  managerEmail: string | null;
  companyCeo: string | null;
  companyAddr: string | null;
  note: string | null;
  companyId: number | null;
  corpId: number | null;
  erpProductCd: string | null;
  erpProductNm: string | null;
  corpNm: string | null;
  contStatusNm: string | null;
  serviceTypeNm: string | null;
  locationNm: string | null;
  erpFeeNm: string | null;
  fileCountStr: string | null;
}

export interface BizErpContCorpSaveReq {
  erpContCorpId: number | null;
  corpId: number | null;
  contStatusCd: string | null;
  serviceType: string | null;
  firstContDate: string | null;
  contDate: string | null;
  contEndDate: string | null;
  erpStartDate: string | null;
  erpEndDate: string | null;
  companyId: number | null;
  managerNm: string | null;
  managerTel: string | null;
  managerEmail: string | null;
  companyCeo: string | null;
  companyAddr: string | null;
  note: string | null;
}

/** biz52_erp_fee 한 행 (AS-IS Biz52_ErpFeeModel). 새 행은 임시 음수 ID */
export interface BizErpFee {
  erpFeeId: number;
  erpContCorpId: number;
  startDate: string | null;
  closeDate: string | null;
  erpFee: number | null;
  dataFee: number | null;
  chargeDay: string | null;
  vatCd: string | null;
  depositDueDay: string | null;
  addFeeSmsYn: string | null;
  addFeeServerYn: string | null;
  addFeeUserYn: string | null;
  smsBaseCount: number | null;
  smsAddPrice: number | null;
  serverBaseUsage: number | null;
  serverAddUnit: number | null;
  serverAddPrice: number | null;
  userBaseCount: number | null;
  userAddPrice: number | null;
  userCountStdCd: string | null;
  chargeCalcMonthType: string | null;
  chargeDayStr: string | null;
  depositDueDayStr: string | null;
  vatNm: string | null;
  userCountStdStr: string | null;
  chargeCalcMonthTypeNm: string | null;
}

/** biz50_erp_setup 기본설정 한 행 (AS-IS Biz50_ErpSetupModel). 새 행은 임시 음수 ID */
export interface BizErpSetup {
  erpSetupId: number;
  startDate: string | null;
  smsBaseCount: number | null;
  smsAddPrice: number | null;
  serverBaseUsage: number | null;
  serverAddUnit: number | null;
  serverAddPrice: number | null;
  chargeDay: string | null;
  vatCd: string | null;
  userBaseCount: number | null;
  userAddPrice: number | null;
  depositDueDay: string | null;
  chargeDayStr: string | null;
  depositDueDayStr: string | null;
  vatNm: string | null;
}

/** 사용료청구 메일 양식 (biz50_erp_setup의 적용시작일 없는 특수 행) */
export interface BizErpMailForm {
  erpSetupId: number;
  mailForm: string | null;
}
