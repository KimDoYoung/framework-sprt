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

/** ICAM 발생보수 한 행 (AS-IS Icam10_FeeModel 중 Icam10_Tab_FeeAdmin 그리드 열). 날짜는 'yyyy-MM-dd' */
export interface IcamFee {
  /** numeric ID — 문자열 (05 §6) */
  feeId: string;
  stdDate?: string | null;
  icamCompanyCode?: string | null;
  icamCompanyName?: string | null;
  fundName?: string | null;
  rmkName?: string | null;
  fee?: number | null;
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

