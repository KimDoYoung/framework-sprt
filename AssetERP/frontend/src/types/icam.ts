/** ICAM 펀드기본 한 행 (AS-IS Icam03_FundModel). 날짜는 'yyyy-MM-dd', 코드 이름은 f_cdnm으로 푼 값 */
export interface IcamFund {
  /** 18자리 ID — 문자열 (05 §6) */
  fundId: string;
  stdDate?: string | null;
  fundCd: string;
  fundNm?: string | null;
  kofiaFundCd?: string | null;
  ksdFundCd?: string | null;
  ksdItemCd?: string | null;
  trustNm?: string | null;
  fundTypeNm?: string | null;
  publicNm?: string | null;
  parentNm?: string | null;
  classTypeNm?: string | null;
  fundUnitNm?: string | null;
  charClassNm?: string | null;
  diffDivYn?: string | null;
  setDate?: string | null;
  endDate?: string | null;
  endExpectDate?: string | null;
  operator1?: string | null;
  operator2?: string | null;
  consignmentNm?: string | null;
  trustBankNm?: string | null;
  officeWorkNm?: string | null;
  cur?: string | null;
  closeDate?: string | null;
  feeDate?: string | null;
  managementRate?: number | null;
  salesRate?: number | null;
  consignmentRate?: number | null;
  officeWorkRate?: number | null;
  setAmt?: number | null;
  nav?: number | null;
  workDateString?: string | null;
  worker?: string | null;
}

/** 펀드보수 발생내역 가져오기 창(Icam10_Lookup_getICAM)의 요청. corpId는 사무관리보수만 쓰고(전체면 null), 그 밖은 서버가 로그인 회사로 정한다 */
export interface IcamFeeJobReq {
  feeType: string;
  startDate: string;
  closeDate: string;
  corpId: number | null;
  corpCode: string;
  fundCode: string;
}

/** ICAM 발생보수 한 행 (AS-IS Icam10_FeeModel 중 Icam10_Tab_FeeAdmin 그리드 열). 날짜는 'yyyy-MM-dd' */
/** X29 펀드 조회창(Icam10_Lookup_FundCode) 행 — AS-IS Icam10_FeeModel의 펀드코드·펀드명 */
export interface IcamFeeFund {
  /** 순번(row_number) — 그리드 행 ID */
  feeId: string;
  fundCode: string;
  fundName?: string | null;
}

export interface IcamFee {
  /** numeric ID — 문자열 (05 §6) */
  feeId: string;
  stdDate?: string | null;
  icamCompanyCode?: string | null;
  icamCompanyName?: string | null;
  /** X23 (Icam10_Tab_OfficeMngFee) 그리드 열 */
  fundCode?: string | null;
  fundName?: string | null;
  rmkName?: string | null;
  curCode?: string | null;
  fee?: number | null;
  fxRate?: number | null;
  afPayDate?: string | null;
  bfPayDate?: string | null;
  workDateString?: string | null;
  worker?: string | null;
}

/** ICAM DB소스 한 행 (AS-IS Icam50_SourceModel). 날짜는 'yyyy-MM-dd'. text는 소스내용(보기 창) */
export interface IcamSource {
  /** numeric ID — 문자열 (05 §6) */
  sourceId: string;
  stdDate?: string | null;
  serverType?: string | null;
  owner?: string | null;
  type?: string | null;
  name?: string | null;
  lineCnt?: number | null;
  workDateString?: string | null;
  text?: string | null;
}

/** ICAM 연계 데이터 한 행 (AS-IS Icam02_DataModel 중 Icam99_Tab_Test 그리드 열). 날짜는 'yyyy-MM-dd' */
export interface IcamData {
  dataId: number;
  icamCompanyCode?: string | null;
  icamDate?: string | null;
  fundCode?: string | null;
  fundName?: string | null;
  assetCode?: string | null;
  assetName?: string | null;
  itemCode?: string | null;
  itemName?: string | null;
  seq?: number | null;
  infoCode?: string | null;
  infoName?: string | null;
  trCode?: string | null;
  trName?: string | null;
  tgtDate?: string | null;
  tgtAmt?: number | null;
  tgtStdDate?: string | null;
  note?: string | null;
  createDateString?: string | null;
  creater?: string | null;
  icsClassTreeId?: number | null;
  icsDeadlineId?: number | null;
  confirmYn?: string | null;
  confirmPersonId?: number | null;
}

