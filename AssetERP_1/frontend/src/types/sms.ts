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

// ── C06 고객별 문자발송 (Sms03_Tab_SendAdmin) ──

/** 단체문자 한 행 (AS-IS Sms03_GroupSendModel). 새 행은 임시 음수 ID, startDate는 'yyyy-MM-dd' */
export interface GroupSend {
  groupSendId: number;
  companyId: number;
  personId: number;
  startDate: string | null;
  title: string | null;
  content: string | null;
  note: string | null;
}

/** 전송기록 한 행 (AS-IS Sms04_GroupSendHistoryModel). historyId는 18자리라 서버가 문자열로 준다 */
export interface GroupSendHistory {
  historyId: string;
  companyId: number;
  groupSendId: number;
  sendDateStr: string;
  targetName: string | null;
  targetTelNo: string | null;
}

/** 발송 대상 그리드(grid02) 한 행 (AS-IS Emp01_PersonModel). rowKey는 그리드 행 ID(같은 사람·기타고객사가 겹쳐도 되게 화면이 붙인다) */
export interface GroupSendTarget {
  rowKey: number;
  personId: number;
  companyName: string | null;
  orgName: string | null;
  posName: string | null;
  korName: string | null;
  mobileTelNo: string | null;
}
