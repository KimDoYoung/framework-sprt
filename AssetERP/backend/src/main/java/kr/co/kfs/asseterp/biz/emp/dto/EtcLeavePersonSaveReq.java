package kr.co.kfs.asseterp.biz.emp.dto;

/** 새로 넣은 대상 직원 (AS-IS Emp23_EtcLeavePerson.update — 고치는 열이 없어 새 행만 의미가 있다) */
public record EtcLeavePersonSaveReq(Long etcLeavePersonId, Long etcLeaveId, Long personId) {
}
