package com.asseterp.oms.biz.company.dto;

/**
 * admin 로그인 화면의 회사 선택 항목
 */
public record CompanyItemRes(
        Long companyId,
        String companyCode,
        String companyName
) {
}
