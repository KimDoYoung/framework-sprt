/** 근태관리(관리자) 그리드 한 행 (GET /api/v1/att/commutes/admin, AS-IS Att02_CommuteModel). 날짜는 'yyyy-MM-dd' */
export interface AttCommute {
  commuteId: number;
  personId: number;
  workDate: string;
  statusCode?: string | null;
  statusName?: string | null;
  division?: string | null;
  inOutReasonYnStr?: string | null;
  personNo?: string | null;
  personName?: string | null;
  orgName?: string | null;
  posName?: string | null;
  dayOfWeek?: string | null;
  dateInfo?: string | null;
  /** 출근 날짜 부분 */
  checkInTime?: string | null;
  checkInTimeStr?: string | null;
  /** 퇴근 날짜 부분 */
  checkOutTime?: string | null;
  checkOutTimeStr?: string | null;
  workTimeStr?: string | null;
  calcCheckInTimeStr?: string | null;
  calcCheckOutTimeStr?: string | null;
  calcWorkTimeStr?: string | null;
  inReason?: string | null;
  outReason?: string | null;
}

/** 확정 출퇴근시간 수정 본문 (체크하지 않은 쪽은 null) */
export interface AttCommuteTimeReq {
  checkInTime: string | null;
  checkInTimeStr: string | null;
  checkOutTime: string | null;
  checkOutTimeStr: string | null;
}

/** 근태정책 한 행 (AS-IS Att01_WorkPolicyModel). 새 행의 workPolicyId는 임시 음수 */
export interface AttWorkPolicy {
  workPolicyId: number;
  startDate: string;
  workStartTime?: string | null;
  workEndTime?: string | null;
  breakMinutes?: number | null;
  useYn?: boolean | null;
  overtimeMinutes?: number | null;
  startGraceAfterMinutes?: number | null;
  endGraceBeforeMinutes?: number | null;
  endGraceAfterMinutes?: number | null;
  pmWorkStartTime?: string | null;
  pmWorkEndTime?: string | null;
}

/** AS-IS Att03_OvertimeReqModel (T07 연장근무관리 그리드) */
export interface AttOvertimeReq {
  overtimeReqId: number;
  confirmYn: string;
  workDate: string;
  personNo: string;
  personName: string;
  orgName: string;
  posName: string;
  workTypeName: string;
  overTimeStr: string | null;
  reason: string | null;
  workRewardTypeName: string;
  paymentTypeCode: string | null;
  paymentTypeName: string | null;
  weekReport: string | null;
  monthReport: string | null;
  changeReason: string | null;
}

/** att.Att13_OvertimeReqHist.updateInfo 요청 — confirmYn이 있으면 확정(true)·확정취소(false), 없으면 저장 */
export interface AttOvertimeReqUpdateReq {
  confirmYn?: boolean;
  rows: Pick<AttOvertimeReq, 'overtimeReqId' | 'paymentTypeCode' | 'confirmYn' | 'changeReason'>[];
}
