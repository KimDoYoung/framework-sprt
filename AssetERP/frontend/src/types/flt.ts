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
