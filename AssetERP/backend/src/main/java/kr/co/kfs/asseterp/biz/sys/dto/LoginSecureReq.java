package kr.co.kfs.asseterp.biz.sys.dto;

import java.time.LocalDate;

/** 공인IP 저장 행 (ID ≤ 0이면 신규) */
public record LoginSecureReq(Long loginSecureId, LocalDate startDate, LocalDate closeDate, String publicIp, String note) {
}
