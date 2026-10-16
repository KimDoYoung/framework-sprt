package kr.co.kfs.asseterp.biz.emp.dto;

import java.time.LocalDate;

/** 자격사항 저장 요청 */
public record LicenseSaveReq(
        Long licenseId,
        Long personId,
        LocalDate certifiedDt,
        String certifiedNm,
        String licenseNo,
        String issuingAgency,
        String issuingGrade,
        String financeRelateYn,
        LocalDate kofiaRegDate,
        String note
) {}
