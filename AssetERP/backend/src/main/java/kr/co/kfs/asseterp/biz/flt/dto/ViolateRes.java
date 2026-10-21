package kr.co.kfs.asseterp.biz.flt.dto;

/**
 * 위반내역조회 한 행 (AS-IS Flt10_TrModel · flt10_tr.selectViolate, I10 Flt10_Tab_ViolateUser / J05 Flt10_Tab_Violate).
 * trId는 조회 순서의 행번호(ROW_NUMBER)라 그리드 행 키로만 쓴다.
 */
public record ViolateRes(
        Long trId,
        String orgName,
        String personName,
        String checkName,
        String checkStd,
        String checkViolate,
        String trDate,
        String trItemName,
        String rejectReason,
        String trNote) {
}
