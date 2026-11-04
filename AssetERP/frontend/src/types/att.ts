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

/** AS-IS Att02_CommuteModel 중 근태현황 열 (T08 getCommuteStatus · T09 getPersonStatus). 한 쪽에 없는 열은 null */
export interface AttCommuteStatus {
  commuteId: number;
  personNo: string | null;
  personName: string | null;
  orgName: string | null;
  posName: string | null;
  statusName: string | null;
  workDate: string | null;
  dayOfWeek: string | null;
  dateInfo: string | null;
  inOutReasonYnStr: string | null;
  inReason: string | null;
  outReason: string | null;
  checkInTimeStr: string | null;
  checkOutTimeStr: string | null;
  calcCheckInTimeStr: string | null;
  calcCheckOutTimeStr: string | null;
  baseWorkTimeStr: string | null;
  overtimeWorkTimeStr: string | null;
  nightWorkTimeStr: string | null;
}

/** 로그인 사원 본인의 출퇴근 한 건 (AS-IS Att02_CommuteModel 일부 — Att02_Lookup_Commute, EE50). checkInTime/checkOutTime은 `yyyy-MM-ddTHH:mm:ss` */
export interface AttMyCommute {
  commuteId: number;
  personId: number;
  workDate: string;
  statusCode?: string | null;
  statusName?: string | null;
  checkInTime?: string | null;
  checkInTimeStr?: string | null;
  checkOutTime?: string | null;
  checkOutTimeStr?: string | null;
  inReason?: string | null;
  outReason?: string | null;
}

/** 마지막 출퇴근 + 회사 근태 설정 (MainFrame.checkCommute) */
export interface AttMyCommuteLast {
  popupYn: boolean;
  lockYn: boolean;
  last: AttMyCommute | null;
}

/** 오후근무신청 창 그리드 한 행 (GET /api/v1/att/pm-works, AS-IS Att05_PmWorkModel). 새 행의 pmWorkId는 임시 음수 */
export interface AttPmWork {
  pmWorkId: number;
  workDate: string;
  reason?: string | null;
  apprId?: number | null;
  statusCode?: string | null;
  statusName?: string | null;
  timeStr?: string | null;
  breakMinutes?: number | null;
  workTimeStr?: string | null;
}

/** 오후근무 저장 요청: rows = 그리드의 모든 행(중복 검사용), changed = 바뀐 행 */
export interface AttPmWorkSaveReq {
  baseDate: string;
  rows: { pmWorkId: number; workDate: string; reason?: string | null; changed: boolean }[];
}

/** 연장근무신청 창 그리드 한 행 (GET /api/v1/att/overtime-reqs/me, AS-IS Att03_OvertimeReqModel). 새 행의 overtimeReqId는 임시 음수.
 *  startTimeStr·endTimeStr은 화면에서 계산하는 값(서버에 없음) */
export interface AttMyOvertime {
  overtimeReqId: number;
  workDate: string;
  workTypeCode?: string | null;
  workTypeName?: string | null;
  overtimeMin?: number | null;
  overTimeStr?: string | null;
  reason?: string | null;
  workRewardTypeCode?: string | null;
  workRewardTypeName?: string | null;
  apprId?: number | null;
  statusCode?: string | null;
  statusName?: string | null;
  startTimeStr?: string | null;
  endTimeStr?: string | null;
}

/** 연장근무신청 창 기준값 (AS-IS defaultInfo + 등록 때 getWorkDateInfo) */
export interface AttMyOvertimeSettings {
  policyFound: boolean;
  workEndTime?: string | null;
  pmWorkEndTime?: string | null;
  ntStartTime: string;
  ntEndTime: string;
  weekMaxAddHours: number;
  pmWorkOnDate: boolean;
}

/** 안내 줄의 주간·월간 현황 (HTML 조각) */
export interface AttMyOvertimeInfo {
  weekReport?: string | null;
  monthReport?: string | null;
}

/** 연장근무 저장 요청: rows = 그리드의 모든 행(중복·합계 검사용), changed = 바뀐 행, deleteIds = 화면에서 뺀 하위 행 */
export interface AttMyOvertimeSaveReq {
  baseDate: string;
  rows: { overtimeReqId: number; workDate: string; workTypeCode?: string | null; overtimeMin?: number | null; reason?: string | null; workRewardTypeCode?: string | null; changed: boolean }[];
  deleteIds: number[];
}