/** Icam99_Tab_Test 작업 버튼이 BatchMain에 보내던 actionCode와 그 작업이 쓰는 값 */
export interface IcamTestBatchReq {
  actionCode: string;
  stdDate?: string;
  startDate?: string;
  closeDate?: string;
  year?: string;
}

/** R05 펀드별 기준가 현황 (AS-IS Icam06_FundBookModel) */
export interface FundPrice {
  fundBookId: number;
  fundCode: string;
  fundName: string;
  cur: string;
  forPrincipal: number;
  principalDiff: number;
  forStdPrice: number;
  stdPriceDiff: number;
  forTaxPrice: number;
  taxPriceDiff: number;
  forNav: number;
  navDiff: number;
}

/** R06 펀드별 발생보수현황 (AS-IS Icam10_FeeModel) */
export interface CurrentFeeByFund {
  feeId: number;
  fundName: string;
  beforefee1: number;
  afterfee1: number;
  beforefee2: number;
  afterfee2: number;
  beforefee3: number;
  afterfee3: number;
  beforefee4: number;
  afterfee4: number;
  beforefee5: number;
  afterfee5: number;
  beforefee6: number;
  afterfee6: number;
  beforefee7: number;
  afterfee7: number;
  beforefee8: number;
  afterfee8: number;
  beforefee9: number;
  afterfee9: number;
  beforefee10: number;
  afterfee10: number;
  beforefee11: number;
  afterfee11: number;
  beforefee12: number;
  afterfee12: number;
  totalBeforefee: number;
  totalAfterfee: number;
}

/** R07 펀드운용현황 (AS-IS Icam06_Tab_FundOperateStatus) */
export interface FundOperateStatus {
  fundBookId: number;
  stdDate: string;
  principal: number;
  nav: number;
  totalAsset: number;
  navAvg: number;
  totalAssetAvg: number;
}

/** R07 펀드운용현황 상세 (AS-IS Icam06_Grid_FundOperateStatus) */
export interface FundOperateStatusDetail {
  fundBookId: number;
  stdDate: string;
  fundCode: string;
  fundName: string;
  principal: number;
  nav: number;
  totalAsset: number;
  setQty: number;
  stdPrice: number;
  cur: string;
}



/** ICAM 펀드보수 월말잔액 한 행 (X24, AS-IS Icam12_FeeBookModel) */
export interface IcamFeeBook {
  stdDate?: string | null;
  icamCompanyCode?: string | null;
  icamCompanyName?: string | null;
  fundCode?: string | null;
  fundName?: string | null;
  curCode?: string | null;
  forFee?: number | null;
  fee?: number | null;
  consignmentName?: string | null;
  workDateString?: string | null;
  worker?: string | null;
}

/** ICAM 펀드보수 월말잔액 대사 결과 한 행 (X24, AS-IS Icam13_FeeBookCheckModel) */
export interface IcamFeeBookCheck {
  stdDate?: string | null;
  result?: string | null;
  diffAmt?: number | null;
  workerName?: string | null;
  workDateString?: string | null;
}

/** 펀드 하루의 적요별 보수 한 행 (X25, AS-IS Icam10_FeeModel 일부) */
export interface IcamFeeDetail {
  rmkCode: string;
  rmkName?: string | null;
  curCode?: string | null;
  fee?: number | null;
}

/** 펀드별 보수입금계좌 (Icam11_FeeDepositModel) — 위 그리드(현재 계좌)와 아래 그리드(적용시작일별 이력)가 같은 모양 (X27) */
export interface IcamFeeDeposit {
  feeDepositId: number;
  icamCompanyCode: string | null;
  icamCompanyName: string | null;
  fundCode: string | null;
  fundName: string | null;
  curCode: string | null;
  consignmentName: string | null;
  depositId: number | null;
  depositName: string | null;
  startDate: string | null;
}

