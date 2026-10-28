package kr.co.kfs.asseterp.biz.emp.dto;

/** initLeaveId 0 이하는 신규 (임시 음수 ID) */
public record InitLeaveSaveReq(Long initLeaveId, Long personId, String year, Double useDays) {
}
