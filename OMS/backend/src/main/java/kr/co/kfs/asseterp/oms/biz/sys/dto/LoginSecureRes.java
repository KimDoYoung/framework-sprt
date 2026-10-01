package kr.co.kfs.asseterp.oms.biz.sys.dto;

import java.time.LocalDate;

/** 고객사 공인IP (AS-IS Sys29_LoginSecureModel, sys29_login_secure) */
public record LoginSecureRes(Long loginSecureId, Long companyId, LocalDate startDate, LocalDate closeDate, String publicIp, String note) {
}
