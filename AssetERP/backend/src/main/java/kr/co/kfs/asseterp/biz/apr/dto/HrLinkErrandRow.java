package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDate;

/** A45 외출 한 건 (AS-IS Emp54_ErrandModel 중 양식에 쓰는 값, V24) */
public record HrLinkErrandRow(String personName, String orgName, String errandName, LocalDate date, String departTime, String returnTime,
                              String reason, String host, String venue, String note) {
}
