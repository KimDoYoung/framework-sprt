package kr.co.kfs.asseterp.biz.emp.dto;

/** [문자발송] 받는 사원 (AS-IS Emp21_UnLeave.sendMessage L637 emp01_person.selectById 중 이름·휴대폰번호) */
public record UnLeaveSmsTarget(Long unLeaveId, Long personId, String korName, String mobileTelNo) {
}
