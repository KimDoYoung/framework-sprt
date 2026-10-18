/** 기한 한 행 (AS-IS Sch03_DeadlineModel, E01-1). 날짜는 'YYYY-MM-DD' */
export interface Sch03Deadline {
  deadlineId: number;
  infoId?: number | null;
  companyId?: number | null;
  /** 스케줄 구분: 1 스케줄 / 2 내부통제-반복 / 3 내부통제-수시 */
  scheduleCode?: string | null;
  /** 주기코드: 01 일 / 02 주 / 03 월 / 04 분기 / 05 반기 / 06 년 / 99 수시 */
  cycleCode?: string | null;
  cycleName?: string | null;
  /** 주기계산구분 (03 매일 / 04 주별 / 05·06 월별 / 07·08·09 말일 / 10 즉시 / 11·12 주기설정 / 01 일자지정 / 02 수시기간) */
  cycleCalcType?: string | null;
  periodCode?: string | null;
  yearCode?: string | null;
  yearTypeCode?: string | null;
  monthCode?: string | null;
  monthTypeCode?: string | null;
  dayCode?: string | null;
  dayTypeCode?: string | null;
  weekCode?: string | null;
  dayWeekCode?: string | null;
  holidayCode?: string | null;
  num1?: number | null;
  num2?: number | null;
  num3?: number | null;
  fixDate?: string | null;
  note?: string | null;
  startDate?: string | null;
  closeDate?: string | null;
  /** 처리일 정보 (f_get_deadline_nm) */
  deadlineFullName?: string | null;
}

/** 기한 저장 값 (deadlineId가 없거나 0 이하면 새로 등록, 회사는 서버가 채운다) */
export type Sch03DeadlineSaveReq = Omit<Sch03Deadline, 'deadlineId' | 'companyId' | 'cycleName' | 'deadlineFullName'> & { deadlineId?: number | null };

/** 기본 기한 콤보 항목 (AS-IS sys.Sys00_Common.selectDeadLine) */
export interface Sch03DeadlineTemplate {
  code: string;
  name: string;
}

/** 연관 내부통제 한 행 (AS-IS Sch05_RelateIcsModel, E04). 새 행은 저장 전까지 없다 — 추가는 바로 서버에 저장한다 */
export interface Sch05RelateIcs {
  relateIcsId: number;
  infoId?: number | null;
  icsClassTreeId: number;
  deadlineId: number;
  icsClassTreeFullName?: string | null;
  deadlineName?: string | null;
  cycleName?: string | null;
}

/** 공모주 일정 (AS-IS Sch10_IpoModel — sch10_ipo.selectBySearchTextAdmin, E20). 날짜는 yyyy-MM-dd, cancelYn은 'true'/'false' */
export interface Sch10Ipo {
  ipoId: number;
  companyId?: number | null;
  marketCode?: string | null;
  marketName?: string | null;
  itemName?: string | null;
  issCorpCode?: string | null;
  demandStartDate?: string | null;
  demandCloseDate?: string | null;
  subscriptionStartDate?: string | null;
  subscriptionCloseDate?: string | null;
  payDate?: string | null;
  listDate?: string | null;
  priceBracket?: string | null;
  price?: number | null;
  note?: string | null;
  cancelYn?: string | null;
  shareCount?: number | null;
}

/** 공모주 일정 조회 조건 (AS-IS retrieve()) */
export interface Sch10IpoSearch {
  dateType: string;
  startDate: string;
  closeDate: string;
  searchText: string;
  marketCode: string;
}

/** 주간사 (AS-IS Sch12_IpoCorpModel, E20) */
export interface Sch12IpoCorp {
  ipoCorpId: number;
  corpName?: string | null;
  homepage?: string | null;
}

/** 공모주일정 미일치내역 (AS-IS Sch14_IpoMismatchModel, E20). checkYn은 'true'/'false'. ID는 18자리라 JS 숫자로 못 담아 글자로 받는다 */
export interface Sch14IpoMismatch {
  ipoMismatchId: string;
  stkCode?: string | null;
  target1?: string | null;
  target2?: string | null;
  insertDateTimeStr?: string | null;
  checkYn?: string | null;
}

/** IPO 종목코드 매칭 (AS-IS Sch15_IpoItemMatchingModel, E20) */
export interface Sch15IpoItemMatching {
  ipoItemMatchingId: number;
  itemCode?: string | null;
  validItemCode?: string | null;
  itemName?: string | null;
}
