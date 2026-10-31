package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDate;

/** A42 여비교통비 신청서의 한 줄 (AS-IS Emp50_TransportExpenseModel 중 양식에 쓰는 값, V36) */
public record TransportLinkRow(LocalDate date, String startPoint, String closePoint, String startTime, String closeTime, Long amt,
                               String transportName, String note, String orgName, String personName) {
}
