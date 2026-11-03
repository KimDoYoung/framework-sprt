import { apiClient } from './client';
import { ApiResponse } from '../types/auth';
import { MrbBooking, MrbBookingTimeline } from '../types/mrb';

/** mrb(회의실 예약관리) 화면 API (EE14~) */
export const mrbApi = {
  /** AS-IS mrb.Mrb01_Booking.selectByList — 오늘 이후 예약현황 */
  searchBookingList: async (): Promise<MrbBooking[]> => {
    const res = await apiClient.get<ApiResponse<MrbBooking[]>>('v1/mrb/bookings/list');
    return res.data.data ?? [];
  },

  /** AS-IS mrb.Mrb01_Booking.selectByYearMonth — 그 달에 예약이 있는 날(yyyy-MM-dd) */
  searchMarkedDates: async (yyyyMM: string): Promise<string[]> => {
    const res = await apiClient.get<ApiResponse<string[]>>('v1/mrb/bookings/marked-dates', { params: { yyyyMM } });
    return res.data.data ?? [];
  },

  /** AS-IS mrb.Mrb01_Booking.selectByDate — type 'all' / 'my' */
  searchBookings: async (p: { date: string; type: 'all' | 'my' }): Promise<MrbBooking[]> => {
    const res = await apiClient.get<ApiResponse<MrbBooking[]>>('v1/mrb/bookings', { params: p });
    return res.data.data ?? [];
  },

  /** AS-IS mrb.Mrb01_Booking.selectByDateUnion — 예약 팝업의 시간막대 */
  searchBookingTimeline: async (date: string): Promise<MrbBookingTimeline[]> => {
    const res = await apiClient.get<ApiResponse<MrbBookingTimeline[]>>('v1/mrb/bookings/timeline', { params: { date } });
    return res.data.data ?? [];
  },

  /** AS-IS getSeq — 새 예약 창이 첨부파일을 올리기 전에 받는 번호. DB에는 쓰지 않는다 */
  nextBookingId: async (): Promise<number> => {
    const res = await apiClient.get<ApiResponse<number>>('v1/mrb/bookings/next-id');
    return res.data.data as number;
  },

  /** AS-IS mrb.Mrb01_Booking.update / updateList — 서버가 종료일에 따라 고른다 */
  saveBooking: async (row: MrbBooking, changeUpdate: boolean): Promise<MrbBooking> => {
    const res = await apiClient.put<ApiResponse<MrbBooking>>('v1/mrb/bookings', { ...row, changeUpdate });
    return res.data.data as MrbBooking;
  },

  /** AS-IS mrb.Mrb01_Booking.delete / deleteList(withChildren: 첫 행의 하위 예약도 지운다) */
  deleteBookings: async (ids: number[], withChildren = false): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/mrb/bookings', { data: ids, params: { withChildren } });
    return res.data.data ?? 0;
  },
};
