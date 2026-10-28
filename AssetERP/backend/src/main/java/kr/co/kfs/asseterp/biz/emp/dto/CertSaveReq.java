package kr.co.kfs.asseterp.biz.emp.dto;

import java.time.LocalDate;

/** 증명서 발급 등록 (AS-IS Emp15_Lookup_Cert.update → emp.Emp15_Cert.modelUpdate) */
public record CertSaveReq(
        LocalDate issueDate,
        String linkCode,
        Long personId,
        String certUseCode,
        String certUse,
        Long dcrClassTreeId
) {
}
