import { apiClient } from './client';
import { readBlobError } from './file';
import { ApiResponse } from '../types/auth';
import { CarAdminBookingReq, CarBooking, CarBookingJournalReq, CarBookingTimeline, CarInfo, CarJournal, CarJournalDateCheck, CarPublicAdminJournal, CarPublicJournal, CarUser } from '../types/car';

/** car(차량관리) 화면 API (T10~) */
export const carApi = {
  // ── T10 차량정보관리 (Car01_Tab_Info) ──

  /** AS-IS car.Car01_Info.selectByCompanyId — carType '%'는 전체 */
  searchInfos: async (p: { carType: string; searchText: string }): Promise<CarInfo[]> => {
    const res = await apiClient.get<ApiResponse<CarInfo[]>>('v1/car/infos', { params: p });
    return res.data.data ?? [];
  },

  /** AS-IS car.Car01_Info.update → 저장된 행. 새 행은 infoId ≤ 0 */
  saveInfo: async (row: CarInfo): Promise<CarInfo> => {
    const body = { ...row, infoId: row.infoId > 0 ? row.infoId : null };
    const res = await apiClient.put<ApiResponse<CarInfo>>('v1/car/infos', body);
    return res.data.data as CarInfo;
  },

  /** AS-IS car.Car01_Info.delete — 사용내역(예약)이 있으면 서버가 거절한다 → 지운 건수 */
  deleteInfos: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/car/infos', { data: ids });
    return res.data.data ?? 0;
  },

  /** AS-IS car.Car02_User.selectByInfoId */
  searchUsers: async (infoId: number): Promise<CarUser[]> => {
    const res = await apiClient.get<ApiResponse<CarUser[]>>('v1/car/users', { params: { infoId } });
    return res.data.data ?? [];
  },

  /** AS-IS car.Car02_User.update → 저장된 행(요청 순서). 새 행은 userId ≤ 0 */
  saveUsers: async (rows: CarUser[]): Promise<CarUser[]> => {
    const body = rows.map(r => ({ userId: r.userId > 0 ? r.userId : null, infoId: r.infoId, personId: r.personId, startDate: r.startDate, closeDate: r.closeDate }));
    const res = await apiClient.put<ApiResponse<CarUser[]>>('v1/car/users', body);
    return res.data.data ?? [];
  },

  /** AS-IS car.Car02_User.delete → 지운 건수 */
  deleteUsers: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/car/users', { data: ids });
    return res.data.data ?? 0;
  },

  // ── Car01_Lookup_Info 차량 찾기 (T11~) ──

  /** AS-IS car.Car01_Info.selectByCarType(admin이면 selectByCarTypeAdmin) — stdMonth 'YYYY.MM' */
  searchLookupInfos: async (p: { carType: string; stdMonth?: string; searchText: string; admin: boolean }): Promise<CarInfo[]> => {
    const res = await apiClient.get<ApiResponse<CarInfo[]>>('v1/car/infos/lookup', { params: p });
    return res.data.data ?? [];
  },

  // ── T11 전용차량 운행등록 (Car04_Tab_PrivateJournal) ──

  /** AS-IS car.Car04_Journal.selectByPrivateJournal — stdMonth 'YYYY.MM' */
  searchJournals: async (p: { infoId: number; stdMonth: string }): Promise<CarJournal[]> => {
    const res = await apiClient.get<ApiResponse<CarJournal[]>>('v1/car/journals', { params: p });
    return res.data.data ?? [];
  },

  /** AS-IS Car04_Lookup_PrivateJournal 사용일자 검사 (마감·확정·중복·주행 전 계기판) */
  checkJournalDate: async (p: { infoId: number; date: string }): Promise<CarJournalDateCheck> => {
    const res = await apiClient.get<ApiResponse<CarJournalDateCheck>>('v1/car/journals/date-check', { params: p });
    return res.data.data as CarJournalDateCheck;
  },

  /** AS-IS car.Car04_Journal.modelUpdate → 저장된 행. 주행 전·후 계기판은 보내지 않는다 */
  saveJournal: async (row: CarJournal): Promise<CarJournal> => {
    const body = {
      journalId: row.journalId, infoId: row.infoId, date: row.date, personId: row.personId, mileage: row.mileage,
      commuteMileage: row.commuteMileage, bizMileage: row.bizMileage, unBizMileage: row.unBizMileage,
      destination: row.destination, reason: row.reason, note: row.note, bookingId: row.bookingId,
    };
    const res = await apiClient.put<ApiResponse<CarJournal>>('v1/car/journals', body);
    return res.data.data as CarJournal;
  },

  /** AS-IS car.Car04_Journal.update — 그 기준년월 일지 전부를 확정(true)·확정취소(false) → 바꾼 건수 */
  fixJournals: async (p: { infoId: number; stdMonth: string; fixYn: boolean }): Promise<number> => {
    const res = await apiClient.put<ApiResponse<number>>('v1/car/journals/fix', p);
    return res.data.data ?? 0;
  },

  /** AS-IS car.Car04_Journal.delete → 지운 건수 */
  deleteJournals: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/car/journals', { data: ids });
    return res.data.data ?? 0;
  },

  // ── T12 전용차량 운행변경(경영관리팀) (Car04_Tab_PrivateJournalAdmin) ──

  /** AS-IS car.Car04_Journal.batch (일괄생성) — 그 달 작업일마다 같은 내용으로 만든다 → 만든 건수 */
  batchJournals: async (req: { infoId: number; stdMonth: string; mileage?: number | null; unBizMileage?: number | null; commuteMileage?: number | null; bizMileage?: number | null; destination?: string | null; reason?: string | null }): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>('v1/car/journals/batch', req);
    return res.data.data ?? 0;
  },

  /** 템플릿 받기 (AS-IS downloadForm → ./excelTemplete/Template_차량운행등록.xlsx) */
  downloadJournalTemplate: async (): Promise<void> => {
    try {
      const res = await apiClient.get<Blob>('v1/car/journals/template', { responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Template_차량운행등록.xlsx';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      throw await readBlobError(err);
    }
  },

  /** 엑셀업로드 (AS-IS ExcelUpload?uploadType=carUpload&personId&infoId) → 등록한 건수 */
  uploadJournalsExcel: async (personId: number, infoId: number, file: File): Promise<number> => {
    const form = new FormData();
    form.append('excelUpload', file);
    const res = await apiClient.post<ApiResponse<number>>('v1/car/journals/excel', form, {
      params: { personId, infoId },
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data ?? 0;
  },

  // ── T13 공용차량 예약관리 (Car03_Tab_List) ──

  /** AS-IS car.Car03_Booking.selectByList — 오늘 이후 예약현황 */
  searchBookingList: async (): Promise<CarBooking[]> => {
    const res = await apiClient.get<ApiResponse<CarBooking[]>>('v1/car/bookings/list');
    return res.data.data ?? [];
  },

  /** AS-IS car.Car03_Booking.selectByDate — type 'all' / 'my' */
  searchBookings: async (p: { date: string; type: 'all' | 'my' }): Promise<CarBooking[]> => {
    const res = await apiClient.get<ApiResponse<CarBooking[]>>('v1/car/bookings', { params: p });
    return res.data.data ?? [];
  },

  /** AS-IS car.Car03_Booking.selectByDateUnion — 예약 팝업의 시간막대 */
  searchBookingTimeline: async (date: string): Promise<CarBookingTimeline[]> => {
    const res = await apiClient.get<ApiResponse<CarBookingTimeline[]>>('v1/car/bookings/timeline', { params: { date } });
    return res.data.data ?? [];
  },

  /** AS-IS car.Car03_Booking.update / updateList — 서버가 종료일에 따라 고른다. 새 예약은 bookingId 없음 */
  saveBooking: async (row: CarBooking, changeUpdate: boolean): Promise<CarBooking> => {
    const res = await apiClient.put<ApiResponse<CarBooking>>('v1/car/bookings', { ...row, changeUpdate });
    return res.data.data as CarBooking;
  },

  /** AS-IS car.Car03_Booking.delete / deleteList(withChildren: 첫 행의 하위 예약도 지운다) */
  deleteBookings: async (ids: number[], withChildren = false): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/car/bookings', { data: ids, params: { withChildren } });
    return res.data.data ?? 0;
  },

  // ── T14 공용차량 운행등록 (Car04_Tab_PublicJournal) ──

  /** AS-IS car.Car04_Journal.selectByPublicJournal — 공용차량 예약 기준(일지 없는 예약도 나온다). infoId 없으면 전체 차량, stdMonth 'YYYY.MM' */
  searchPublicJournals: async (p: { infoId?: number | null; stdMonth: string }): Promise<CarPublicJournal[]> => {
    const res = await apiClient.get<ApiResponse<CarPublicJournal[]>>('v1/car/journals/public', { params: { stdMonth: p.stdMonth, ...(p.infoId != null ? { infoId: p.infoId } : {}) } });
    return res.data.data ?? [];
  },

  /** AS-IS car.Car04_Journal.checkBookingId — 그 예약의 일지가 이미 있는가 */
  checkJournalBooking: async (bookingId: number): Promise<boolean> => {
    const res = await apiClient.get<ApiResponse<boolean>>('v1/car/journals/booking-check', { params: { bookingId } });
    return res.data.data === true;
  },

  /** AS-IS Car04_Tab_PublicJournal.confirmAll·cancelAll — 내 몫의 그 기준년월 행을 확정(true)·확정취소(false) → 바꾼 건수 */
  fixPublicJournals: async (p: { infoId?: number | null; stdMonth: string; fixYn: boolean }): Promise<number> => {
    const res = await apiClient.put<ApiResponse<number>>('v1/car/journals/public-fix', p);
    return res.data.data ?? 0;
  },

  // ── T15 공용차량 운행변경(경영관리팀) (Car04_Tab_PublicJournalAdmin) ──

  /** AS-IS car.Car04_Journal.selectByPublicJournalAdmin — 로그인 회사 전체 사용자. infoId 없으면 전체 차량, searchText는 요일/사용자/행선지/목적 */
  searchPublicAdminJournals: async (p: { infoId?: number | null; stdMonth: string; searchText: string }): Promise<CarPublicAdminJournal[]> => {
    const res = await apiClient.get<ApiResponse<CarPublicAdminJournal[]>>('v1/car/journals/public-admin', {
      params: { stdMonth: p.stdMonth, searchText: p.searchText, ...(p.infoId != null ? { infoId: p.infoId } : {}) },
    });
    return res.data.data ?? [];
  },

  /** AS-IS Car04_Tab_PublicJournalAdmin.confirmAll·cancelAll — 보이는 조건의 행 전부를 확정(true)·확정취소(false) → 바꾼 건수 */
  fixPublicAdminJournals: async (p: { infoId?: number | null; stdMonth: string; searchText: string; fixYn: boolean }): Promise<number> => {
    const res = await apiClient.put<ApiResponse<number>>('v1/car/journals/public-admin-fix', p);
    return res.data.data ?? 0;
  },

  /** AS-IS car.Car03_Booking.updateAdmin / updateListAdmin — 예약과 운행일지를 날마다 함께 만든다 → 만든 건수 */
  createAdminBooking: async (req: CarAdminBookingReq): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>('v1/car/bookings/admin', req);
    return res.data.data ?? 0;
  },

  /** AS-IS car.Car03_Booking.updateJournalModel — 예약(시간·사용자·행선지·목적·참석자)과 운행일지를 함께 고친다 */
  updateBookingJournal: async (req: CarBookingJournalReq): Promise<CarBooking> => {
    const res = await apiClient.put<ApiResponse<CarBooking>>('v1/car/bookings/journal', req);
    return res.data.data as CarBooking;
  },

  /** AS-IS car.Car03_Booking.deleteByJournalList + car.Car04_Journal.delete — 예약과 그 일지를 함께 지운다 → 지운 예약 수 */
  deleteAdminBookings: async (bookingIds: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/car/bookings/admin', { data: bookingIds });
    return res.data.data ?? 0;
  },
};
