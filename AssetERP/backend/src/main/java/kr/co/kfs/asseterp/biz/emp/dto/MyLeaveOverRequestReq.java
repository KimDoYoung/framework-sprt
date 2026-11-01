package kr.co.kfs.asseterp.biz.emp.dto;

/** Y01 [초과사용 승인요청] — 승인자로 고른 사원 (AS-IS Emp20_Edit_Leave.lookupEmpTransInfo → sendMessage) */
public record MyLeaveOverRequestReq(Long confirmerId) {
}
