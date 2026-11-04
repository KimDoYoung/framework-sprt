package kr.co.kfs.asseterp.biz.batch.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

/** icam25_ipo 한 건 (AS-IS Icam25_IpoModel) — ICAM 공모주 청약정보 */
public record BatchIcamIpo(
        String itemName,
        String issCorpCode,
        LocalDate startDate,
        LocalDate closeDate,
        Long companyCount,
        Long totalCompanyCount,
        BigDecimal regRate,
        String worker
) {
}
