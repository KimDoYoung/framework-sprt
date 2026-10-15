import { apiClient } from './client';
import { ApiResponse } from '../types/auth';
import { SmsHistory, SmsHistoryMonth, SmsHistoryTotal, SmsHistoryYear } from '../types/sms';

/** 문자(sms) 화면 API (C05~) */
export const smsApi = {
  // ── C05 고객별 문자사용량 (Sms02_Tab_TotalCount) ──

  /** AS-IS sms.Sms02_History.selectByTotalCount: 고객별 누적 사용건수 (useYn = 사용고객만) */
  searchHistoryTotals: async (useYn: boolean): Promise<SmsHistoryTotal[]> => {
    const res = await apiClient.get<ApiResponse<SmsHistoryTotal[]>>('v1/sms/history-totals', { params: { useYn } });
    return res.data.data ?? [];
  },

  /** AS-IS sms.Sms02_History.selectByTotalCountYear: 서브도메인의 연도별 */
  searchHistoryYears: async (locName: string): Promise<SmsHistoryYear[]> => {
    const res = await apiClient.get<ApiResponse<SmsHistoryYear[]>>('v1/sms/history-totals/years', { params: { locName } });
    return res.data.data ?? [];
  },

  /** AS-IS sms.Sms02_History.selectByTotalCountMonth: 서브도메인·연도의 월별 */
  searchHistoryMonths: async (locName: string, year: string): Promise<SmsHistoryMonth[]> => {
    const res = await apiClient.get<ApiResponse<SmsHistoryMonth[]>>('v1/sms/history-totals/months', { params: { locName, year } });
    return res.data.data ?? [];
  },

  /** AS-IS sms.Sms02_History.selectByDate: 발신기록 최근 300건 (기간 'yyyy-MM-dd', 내용 LIKE) */
  searchHistories: async (companyId: number, startDate: string, closeDate: string, searchText: string): Promise<SmsHistory[]> => {
    const res = await apiClient.get<ApiResponse<SmsHistory[]>>('v1/sms/histories', { params: { companyId, startDate, closeDate, searchText } });
    return res.data.data ?? [];
  },
};
