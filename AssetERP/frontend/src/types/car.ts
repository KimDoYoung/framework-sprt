/** 차량정보 한 행 (GET /api/v1/car/infos, AS-IS Car01_InfoModel). 새 행은 infoId ≤ 0 */
export interface CarInfo {
  infoId: number;
  carType?: string | null;
  carTypeNm?: string | null;
  carNo?: string | null;
  carNm?: string | null;
  carInfo?: string | null;
  note?: string | null;
  initMileage?: number | null;
  personNm?: string | null;
  startDate?: string | null;
}

/** 전용차량 사용자 한 행 (GET /api/v1/car/users, AS-IS Car02_UserModel). 새 행은 userId ≤ 0 */
export interface CarUser {
  userId: number;
  infoId?: number | null;
  personId?: number | null;
  personNm?: string | null;
  startDate?: string | null;
  closeDate?: string | null;
}

/** 운행일지 한 행 (GET /api/v1/car/journals, AS-IS Car04_JournalModel). 날짜는 'yyyy-MM-dd' */
export interface CarJournal {
  journalId?: number | null;
  companyId?: number | null;
  infoId?: number | null;
  date?: string | null;
  personId?: number | null;
  mileage?: number | null;
  beforeMileage?: number | null;
  afterMileage?: number | null;
  commuteMileage?: number | null;
  bizMileage?: number | null;
  unBizMileage?: number | null;
  destination?: string | null;
  reason?: string | null;
  note?: string | null;
  bookingId?: number | null;
  fixYn?: boolean | null;
  closeYn?: boolean | null;
  businessMileage?: number | null;
  infoNm?: string | null;
  infoPersonNm?: string | null;
  /** 그리드 확정여부 열(AS-IS getFixYnText) — 화면에서 valueGetter로 채운다 */
  fixYnText?: string | null;
}

/** 편집창 사용일자 검사 결과 — message가 있으면 알리고 [저장]을 끈다, 없으면 beforeMileage를 쓴다 */
export interface CarJournalDateCheck {
  message?: string | null;
  beforeMileage?: number | null;
}

/** 공용차량 예약 (AS-IS Car03_BookingModel) — 날짜는 'yyyy-MM-dd' */
export interface CarBooking {
  bookingId?: number | null;
  infoId?: number | null;
  personId?: number | null;
  startDate?: string | null;
  startHour?: string | null;
  startMin?: string | null;
  closeDate?: string | null;
  closeHour?: string | null;
  closeMin?: string | null;
  destination?: string | null;
  reason?: string | null;
  attendance?: string | null;
  note?: string | null;
  parentId?: number | null;
  regEmpId?: number | null;
  personNm?: string | null;
  infoNm?: string | null;
  /** selectByList의 '08:00 ~ 12:00' */
  time?: string | null;
  /** 날짜별 그리드 예약시간 열(AS-IS getDateText) — 화면에서 valueGetter로 채운다 */
  dateText?: string | null;
}

/** 시간막대 한 행 (AS-IS selectByDateUnion) — startTime·closeTime은 'yyyy-MM-dd HH:mm:ss' */
export interface CarBookingTimeline {
  bookingId: number;
  personId: number;
  infoId: number;
  startDate: string;
  personNm: string;
  destination: string;
  infoNm: string;
  startTime: string;
  closeTime: string;
}

/** 공용차량 운행일지 한 행 (AS-IS Car04_JournalModel, selectByPublicJournal) — infoNm = '차량번호 - 차량명', attendance = 예약 참석자 */
export interface CarPublicJournal extends CarJournal {
  attendance?: string | null;
}

/** 공용차량 운행변경(관리자) 조회 한 행 (AS-IS Car04_JournalModel, selectByPublicJournalAdmin) — datetime = 'yyyy-MM-dd HH:mm ~ HH:mm', weekName = 색 입힌 요일 HTML */
export interface CarPublicAdminJournal extends CarPublicJournal {
  datetime?: string | null;
  weekName?: string | null;
  personNm?: string | null;
  startHour?: string | null;
  startMin?: string | null;
  closeHour?: string | null;
  closeMin?: string | null;
}

/** [등록] — 예약과 운행일지를 함께 만든다 */
export interface CarAdminBookingReq {
  infoId: number;
  personId: number;
  startDate: string;
  closeDate: string;
  startHour: string;
  startMin: string;
  closeHour: string;
  closeMin: string;
  destination?: string | null;
  reason?: string | null;
  attendance?: string | null;
  mileage?: number | null;
  commuteMileage?: number | null;
  bizMileage?: number | null;
  unBizMileage?: number | null;
}

/** 변경 저장 — 예약과 운행일지를 함께 고친다 */
export interface CarBookingJournalReq {
  bookingId: number;
  journalId?: number | null;
  infoId: number;
  date: string;
  personId: number;
  startHour: string;
  startMin: string;
  closeHour: string;
  closeMin: string;
  mileage?: number | null;
  commuteMileage?: number | null;
  bizMileage?: number | null;
  unBizMileage?: number | null;
  destination?: string | null;
  reason?: string | null;
  attendance?: string | null;
  note?: string | null;
}
