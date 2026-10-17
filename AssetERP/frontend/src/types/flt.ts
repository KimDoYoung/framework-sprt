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
