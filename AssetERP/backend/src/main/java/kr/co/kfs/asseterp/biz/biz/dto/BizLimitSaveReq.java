package kr.co.kfs.asseterp.biz.biz.dto;

import java.time.LocalDate;

/** 이익제공(수령) 한도관리 저장 한 행 (AS-IS Biz90_Limit.update → UpdateDataModel). limitId가 없거나 0 이하면 새 행, companyId는 서버가 로그인 회사로 채운다 */
public record BizLimitSaveReq(
        Long limitId,
        LocalDate startDate,
        String provideRcvType,
        Long saleRuleLimit1,
        Long saleRuleLimit2,
        Long companyLimit1,
        Long companyLimit2,
        Long companyLimit3
) {
}
