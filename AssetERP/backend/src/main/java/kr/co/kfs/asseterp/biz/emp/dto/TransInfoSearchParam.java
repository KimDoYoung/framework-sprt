package kr.co.kfs.asseterp.biz.emp.dto;

/**
 * AS-IS emp00_trans_info.selectByText / selectById / selectOneByPersonId 파라미터.
 * transId 또는 personId가 있으면 그 행만(목록 조건은 쓰지 않음).
 * separateAddTitle은 AS-IS isSeparateAddTitle(true: 재직에서 겸직 제외, false: 겸직도 재직으로).
 * leaveManager는 AS-IS isLeaveManager(true: 휴가관리(경영관리팀, Emp20_Tab_LeaveManager) 화면 사용자만 — Y01 초과사용 승인요청).
 */
public record TransInfoSearchParam(
        Long companyId,
        String transDate,
        String searchText,
        String transCode,
        boolean separateAddTitle,
        Long transId,
        Long personId,
        boolean leaveManager
) {
    /** leaveManager 없이 쓰는 기존 호출처 */
    public TransInfoSearchParam(Long companyId, String transDate, String searchText, String transCode, boolean separateAddTitle,
                                Long transId, Long personId) {
        this(companyId, transDate, searchText, transCode, separateAddTitle, transId, personId, false);
    }

    public static TransInfoSearchParam ofTransId(Long companyId, Long transId) {
        return new TransInfoSearchParam(companyId, null, null, null, true, transId, null);
    }

    public static TransInfoSearchParam ofPersonId(Long companyId, Long personId) {
        return new TransInfoSearchParam(companyId, null, null, null, true, null, personId);
    }
}
