/** 금감원 업무보고서 (AS-IS Rpt10_FssSubmitModel) */
export interface RptFssSubmit {
  submitId: number;
  reportCode: string | null;
  reportName?: string | null;
  submitCycleCode?: string | null;
  submitCycleName?: string | null;
  writeTarget?: string | null;
  writeGuide?: string | null;
  reviseHistory?: string | null;
}

/** 작성요령 및 변경이력 (T17, AS-IS selectByReportCode) */
export interface RptWriteGuide {
  writeGuide: string | null;
  reviseHistory: string | null;
}

/** submitId가 없거나 0 이하면 새 행 */
export interface RptFssSubmitSaveReq {
  submitId?: number | null;
  reportCode: string | null;
  reportName: string | null;
  submitCycleCode: string | null;
  writeTarget: string | null;
  writeGuide: string | null;
  reviseHistory: string | null;
}

/** Z08 AS-IS Rpt01_DailyModel — 일일업무 그리드 행 (rpt01_daily.selectByText) */
export interface RptDaily {
  dailyId: number;
  date?: string | null;
  content?: string | null;
  note?: string | null;
  personId?: number | null;
  confirmYn?: boolean | null;
  confirmYnName?: string | null;
  confirmName?: string | null;
}

/** Z08 저장 요청 — dailyId가 없으면 새 글 */
export interface RptDailySaveReq {
  dailyId?: number | null;
  date: string;
  content: string;
  note: string | null;
}

/** Z09 AS-IS Rpt01_DailyModel — 일일업무 확인 그리드 행 (rpt01_daily.selectByConfirmText) */
export interface RptDailyConfirm {
  dailyId: number;
  personOrg?: string | null;
  personId?: number | null;
  personName?: string | null;
  date?: string | null;
  content?: string | null;
  confirmNote?: string | null;
  confirmYn?: boolean | null;
  confirmYnName?: string | null;
}

/** Z10 AS-IS Rpt02_MonthModel — 월간회의자료 그리드 행 (rpt02_month.selectByText) */
export interface RptMonth {
  monthId: number;
  personId?: number | null;
  orgName?: string | null;
  /** 'yyyy.MM' */
  yyyyMm?: string | null;
  content?: string | null;
  note?: string | null;
  fileCount?: number | null;
}

/** Z10 저장 요청 — monthId가 없으면 새 글. yyyyMm = 'yyyy.MM' */
export interface RptMonthSaveReq {
  monthId?: number | null;
  yyyyMm: string;
  content: string;
  note: string | null;
}

/** Z11 AS-IS Rpt03_WeekModel — 주간업무보고 그리드 행 (rpt03_week.selectByStartDate) */
export interface RptWeek {
  weekId: number;
  personId?: number | null;
  weekStartDate?: string | null;
  weekCloseDate?: string | null;
  bizType?: string | null;
  bizTypeName?: string | null;
  content?: string | null;
  htmlContent?: string | null;
  dueDate?: string | null;
  seq?: number | null;
  bold?: boolean | null;
  note?: string | null;
  fixYn?: boolean | null;
  fixYnStr?: string | null;
  orgName?: string | null;
  personName?: string | null;
}

/** Z11 저장 요청 — weekId가 없거나 0 이하면 새 행 */
export interface RptWeekSaveReq {
  weekId?: number | null;
  weekStartDate: string;
  weekCloseDate: string;
  bizType?: string | null;
  content: string | null;
  dueDate?: string | null;
  seq: number | null;
  bold?: boolean | null;
  note?: string | null;
}

/** Z11 한 주의 제출·확인 상태 */
export interface RptWeekState {
  fixYn: boolean;
  confirmerId?: number | null;
  confirmerName?: string | null;
}

/** Z11 콤보 항목 (AS-IS Sys09_CodeModel code·name) */
export interface RptWeekCode {
  code: string;
  name: string;
}

/** Z11 기준일이 속한 주 (월~금) */
export interface RptWeekDays {
  weekNumber: number;
  startDate: string;
  closeDate: string;
}

/** Z11 [출력/다운로드] 결과 — 출력 그룹 ID와 지난주 기간 */
export interface RptWeekPrint {
  groupId: string;
  lastStartDate?: string | null;
  lastCloseDate?: string | null;
}

/** Z11 AS-IS Rpt05_WeekBizClassModel — 주간업무구분 관리 그리드 행 */
export interface RptWeekBizClass {
  weekBizClassId: number;
  weekBizType: string;
  weekBizTypeName?: string | null;
  unUseYn?: boolean | null;
}
