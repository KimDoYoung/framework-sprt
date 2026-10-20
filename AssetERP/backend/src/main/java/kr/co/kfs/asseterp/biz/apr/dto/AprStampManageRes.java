package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDate;

/**
 * 인감 한 행 (AS-IS Apr10_StampModel — Apr10_Tab_Stamp 그리드, G07). 책임자 이름은 "이름 직책", roleName은 사용가능 부서 요약, stampAuthCntStr은 미사용 문서분류 건수.
 * 논리 값(corpStampYn·stepUseYn·allUseYn)은 DB와 같이 'true'/'false' 문자열
 */
public record AprStampManageRes(
        Long stampId,
        Long orgId,
        String orgName,
        Long aprEmpId,
        String aprEmpName,
        Long secondEmpId,
        String secondEmpName,
        String stampName,
        LocalDate startDate,
        LocalDate closeDate,
        String useName,
        String stampIdString,
        String corpStampYn,
        String stepUseYn,
        String allUseYn,
        String roleName,
        String stampAuthCntStr,
        String note
) {
}
