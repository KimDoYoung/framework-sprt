package kr.co.kfs.asseterp.biz.batch.dto;

import lombok.Builder;

import java.time.LocalDate;

/** 공모주 일정 sch10_ipo 한 행 (AS-IS Sch10_IpoModel). cancelYn·mismatchCheckYn은 DB 값 그대로 'true'/'false' 문자열 */
@Builder(toBuilder = true)
public record BatchIpo(
        Long ipoId, String issCorpCode, String marketCode, Long companyId, String itemName,
        LocalDate demandStartDate, LocalDate demandCloseDate,
        LocalDate subscriptionStartDate, LocalDate subscriptionCloseDate,
        LocalDate divDate, LocalDate payDate, LocalDate refundDate, LocalDate listDate,
        String note, String cancelYn, String priceBracket, Long price, String mismatchCheckYn
) {
    public boolean isMismatchChecked() {
        return "true".equals(mismatchCheckYn);
    }
}
