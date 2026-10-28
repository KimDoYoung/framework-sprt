package kr.co.kfs.asseterp.biz.emp.dto;

import java.time.LocalDate;

/** 증명서 발급 그리드 행 (AS-IS Emp15_CertModel, emp15_cert.selectByCompanyId) */
public record CertRes(
        Long certId,
        LocalDate issueDate,
        String linkCode,
        String linkName,
        Long personId,
        String personNo,
        String personName,
        String certUseCode,
        String certUse,
        String certUseName,
        Long dcrClassTreeId,
        Long apprId,
        String stampSeqText,
        String apprStatusName,
        String emailAddress
) {
}
