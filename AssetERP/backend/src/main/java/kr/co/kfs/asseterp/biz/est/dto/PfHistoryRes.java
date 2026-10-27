package kr.co.kfs.asseterp.biz.est.dto;

import java.time.LocalDate;

/** 부동산PF 용역수행내역 한 행 (AS-IS Est03_PfHistoryModel). statusCode는 10 신청 / 20 승인 / null 신청전 */
public record PfHistoryRes(Long pfHistoryId, Long pfContractId, Long no, LocalDate startDate, LocalDate closeDate, String content, String detail,
                           Long personId, String personName, String orgName, String statusCode, String statusName,
                           Long confirmerId, String confirmerName, String fileCountStr) {
}
