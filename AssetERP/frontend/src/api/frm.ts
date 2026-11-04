import { apiClient } from './client';
import { ApiResponse } from '../types/auth';
import { FrmAlarmHistory, FrmLoginRealTime, FrmNoticeCnt, FrmOutstanding } from '../types/frm';

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
};
