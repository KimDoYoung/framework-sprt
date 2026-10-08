package kr.co.kfs.asseterp.biz.emp.dto;

/**
 * AS-IS emp00_trans_info.selectByText / selectById / selectOneByPersonId 파라미터.
 * transId 또는 personId가 있으면 그 행만(목록 조건은 쓰지 않음).
 */
public record TransInfoSearchParam(
        Long companyId,
        String transDate,
        String searchText,
        String transCode,
        Long transId,
        Long personId
) {
    public static TransInfoSearchParam ofTransId(Long companyId, Long transId) {
        return new TransInfoSearchParam(companyId, null, null, null, transId, null);
    }

    public static TransInfoSearchParam ofPersonId(Long companyId, Long personId) {
        return new TransInfoSearchParam(companyId, null, null, null, null, personId);
    }
}
