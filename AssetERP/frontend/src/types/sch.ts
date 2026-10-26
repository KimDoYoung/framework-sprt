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

/** 공모주 일정조회 한 행 (Q04, AS-IS Sch10_IpoModel — sch10_ipo.selectBySearchText). 날짜는 yyyy-MM-dd, interestName은 관심이면 '★' */
export interface Sch10IpoUser {
  ipoId: number;
  interestName?: string | null;
  marketName?: string | null;
  itemName?: string | null;
  demandStartDate?: string | null;
  demandCloseDate?: string | null;
  subscriptionStartDate?: string | null;
  subscriptionCloseDate?: string | null;
  payDate?: string | null;
  listDate?: string | null;
  priceBracket?: string | null;
  price?: number | null;
  note?: string | null;
  subscriptionRate?: number | null;
  shareInfo?: string | null;
}

/** 공모주 일정조회 조건 (Q04, AS-IS retrieve() L403-439) */
export interface Sch10IpoUserSearch {
  dateType: string;
  startDate: string;
  closeDate: string;
  searchText: string;
  marketCode: string;
  interestYn: boolean;
}

/** 공모주 알람설정 6칸 (Q04, AS-IS Sch11_IpoCompanyModel) */
export interface Sch11IpoCompany {
  ipoCompanyId: number;
  ipoId?: number | null;
  companyId?: number | null;
  demandSdateAlarmYn?: boolean | null;
  demandCdateAlarmYn?: boolean | null;
  subscriptionSdateAlarmYn?: boolean | null;
  subscriptionCdateAlarmYn?: boolean | null;
  payDateAlarmYn?: boolean | null;
  listDateAlarmYn?: boolean | null;
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

/** 법규보고 점검 한 행 (AS-IS Sch04_ListModel, H06). noneDataYn이면 아직 저장 안 된 건(listId는 UNION이 만든 임시 번호) */
export interface Sch04List {
  listId: number;
  companyId?: number | null;
  closeDate?: string | null;
  mngOrgId?: number | null;
  mngOrgName?: string | null;
  managerId?: number | null;
  managerName?: string | null;
  personId?: number | null;
  personName?: string | null;
  statusCode?: string | null;
  statusName?: string | null;
  manageDate?: string | null;
  confirmYn?: boolean | null;
  title?: string | null;
  icsClassTreeId?: number | null;
  relatedLaw?: string | null;
  apprTitle?: string | null;
  issApprId?: number | null;
  issDate?: string | null;
  scheduleCode?: string | null;
  scheduleName?: string | null;
  cycleCode?: string | null;
  cycleName?: string | null;
  advisYn?: boolean | null;
  infoId?: number | null;
  deadlineId?: number | null;
  note?: string | null;
  confirmDate?: string | null;
  confirmerId?: number | null;
  confirmerName?: string | null;
  noneDataYn?: boolean | null;
}

/** 법규보고 점검 조회 조건. 발생구분·주기구분은 전체면 '%' */
export interface Sch04ListSearch {
  startDate: string;
  closeDate: string;
  doneExceptYn: boolean;
  scheduleCode: string;
  cycleCode: string;
  searchText: string;
  advisYn: boolean;
}

/** 법규보고 점검(관리자) 조회 조건 — orgId 없음 = 담당부서 전체 */
export interface Sch04ListManagerSearch extends Sch04ListSearch {
  orgId?: number | null;
}

/** 작성(담당)그룹 한 행 (K04, AS-IS Sch22_WriteGroupModel) */
export interface Sch22WriteGroup {
  writeGroupId: number;
  writeGroupName?: string | null;
  companyId?: number | null;
  confirmerId?: number | null;
  confirmerName?: string | null;
}

/** 작성그룹의 공유 한 행 (K04, AS-IS Sch02_ShareModel). shareCode 1=직원 2=부서, 날짜는 yyyy-MM-dd */
export interface Sch02Share {
  shareId: number;
  infoId?: number | null;
  shareCode?: string | null;
  shareName?: string | null;
  personId?: number | null;
  personName?: string | null;
  orgId?: number | null;
  orgName?: string | null;
  companyId?: number | null;
  startDate?: string | null;
  closeDate?: string | null;
}

/** 업무일정 (O01, AS-IS Sch01_InfoModel). Y/N은 boolean */
export interface Sch01Info {
  infoId: number;
  companyId?: number | null;
  title?: string | null;
  content?: string | null;
  report?: string | null;
  managerId?: number | null;
  managerName?: string | null;
  note?: string | null;
  useYn?: boolean | null;
  dcrClassTreeId?: number | null;
  dcrClassTreeName?: string | null;
  privateYn?: boolean | null;
  dailyYn?: boolean | null;
  classId?: number | null;
  className?: string | null;
  deadlineName?: string | null;
  deadlineFullName?: string | null;
  shareOrgName?: string | null;
  sharePersonName?: string | null;
  icsClassTreeName?: string | null;
  privateYnName?: string | null;
  dailyYnName?: string | null;
  alarmInfo?: string | null;
}

/** 담당자 변경 창의 일정 (O01, sch01_info.selectByManagerId) */
export interface Sch01InfoManager {
  infoId: number;
  companyId?: number | null;
  title?: string | null;
  content?: string | null;
  report?: string | null;
  managerId?: number | null;
  note?: string | null;
  useYn?: boolean | null;
  dcrClassTreeId?: number | null;
  privateYn?: boolean | null;
  dailyYn?: boolean | null;
  classId?: number | null;
  className?: string | null;
}

/** 업무일정 조회 조건 (Sch01_Tab_Info.retrieve) */
export interface Sch01InfoSearch {
  classId?: number | null;
  cycleCode: string;
  searchText: string;
  dailyYn: boolean;
  useYn: boolean;
}

/** 업무일정 저장 (Sch01_Lookup_Info.update — 편집기가 바꾸는 열) */
export interface Sch01InfoSave {
  classId?: number | null;
  title?: string | null;
  content?: string | null;
  dailyYn: boolean;
  privateYn: boolean;
  useYn: boolean;
}

/** 알람설정 (O01, AS-IS Sch06_AlarmModel). 새 행은 alarmId ≤ 0 */
export interface Sch06Alarm {
  alarmId: number;
  companyId?: number | null;
  targetCode?: string | null;
  targetId?: number | null;
  alarmType?: string | null;
  dayWeekCode?: string | null;
  dayWeekName?: string | null;
  num?: number | null;
  befAftCode?: string | null;
  befAftName?: string | null;
  amPmCode?: string | null;
  amPmName?: string | null;
  hourCode?: string | null;
  hourName?: string | null;
  minuteCode?: string | null;
  minuteName?: string | null;
  holidayCode?: string | null;
  holidayName?: string | null;
  useYn?: boolean | null;
}

/** 스케줄분류 (O01, AS-IS Sch08_ClassModel). 새 행은 classId ≤ 0 */
export interface Sch08Class {
  classId: number;
  personId?: number | null;
  className?: string | null;
  seq?: number | null;
  useYn?: boolean | null;
  note?: string | null;
}

/** 분류 콤보 (sys09_code.selectScheduleClass) */
export interface Sch08ClassCombo {
  code: string;
  name: string;
}

/** 기간별 업무일정 조회 조건 (AS-IS Sch01_Tab_List.retrieve). shareType: 전체 '%'·나의 스케줄 '1'·공유 스케줄 '2', cycleCode 전체 '%' */
export interface Sch01PeriodSearch {
  startDate: string;
  endDate: string;
  classId: number | null;
  shareType: string;
  cycleCode: string;
  dailyYn: boolean;
  searchText: string;
}

/** 기간별 업무일정 한 행 (AS-IS Sch01_InfoModel — sch01_info.selectByCloseDate). infoId는 SQL의 ROW_NUMBER, 실제 일정 ID는 realInfoId (classId 0이면 공모주 ID) */
export interface Sch01Period {
  infoId: number;
  realInfoId?: number | null;
  closeDate?: string | null;
  manageDate?: string | null;
  className?: string | null;
  title?: string | null;
  contentLimit?: string | null;
  content?: string | null;
  deadlineName?: string | null;
  deadlineId?: number | null;
  statusName?: string | null;
  personName?: string | null;
  note?: string | null;
  classId?: number | null;
  managerId?: number | null;
  managerName?: string | null;
  personId?: number | null;
  orgName?: string | null;
  companyId?: number | null;
  /** 등록자 열 — 원본 모델에는 있지만 SQL이 채우지 않아 항상 빈 칸 */
  managerOrgInfo?: string | null;
}

/** 업무일정 처리 조회 조건 (AS-IS Sch04_Tab_ToDoList.retrieve). manageCheck: 처리일 기준(false면 마감일), statusCode 전체 '%', classId 전체 null */
export interface Sch04TodoSearch {
  startDate: string;
  manageCheck: boolean;
  exceptYn: boolean;
  cancelYn: boolean;
  statusCode: string;
  classId: number | null;
}

/** 업무일정 처리 한 행 (AS-IS Sch04_ListModel — sch04_list.selectByManagerId). listId는 저장된 행이면 sch04_list_id, 아직 처리하지 않은 일정이면 임시 번호. scheduleCode '1' 업무일정·'5' 공모주 */
export interface Sch04Todo {
  listId: number;
  closeDate?: string | null;
  manageDate?: string | null;
  scheduleCode?: string | null;
  infoId?: number | null;
  cycleCode?: string | null;
  title?: string | null;
  mngOrgId?: number | null;
  managerId?: number | null;
  personId?: number | null;
  statusCode?: string | null;
  note?: string | null;
  companyId?: number | null;
  deadlineId?: number | null;
  cycleName?: string | null;
  statusName?: string | null;
  managerName?: string | null;
  personName?: string | null;
  className?: string | null;
}

/** 데일리 체크리스트 조회 조건 (AS-IS Sch04_Tab_DailyCheckList.retrieve). classId 전체 null, searchText 없으면 전체 */
export interface Sch04DailyCheckSearch {
  startDate: string;
  classId: number | null;
  searchText: string;
}

/**
 * 데일리 체크리스트 한 행 (AS-IS Sch04_ListModel — 데일리 체크). listId는 저장된 행이면 sch04_list_id, 아직 처리하지 않은 일정이면 임시 번호.
 * statusCode '1' 처리완료·'5' 해당없음(체크 열 yes/not은 이 값에서 나온다). apprStatusCode 10·20·30이면 상신 중이라 고칠 수 없다
 */
export interface Sch04DailyCheck {
  listId: number;
  closeDate?: string | null;
  manageDate?: string | null;
  scheduleCode?: string | null;
  infoId?: number | null;
  cycleCode?: string | null;
  title?: string | null;
  mngOrgId?: number | null;
  managerId?: number | null;
  personId?: number | null;
  statusCode?: string | null;
  note?: string | null;
  companyId?: number | null;
  deadlineId?: number | null;
  className?: string | null;
  apprId?: number | null;
  apprStatusCode?: string | null;
  apprStatusName?: string | null;
  /** 체크 열(AS-IS 모델의 계산 getter getYes/getNot) — 서버가 주지 않고 화면이 statusCode에서 만든다 */
  yes?: boolean;
  not?: boolean;
}

/** 업무일정 체크내역 조회 조건 (AS-IS Sch04_Tab_DailyCheckListStatus.retrieve). statusCode 전체 '%', classId 전체 null */
export interface Sch04CheckStatusSearch {
  startDate: string;
  endDate: string;
  statusCode: string;
  classId: number | null;
  searchText: string;
}

/** 업무일정 체크내역 한 행 (AS-IS Sch04_ListModel — sch04_list.selectCheckListStatus). scheduleCode '1' 업무일정·'5' 공모주, apprId가 없으면 상신 문서 없음 */
export interface Sch04CheckStatus {
  listId: number;
  manageDate?: string | null;
  closeDate?: string | null;
  className?: string | null;
  title?: string | null;
  scheduleCode?: string | null;
  infoId?: number | null;
  deadlineId?: number | null;
  statusName?: string | null;
  note?: string | null;
  apprId?: number | null;
  apprStatusName?: string | null;
}

/** 부서별 업무일정 조회 조건 (AS-IS Sch01_Tab_ListOrg.retrieve). cycleCode 전체 '%' */
export interface Sch01OrgSearch {
  orgId: number;
  subOrgYn: boolean;
  startDate: string;
  endDate: string;
  cycleCode: string;
  dailyYn: boolean;
  searchText: string;
}

/** 부서별 업무일정 한 행 (AS-IS Sch01_InfoModel — sch01_info.selectByOrg). infoId는 SQL의 ROW_NUMBER, 실제 일정 ID는 realInfoId (classId 0이면 공모주 ID) */
export interface Sch01Org {
  infoId: number;
  realInfoId?: number | null;
  closeDate?: string | null;
  manageDate?: string | null;
  className?: string | null;
  title?: string | null;
  content?: string | null;
  deadlineName?: string | null;
  deadlineId?: number | null;
  statusName?: string | null;
  personName?: string | null;
  note?: string | null;
  classId?: number | null;
  managerId?: number | null;
  managerName?: string | null;
  personId?: number | null;
  orgName?: string | null;
  companyId?: number | null;
  /** 등록자 열 — 원본 모델에는 있지만 SQL이 채우지 않아 항상 빈 칸 */
  managerOrgInfo?: string | null;
}

/** 업무일정 보기 창 (AS-IS Sch01_Lookup_InfoView — sch01_info.selectByDeadLineId) */
export interface Sch01InfoView {
  infoId: number;
  className?: string | null;
  title?: string | null;
  content?: string | null;
  report?: string | null;
  deadlineName?: string | null;
  note?: string | null;
}
