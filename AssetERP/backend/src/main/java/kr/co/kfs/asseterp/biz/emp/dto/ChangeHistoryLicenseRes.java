package kr.co.kfs.asseterp.biz.emp.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

/** 사원정보 변경조회 > 자격사항 탭 행 (AS-IS Emp08_LicenseModel, emp08_license.selectByHistory) */
public record ChangeHistoryLicenseRes(
        String empOrgName,
        String empKorName,
        String certifiedName,
        LocalDateTime certifiedDt,
        String licenseNumber,
        String issuingAgency,
        String financeProTypeName,
        String financeRelateYn,
        LocalDate kofiaRegDate,
        String note
) {
}
