package kr.co.kfs.asseterp.biz.emp.dto;

/** 포상휴가 대상 직원 한 행 (AS-IS Emp23_EtcLeavePersonModel — Emp23_Page_EtcLeavePerson 그리드) */
public record EtcLeavePersonRes(
        Long etcLeavePersonId,
        Long etcLeaveId,
        Long personId,
        String orgName,
        String personName) {
}
