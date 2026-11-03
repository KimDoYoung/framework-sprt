/** 회의실 예약 한 행 (AS-IS Mrb01_BookingModel, mrb01_booking) */
export interface MrbBooking {
  bookingId?: number | null;
  empId?: number | null;
  subject?: string | null;
  roomCd?: string | null;
  bookingDate?: string | null;
  bookingCloseDate?: string | null;
  startHour?: string | null;
  startMin?: string | null;
  closeHour?: string | null;
  closeMin?: string | null;
  attendance?: string | null;
  forwarding?: string | null;
  parentId?: number | null;
  empNm?: string | null;
  roomNm?: string | null;
  /** selectByList의 '08:00 ~ 12:00' */
  time?: string | null;
  /** 날짜별 그리드 예약시간 열(AS-IS getDateText) — 화면에서 valueGetter로 채운다 */
  dateText?: string | null;
}

/** 시간막대 한 행 (AS-IS selectByDateUnion) — startTime·closeTime은 'yyyy-MM-dd HH:mm:ss' */
export interface MrbBookingTimeline {
  bookingId: number;
  empId: number;
  roomCd: string;
  bookingDate: string;
  empNm: string;
  subject: string;
  roomNm: string;
  startTime: string;
  closeTime: string;
}
