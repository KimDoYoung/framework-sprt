package kr.co.kfs.asseterp.biz.emp.dto;

import java.time.LocalDate;

/** emp15_cert INSERT 파라미터 */
public record CertRow(
        Long certId,
        Long companyId,
        LocalDate issueDate,
        String linkCode,
        Long personId,
        String certUseCode,
        String certUse,
        Long dcrClassTreeId
) {
}
