/** flt(임직원매매) 화면 타입 (E08~) — API 응답 record와 같은 필드 */

/** 종목유형 (flt05_item_type) — 체크 칸은 DB 형태('true'/'false' 문자열) 그대로 */
export interface FltItemType {
  itemTypeId: number;
  companyId: number;
  companyName: string;
  itemTypeCode: string;
  itemTypeName: string;
  seq: number;
  /** YYYY-MM-DD */
  startDate: string;
  targetYn: string;
  sellPreApprYn: string;
  lockUpCheckYn: string;
  stkPriceYn: string;
  listStkYn: string;
}

/** 임직원 계좌 (I02 Flt03_Tab_AccountReport, flt03_account) — 날짜는 YYYY-MM-DD, 계좌번호는 복호화한 값 */
export interface FltAccount {
  accountId: number;
  companyId: number;
  personId: number;
  setupDate: string | null;
  regReason: string | null;
  regReasonName: string | null;
  familyRelateCode: string | null;
  familyRelateName: string | null;
  mainAccountYn: boolean | null;
  accountName: string | null;
  accountNoDec: string | null;
  corpId: number | null;
  corpName: string | null;
  corpBranchName: string | null;
  itemType: string | null;
  itemTypeName: string | null;
  note: string | null;
  apprId: number | null;
  apprRegDate: string | null;
  apprStatusCode: string | null;
  apprStatusName: string | null;
  trCnt: number | null;
  bookCnt: number | null;
  bookInitCnt: number | null;
}

/** 폐쇄 계좌 (flt06_account_close) */
export interface FltAccountClose {
  accountCloseId: number;
  accountId: number;
  closeDate: string | null;
  familyRelateName: string | null;
  accountName: string | null;
  accountNoDec: string | null;
  corpName: string | null;
  corpBranchName: string | null;
  itemTypeName: string | null;
  apprId: number | null;
  apprRegDate: string | null;
  apprStatusCode: string | null;
  apprStatusName: string | null;
}

/** 화면 위 안내: 보고주기('1' 분기 / '2' 월 / 없음)·서약서 상신 상태('30'이면 서명완료) */
export interface FltAccountStatus {
  checkCycle: string | null;
  oathStatusCode: string | null;
  oathStatusName: string | null;
}

/** 기본 문서분류 (dcr30_link) */
export interface FltDocClass {
  classTreeId: number;
  classTreeFullName: string | null;
}

/** 임직원 매매 사전신고 한 행 (I03 Flt10_Tab_BuyReport, flt10_tr) — 날짜는 YYYY-MM-DD */
export interface FltTr {
  trId: number;
  companyId: number;
  personId: number;
  /** 10I 매수 / 20O 매도 */
  trType: string | null;
  trTypeName: string | null;
  accountId: number | null;
  /** 계좌번호 (개설기관) 계좌명 */
  accountInfo: string | null;
  accountRelateCode: string | null;
  regDate: string | null;
  itemType: string | null;
  itemTypeName: string | null;
  itemName: string | null;
  itemCode: string | null;
  expectTrQty: number | null;
  expectTrAmt: number | null;
  expectTrDate: string | null;
  checkBuyLockup: string | null;
  checkFundHold: string | null;
  trReason: string | null;
  /** 10 신청 / 20 승인 / 30 반려 */
  statusCode: string | null;
  statusName: string | null;
  rejectReason: string | null;
  trDate: string | null;
  unfillYn: boolean | null;
  stkPriceYn: boolean | null;
  checkTargetYn: boolean | null;
}

/** 사전신고 화면 위 안내 (flt02_emp·flt04_oath) + 서버 오늘 + 회사의 사전신고 소급 설정 */
export interface FltTrCheck {
  hasEmp: boolean;
  /** '1' 분기별 / '2' 월별 */
  checkCycle: string | null;
  yearInvestLimit: number | null;
  /** '1' 매매금액 / '2' 입출금액 */
  investAmtCalcTargetCode: string | null;
  investAmtOverCheckYn: boolean | null;
  oathStatusCode: string | null;
  today: string;
  fltOnlyCurrYn: boolean;
}

/** 투자한도 그리드 한 행 — 1 한도 / 2 현재 투자금액(사전신고 포함) / 3 현재 투자금액(사전신고 제외) */
export interface FltInvestLimit {
  trId: number;
  checkTypeName: string;
  yearInvestLimit: number | null;
  totalInvestAmt: number | null;
  turnoverRate: number | null;
  monthBuyCount: number | null;
  dayBuyCount: number | null;
}

/** 종목 찾기 창 한 행 */
export interface FltTrItem {
  trId: number;
  itemName: string;
  itemTypeName: string | null;
}

/** 매수제한 검사 결과 — OK 적용 / CONFIRM 확인 뒤 적용 / REJECT 막음 */
export interface FltBuyLockup {
  status: 'OK' | 'CONFIRM' | 'REJECT';
  message: string | null;
}

/** 사전신고 화면 계좌 그리드 한 행 (flt03_account.selectByDate) */
export interface FltTrAccount {
  accountId: number;
  mainAccountYn: boolean | null;
  mainAccountYnStr: string | null;
  familyRelateCode: string | null;
  familyRelateName: string | null;
  corpName: string | null;
  accountNoDec: string | null;
  accountName: string | null;
  itemTypeName: string | null;
}

/** 종목유형 콤보 한 행 (sys00_common.selectByFltItemType) */
export interface FltItemTypeCode {
  codeId: number;
  code: string;
  name: string;
  stkPriceYn: boolean;
  targetYn: boolean;
}
