package kr.co.kfs.asseterp.biz.emp.dto;

import java.time.LocalDate;

/** emp03_trans INSERT/UPDATE 파라미터. companyId는 사람이 로그인 회사 사람인지 확인하는 데만 쓴다 */
public record TransRow(
        Long transId,
        Long companyId,
        Long personId,
        LocalDate transDate,
        String transCd,
        String kindCd,
        Long orgCodeId,
        String titleCd,
        String posCd,
        String duty,
        LocalDate expiryDate,
        String transReason,
        /* addBoolean 체크 컬럼 (조직장·등기임원·책무대상·비상근) — 'true'/'false' */
        String orgHeadYn,
        String officerYn,
        String tdmTargetYn,
        String nonStayYn
) {
}
