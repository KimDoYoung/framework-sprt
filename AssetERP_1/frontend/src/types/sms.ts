/** 고객별 문자사용량 (C05) — AS-IS Sms02_HistoryModel */

/** GET /api/v1/sms/history-totals (selectByTotalCount) */
export interface SmsHistoryTotal {
  historyId: number;
  companyId: number;
  companyNm: string;
  locNm: string;
  totalCount: number;
  runningTotalCount: number;
}

/** GET /api/v1/sms/history-totals/years (selectByTotalCountYear) — 사용금액은 건당 9.5라 소수가 나온다(화면 gb.long이 정수로 표시) */
export interface SmsHistoryYear {
  historyId: number;
  year: string;
  totalCount: number;
  totalPayCount: number;
}

/** GET /api/v1/sms/history-totals/months (selectByTotalCountMonth) */
export interface SmsHistoryMonth {
  historyId: number;
  month: string;
  totalCount: number;
  totalPayCount: number;
}

/** GET /api/v1/sms/histories (selectByDate) */
export interface SmsHistory {
  /** 18자리라 JS 정수 한계를 넘는다 → 서버가 문자열로 준다 */
  historyId: string;
  companyId: number;
  sendDateStr: string;
  content: string | null;
  note: string | null;
}
