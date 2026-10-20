package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDate;

/** 인감 저장 한 행 (AS-IS Apr10_Stamp.update, G07). stampId가 없거나 0 이하면 새 행 */
public record AprStampSaveReq(
        Long stampId,
        Long orgId,
        Long aprEmpId,
        Long secondEmpId,
        String stampName,
        LocalDate startDate,
        LocalDate closeDate,
        String useName,
        String corpStampYn,
        String stepUseYn,
        String allUseYn,
        String note
) {
}