/** ICAM 사용자ID 신청서 한 줄 (AS-IS Icam55_IcamUserModel, EE29). 날짜는 'yyyy-MM-dd' */
export interface IcamUser {
  /** 새 행(아직 저장 전)은 0 이하의 임시 번호 */
  icamUserId: number;
  regDate?: string | null;
  regType?: string | null;
  companyName?: string | null;
  userName?: string | null;
  procAddYn: boolean;
  procModiYn: boolean;
  procdelYn: boolean;
  procAddYnStr?: string | null;
  procModiYnStr?: string | null;
  procdelYnStr?: string | null;
  procTypeName?: string | null;
  apprId?: number | null;
  /** 10 결재중 · 20 · 30 완료 · 40 반려 · 99 임시저장 */
  apprStatusCode?: string | null;
  apprStatusName?: string | null;
  regContent?: string | null;
  regEmpId?: number | null;
  regEmpName?: string | null;
  procStateCode?: string | null;
  procStateName?: string | null;
  procDate?: string | null;
  procEmpName?: string | null;
  procNote?: string | null;
}

/** 사용자ID 신청서 저장 한 줄 (AS-IS Icam55_IcamUser.update) — icamUserId 0 이하는 새 행 */
export interface IcamUserSaveReq {
  icamUserId: number;
  regDate: string | null;
  companyName: string | null;
  userName: string | null;
  procAddYn: boolean;
  procModiYn: boolean;
  procdelYn: boolean;
  regContent: string | null;
}

/** 사용자ID 처리결과 등록 한 줄 (AS-IS Icam55_IcamUserModel — selectByDate, EE30) */
export interface IcamUserResult {
  icamUserId: number;
  regDate?: string | null;
  regTypeName?: string | null;
  companyName?: string | null;
  userName?: string | null;
  procTypeName?: string | null;
  apprId?: number | null;
  apprStatusCode?: string | null;
  regEmpName?: string | null;
  /** 1 완료 · 9 이행불가, 없으면 미처리 */
  procStateCode?: string | null;
  procStateName?: string | null;
  procDate?: string | null;
  procEmpId?: number | null;
  procEmpName?: string | null;
  procNote?: string | null;
}

/** 미사용ID 권한정지 신청 한 줄 (AS-IS Icam55_IcamUserModel, regType 2, EE31) */
export interface IcamStop {
  /** 새 행(아직 저장 전)은 0 이하의 임시 번호 */
  icamUserId: number;
  regDate?: string | null;
  companyName?: string | null;
  userId?: string | null;
  userName?: string | null;
  email?: string | null;
  note?: string | null;
  apprId?: number | null;
  /** 10 결재중 · 20 · 30 완료 · 40 반려 · 99 임시저장 */
  apprStatusCode?: string | null;
  apprStatusName?: string | null;
  regEmpName?: string | null;
  procStateName?: string | null;
  procDate?: string | null;
  procEmpName?: string | null;
  procNote?: string | null;
}

/** 미사용ID 기록관리 한 줄 (AS-IS Icam55_IcamUserModel — selectByProcStateCode, EE32) */
export interface IcamStopAuth {
  icamUserId: number;
  companyName?: string | null;
  userId?: string | null;
  userName?: string | null;
  email?: string | null;
  procDate?: string | null;
  stopMonthPeriod?: string | null;
  /** 삭제대상 · 정지해제 · 삭제 · 정지 */
  state?: string | null;
  delDate?: string | null;
  unstopDate?: string | null;
  mngEmpName?: string | null;
  note?: string | null;
}


/** AS-IS icam.Icam20_Price.selectByStdDatePaging (Flt10_Lookup_ItemStk, EE99) — 종목(주식) 한 줄. isin = 종목코드 */
export interface IcamPriceStock {
  isin: string | null;
  itemName: string | null;
}
