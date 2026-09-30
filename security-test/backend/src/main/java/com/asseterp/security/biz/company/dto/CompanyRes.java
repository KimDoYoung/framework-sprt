package com.asseterp.security.biz.company.dto;

/**
 * 회사 (sys01_company)
 *
 * @param companyId   sys01_company_id
 * @param companyCode sys01_loc_nm - 서브도메인으로 쓰는 회사 코드
 * @param companyName sys01_company_nm
 * @param useYn       sys01_use_yn ('true'/'false')
 */
public record CompanyRes(
        Long companyId,
        String companyCode,
        String companyName,
        String useYn
) {
    public boolean isUsable() {
        return "true".equals(useYn);
    }
}
