import { apiClient } from './client';
import { ApiResponse } from '../types/auth';
import { FrmAlarmHistory, FrmCalendarEvent, FrmIcsNotice, FrmLoginRealTime, FrmMonitorEmp, FrmMonitorOutstanding, FrmMonitorRequest, FrmMonitorTemporary, FrmNoticeCnt, FrmOutstanding, FrmRelateBooking, FrmRelateLeave, FrmRelateMySchedule, FrmRelateNotice, FrmRelateOrgSchedule, FrmToDo } from '../types/frm';
import { MktHistory } from '../types/mkt';

/** frm(프레임) 화면 API (EE53~) */
export const frmApi = {
  /** AS-IS frm.Frm01_List.getNoticeCnt — 미결재건·체크리스트·공지사항·알림함·매매승인 건수 */
  getNoticeCnt: async (): Promise<FrmNoticeCnt> => {
    const res = await apiClient.get<ApiResponse<FrmNoticeCnt>>('v1/frm/lists/notice-count');
    return res.data.data as FrmNoticeCnt;
  },

  /** AS-IS apr.Apr01_Appr.selectOutstandingPopup — 미결재건 창 (EE56) */
  searchOutstanding: async (): Promise<FrmOutstanding[]> => {
    const res = await apiClient.get<ApiResponse<FrmOutstanding[]>>('v1/apr/outstandings');
    return res.data.data ?? [];
  },

  /** AS-IS sms.Sms10_AlarmHistory.selectByText — 알림함 창 (EE57). inOutYn 'in' 수신 / 'out' 발신 */
  searchAlarmHistories: async (inOutYn: 'in' | 'out', searchText: string, startDate: string, closeDate: string): Promise<FrmAlarmHistory[]> => {
    const res = await apiClient.get<ApiResponse<FrmAlarmHistory[]>>('v1/sms/alarm-histories', { params: { inOutYn, searchText, startDate, closeDate } });
    return res.data.data ?? [];
  },

  /** AS-IS sys.Sys28_LoginRealTime.selectByDate — 실시간 접속현황 창 (EE58) */
  searchLoginRealTimes: async (): Promise<FrmLoginRealTime[]> => {
    const res = await apiClient.get<ApiResponse<FrmLoginRealTime[]>>('v1/sys/login-real-times');
    return res.data.data ?? [];
  },

  /** AS-IS sys.Sys28_LoginRealTime.updateIpAddress — 접속 IP의 접속 시각 갱신 (로그인 직후 + 2분마다) */
  updateLoginRealTime: async (): Promise<void> => {
    await apiClient.post('v1/sys/login-real-times');
  },

  /** AS-IS apr.Apr01_Appr.selectOutstanding — MyPage 전자결재 박스 미결함 */
  searchMonitorOutstandings: async (): Promise<FrmMonitorOutstanding[]> => {
    const res = await apiClient.get<ApiResponse<FrmMonitorOutstanding[]>>('v1/apr/monitors/outstandings');
    return res.data.data ?? [];
  },

  /** AS-IS apr.Apr01_Appr.selectMonitorngAppr — MyPage 전자결재 박스 결재요청함 */
  searchMonitorRequests: async (): Promise<FrmMonitorRequest[]> => {
    const res = await apiClient.get<ApiResponse<FrmMonitorRequest[]>>('v1/apr/monitors/requests');
    return res.data.data ?? [];
  },

  /** AS-IS apr.Apr01_Appr.selectTemporary — MyPage 전자결재 박스 임시저장함 */
  searchMonitorTemporaries: async (): Promise<FrmMonitorTemporary[]> => {
    const res = await apiClient.get<ApiResponse<FrmMonitorTemporary[]>>('v1/apr/monitors/temporaries');
    return res.data.data ?? [];
  },

  /** AS-IS frm.Frm01_List.selectIcsNotice — MyPage 법규보고공시 및 내규정보. selectDate 'YYYY-MM-DD'(없으면 서버 오늘) */
  searchIcsNotices: async (selectDate?: string): Promise<FrmIcsNotice[]> => {
    const res = await apiClient.get<ApiResponse<FrmIcsNotice[]>>('v1/frm/lists/ics-notices', { params: { selectDate } });
    return res.data.data ?? [];
  },

  /** AS-IS frm.Frm01_List.selectToDoList — MyPage Day List. selectDate 'YYYY-MM-DD'(없으면 서버 오늘) */
  searchToDos: async (selectDate?: string): Promise<FrmToDo[]> => {
    const res = await apiClient.get<ApiResponse<FrmToDo[]>>('v1/frm/lists/todos', { params: { selectDate } });
    return res.data.data ?? [];
  },

  /** MyPage 일정 박스(Monitoring_Page_Relate) 탭 조회 — stdDate 'YYYY-MM-DD'(없으면 서버 오늘) */
  /** AS-IS sch.Sch01_Info.selectMyPageSchedule — 나의일정 */
  searchRelateMySchedules: async (stdDate?: string): Promise<FrmRelateMySchedule[]> => {
    const res = await apiClient.get<ApiResponse<FrmRelateMySchedule[]>>('v1/frm/relates/my-schedules', { params: { stdDate } });
    return res.data.data ?? [];
  },
  /** AS-IS sch.Sch01_Info.selectMyPageOrgSchedule — 부서일정 */
  searchRelateOrgSchedules: async (stdDate?: string): Promise<FrmRelateOrgSchedule[]> => {
    const res = await apiClient.get<ApiResponse<FrmRelateOrgSchedule[]>>('v1/frm/relates/org-schedules', { params: { stdDate } });
    return res.data.data ?? [];
  },
  /** AS-IS mkt.Mkt03_History.selectByRegDate — 업무활동 */
  searchRelateHistories: async (stdDate?: string): Promise<MktHistory[]> => {
    const res = await apiClient.get<ApiResponse<MktHistory[]>>('v1/frm/relates/histories', { params: { stdDate } });
    return res.data.data ?? [];
  },
  /** AS-IS bbs.Bbs02_Notice.selectPersonNotice — 알림 */
  searchRelateNotices: async (stdDate?: string): Promise<FrmRelateNotice[]> => {
    const res = await apiClient.get<ApiResponse<FrmRelateNotice[]>>('v1/frm/relates/notices', { params: { stdDate } });
    return res.data.data ?? [];
  },
  /** AS-IS emp.Emp20_Leave.selectByDate(shareCheck=true) — 자리비움 */
  searchRelateLeaves: async (stdDate?: string): Promise<FrmRelateLeave[]> => {
    const res = await apiClient.get<ApiResponse<FrmRelateLeave[]>>('v1/frm/relates/leaves', { params: { stdDate } });
    return res.data.data ?? [];
  },
  /** AS-IS mrb.Mrb01_Booking.selectByBookingDate — 예약(회의실·공용차량) */
  searchRelateBookings: async (stdDate?: string): Promise<FrmRelateBooking[]> => {
    const res = await apiClient.get<ApiResponse<FrmRelateBooking[]>>('v1/frm/relates/bookings', { params: { stdDate } });
    return res.data.data ?? [];
  },

  /** AS-IS JsonProvider mode=calendar (JsonCalendar → frm01_list.selectCalendar) — MyPage 달력. 'YYYY-MM-DD' 기간(보이는 달) */
  searchCalendar: async (startDate: string, closeDate: string): Promise<FrmCalendarEvent[]> => {
    const res = await apiClient.get<ApiResponse<FrmCalendarEvent[]>>('v1/frm/lists/calendar', { params: { startDate, closeDate } });
    return res.data.data ?? [];
  },

  /** AS-IS emp.Emp03_Trans.MonitoringByText — MyPage 현황판. searchText는 글자만(서버가 %로 감싼다) */
  searchMonitorEmps: async (searchText?: string): Promise<FrmMonitorEmp[]> => {
    const res = await apiClient.get<ApiResponse<FrmMonitorEmp[]>>('v1/frm/lists/emps', { params: { searchText } });
    return res.data.data ?? [];
  },
};
