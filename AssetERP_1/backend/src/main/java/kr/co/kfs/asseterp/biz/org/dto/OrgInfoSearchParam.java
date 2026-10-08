package kr.co.kfs.asseterp.biz.org.dto;

import java.time.LocalDate;

/** AS-IS org00_org_info.selectByKorName / selectByOrgCodeId 파라미터 */
public record OrgInfoSearchParam(
        Long companyId,
        String korName,
        LocalDate baseDate,
        Long orgCodeId
) {
}
