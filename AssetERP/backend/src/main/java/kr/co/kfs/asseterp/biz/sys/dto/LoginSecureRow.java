package kr.co.kfs.asseterp.biz.sys.dto;

import java.time.LocalDate;

/** sys29_login_secure INSERT/UPDATE 값 */
public record LoginSecureRow(Long loginSecureId, Long companyId, LocalDate startDate, LocalDate closeDate, String publicIp, String note) {
}
