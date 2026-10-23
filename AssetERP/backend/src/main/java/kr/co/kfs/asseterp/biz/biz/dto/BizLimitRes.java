package kr.co.kfs.asseterp.biz.biz.dto;

import java.time.LocalDate;

/** 이익제공(수령) 한도관리 한 행 (AS-IS Biz90_LimitModel — Biz90_Tab_Limit 그리드). provideRcvTypeName은 f_cdnm('ProvideRcvType') 계산 열 */
public record BizLimitRes(
        Long limitId,
        Long companyId,
        LocalDate startDate,
        String provideRcvType,
        String provideRcvTypeName,
        Long saleRuleLimit1,
        Long saleRuleLimit2,
        Long companyLimit1,
        Long companyLimit2,
        Long companyLimit3
) {
}
