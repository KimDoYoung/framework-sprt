package kr.co.kfs.asseterp.biz.emp.dto;

import java.time.LocalDateTime;

/** 일반발령 탭 행 (AS-IS Emp03_TransModel) */
public record TransRes(
        Long transId,
        Long personId,
        LocalDateTime transDate,
        String transCd,
        String transNm,
        String kindCd,
        String kindNm,
        Long orgCodeId,
        String orgNm,
        String titleCd,
        String titleNm,
        String posCd,
        String posNm,
        String gradeNm,
        String duty,
        LocalDateTime expiryDate,
        String transReason,
        String orgHeadYn,
        String officerYn,
        String tdmTargetYn,
        String nonStayYn
) {
}
