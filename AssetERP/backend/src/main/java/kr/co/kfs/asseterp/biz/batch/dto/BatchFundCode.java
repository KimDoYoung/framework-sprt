package kr.co.kfs.asseterp.biz.batch.dto;

import java.time.LocalDate;

/** fnd01_fund_code 한 건 (AS-IS Fnd01_FundCodeModel 중 assetErpFundInsert가 쓰는 필드) */
public record BatchFundCode(
        Long fundCodeId,
        String fundCode,
        LocalDate startDate,
        LocalDate endDate,
        String closeYn,
        String planYn,
        Long realFundId,
        Long companyId,
        String icamYn
) {
}
