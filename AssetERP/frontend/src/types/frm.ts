/** 알림 창의 건수 (AS-IS Frm01_ListModel cnt1~cnt5): 미결재건·체크리스트·공지사항·알림함·매매승인 */
export interface FrmNoticeCnt {
  cnt1: number;
  cnt2: number;
  cnt3: number;
  cnt4: number;
  cnt5: number;
}

/** 미결재건 창 한 행 (AS-IS Apr01_ApprModel 중 regDate·title·regEmpName — EE56) */
export interface FrmOutstanding {
  apprId: number;
  regDate: string;
  title: string;
  regEmpName: string;
}

/** 알림함 한 행 (AS-IS Sms10_AlarmHistoryModel — EE57). sendTimeStr = 'YYYY-MM-DD HH:mm:ss' */
export interface FrmAlarmHistory {
  alarmHistoryId: number;
  sendTimeStr: string;
  targetPersonName: string;
  content: string;
  sendYn: boolean;
}

/** 실시간 접속현황 한 행 (AS-IS Sys28_LoginRealTimeModel — EE58) */
export interface FrmLoginRealTime {
  loginRealTimeId: number;
  loginTimeStr: string;
  ipAddress: string;
}

/** MyPage 전자결재 박스 미결함 한 행 (AS-IS apr01_appr.selectOutstanding — Monitoring_Page_Appr.buildGrid01) */
export interface FrmMonitorOutstanding {
  apprId: number;
  statusName: string;
  regDate: string;
  title: string;
  regEmpName: string;
}

/** MyPage 전자결재 박스 결재요청함 한 행 (AS-IS apr01_appr.selectMonitorngAppr — buildGrid02) */
export interface FrmMonitorRequest {
  apprId: number;
  statusName: string;
  regDate: string;
  title: string;
  nextApprName: string;
}

/** MyPage 전자결재 박스 임시저장함 한 행 (AS-IS apr01_appr.selectTemporary — buildGrid03) */
export interface FrmMonitorTemporary {
  apprId: number;
  regDate: string;
  title: string;
  statusCode: string;
}

/** MyPage 법규보고공시 및 내규정보 한 행 (AS-IS frm01_list.selectIcsNotice — Monitoring_Page_IcsNotice) */
export interface FrmIcsNotice {
  listId: number;
  title: string;
  todoTitle: string;
  date: string;
  bizNoticeName: string;
  bizNoticeCode: string;
  relateId: number;
  companyId: number;
  deadlineId: number | null;
  scheduleCode: string;
}

/** MyPage Day List 한 행 (AS-IS frm01_list.selectToDoList — Monitoring_Page_DayList) */
export interface FrmToDo {
  listId: number;
  title: string;
  todoTitle: string;
  date: string | null;
  closeDate: string | null;
  bizNoticeCode: string;
  bizNoticeName: string;
  personName: string;
  relateId: number | null;
  companyId: number;
  deadlineId: number | null;
  scheduleCode: string | null;
}

/** MyPage 일정 박스 나의일정 (AS-IS sch01_info.selectMyPageSchedule) */
export interface FrmRelateMySchedule {
  rowId: number;
  className: string | null;
  title: string;
  managerName: string;
  closeDate: string | null;
  manageDate: string | null;
  deadlineId: number | null;
  realInfoId: number;
}

/** MyPage 일정 박스 부서일정 (AS-IS sch01_info.selectMyPageOrgSchedule) */
export interface FrmRelateOrgSchedule {
  rowId: number;
  orgName: string;
  className: string | null;
  title: string;
  closeDate: string | null;
  deadlineId: number | null;
  realInfoId: number;
}

/** MyPage 일정 박스 알림 (AS-IS bbs02_notice.selectPersonNotice). noticeType 10010 공지 · 10020 메세지 · 10030 공모주 · 10040~10070 · 10080/10081 화환 */
export interface FrmRelateNotice {
  rowId: number;
  noticeId: number | null;
  noticeType: string;
  noticeTypeName: string;
  title: string;
  notice: string | null;
  realNoticeId: number | null;
}

/** MyPage 일정 박스 자리비움 (AS-IS emp20_leave.selectByDate) */
export interface FrmRelateLeave {
  rowId: number;
  leaveId: number;
  leaveCode: string;
  personName: string;
  leaveName: string;
  stdPeriod: string;
}

/** MyPage 일정 박스 예약 (AS-IS mrb01_booking.selectByBookingDate). type 12010 회의실 / 12020 공용차량 */
export interface FrmRelateBooking {
  rowId: number;
  bookingId: number;
  empId: number;
  empName: string;
  content: string;
  attendance: string | null;
  bookingDate: string;
  time: string;
  type: string;
  typeName: string;
}

/** MyPage 달력 일정 하나 (AS-IS JsonCalendar JSON). title = 보이는 글(예 "나의일정(0/4)"·"부서일정3건"), kind = 업무구분 이름 */
export interface FrmCalendarEvent {
  date: string;
  title: string;
  kind: string;
  color: string;
  textColor: string;
}

/** MyPage 현황판 한 사람 (AS-IS emp03_trans.MonitoringByText). locationCode 10 온라인 · 20 오프라인 · 30 휴가 · 11~38 섞임(아이콘) */
export interface FrmMonitorEmp {
  personId: number;
  empNo: string | null;
  emailAddress: string | null;
  mobileTelNo: string | null;
  officeTelNo: string | null;
  officeDetail: string | null;
  parentFullName: string | null;
  personIdString: string;
  monitoringName: string;
  locationName: string | null;
  locationCode: string | null;
}
