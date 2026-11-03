/** EE20 Biz10_Tab_ContCorp (계약사 관리) — 백엔드 BizCont* DTO */

/** 계약사 한 건(최근 이력 + 보수정보) · 이력관리 탭 한 행 — AS-IS Biz10_ContCorpModel + Biz11_ContHistoryModel + Biz12_FeeInfoModel을 펼친 모양 */
export interface BizContCorp {
  contCorpId: number;
  companyId: number;
  contHistoryId: number;
  regDate: string | null;
  contCorpNm: string | null;
  contStatusCd: string | null;
  contStatusNm: string | null;
  corpStatusCd: string | null;
  corpStatusNm: string | null;
  trType: string | null;
  contPeriodCd: string | null;
  contPeriodNm: string | null;
  contDate: string | null;
  startDate: string | null;
  closeDate: string | null;
  baseFee: string | null;
  manager: string | null;
  managerTel: string | null;
  note: string | null;
  personId: number | null;
  personNm: string | null;
  address: string | null;
  ceo: string | null;
  feeInfoId: number | null;
  /** 'true' | 'false' | null (varchar) */
  minFeeYn: string | null;
  manageMinFee: number | null;
  advMinFee: number | null;
  discrMinFee: number | null;
  feeChargeType: string | null;
  feeChargeTypeNm: string | null;
  withYn: string | null;
  withFee: number | null;
  minFeeStr: string | null;
  withFeeStr: string | null;
}

export interface BizContHistoryReq {
  contHistoryId: number | null;
  regDate: string | null;
  contCorpNm: string | null;
  contStatusCd: string | null;
  corpStatusCd: string | null;
  trType: string | null;
  contPeriodCd: string | null;
  contDate: string | null;
  startDate: string | null;
  closeDate: string | null;
  baseFee: string | null;
  manager: string | null;
  managerTel: string | null;
  note: string | null;
  personId: number | null;
  address: string | null;
  ceo: string | null;
}

export interface BizContFeeReq {
  feeInfoId: number | null;
  minFeeYn: string | null;
  manageMinFee: number | null;
  advMinFee: number | null;
  discrMinFee: number | null;
  feeChargeType: string | null;
  withYn: string | null;
  withFee: number | null;
}

export interface BizContSaveReq {
  contCorpId: number | null;
  history: BizContHistoryReq;
  fee: BizContFeeReq;
}

export interface BizContSaveRes {
  contCorpId: number;
  contHistoryId: number;
}

export interface BizContFeeInfo {
  feeInfoId: number;
  contHistoryId: number;
  minFeeYn: string | null;
  manageMinFee: number | null;
  advMinFee: number | null;
  discrMinFee: number | null;
  feeChargeType: string | null;
  feeChargeTypeNm: string | null;
  withYn: string | null;
  withFee: number | null;
  minFeeStr: string | null;
  withFeeStr: string | null;
}

export interface BizContSearch {
  searchText: string;
  check: boolean;
  stdYear: string;
  statusCode: string;
  statusCheck: boolean;
  endMonth: string;
}

export interface BizContPrintReq extends BizContSearch {
  sortType: '1' | '2';
}

export interface BizContShare {
  shareId: number;
  contHistoryId: number;
  shareCd: string;
  personId: number | null;
  orgId: number | null;
  companyId: number;
  shareNm: string | null;
  personNm: string | null;
  orgNm: string | null;
}

export interface BizContShareReq {
  contHistoryId: number;
  shareCd: string;
  personId: number | null;
  orgId: number | null;
}

export interface BizContWithCorp {
  withCorpId: number;
  contCorpId: number;
  companyId: number;
  manageType: string | null;
  corpId: number | null;
  firstStartDate: string | null;
  lastCloseDate: string | null;
  corpCd: string | null;
  corpNm: string | null;
  manageTypeNm: string | null;
}

export interface BizContRelateAppr {
  relateApprId: number;
  apprId: number;
  contHistoryId: number;
  regDate: string | null;
  effectDate: string | null;
  title: string | null;
  regEmpNm: string | null;
  statusNm: string | null;
}

export interface BizContEach {
  contractId: number;
  companyId: number;
  contCorpId: number;
  date: string | null;
  fundNm: string | null;
  fundStartDate: string | null;
  fundFee: string | null;
  note: string | null;
  startDate: string | null;
  apprId: number | null;
  apprStatusCd: string | null;
  aprStatusNm: string | null;
}

export interface BizContEachAddr {
  contractId: number;
  address: string | null;
  ceo: string | null;
  contCorpNm: string | null;
}

export interface BizContDualFund {
  dualFundId: number;
  companyId: number;
  contCorpId: number;
  fundCd: string | null;
  startDate: string | null;
  fundFee: number | null;
  fundSubFee: number | null;
  note: string | null;
  positionType: string | null;
  positionTypeNm: string | null;
  fundNm: string | null;
}

export interface BizContHoldFee {
  fundCd: string;
  fundNm: string | null;
}
