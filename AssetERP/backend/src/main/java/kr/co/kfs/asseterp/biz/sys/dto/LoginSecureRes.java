package kr.co.kfs.asseterp.biz.sys.dto;

import java.time.LocalDate;

/** 공인IP (AS-IS Sys29_LoginSecureModel ← sys29_login_secure.selectByCompanyId) */
public record LoginSecureRes(Long loginSecureId, Long companyId, LocalDate startDate, LocalDate closeDate, String publicIp, String note) {
}
