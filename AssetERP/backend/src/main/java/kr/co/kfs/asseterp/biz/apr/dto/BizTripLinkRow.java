package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDate;

/** B11~B14 출장 신청서·결과보고서 본문 값 (AS-IS Emp53_Tab_BizTrip.createMapping 이 그리드 행에서 읽던 값, V41) */
public record BizTripLinkRow(
        String bizTripName,
        String personName,
        String orgName,
        String num,
        String companion,
        String destination,
        LocalDate startDate,
        LocalDate closeDate,
        String purpose) {
}
