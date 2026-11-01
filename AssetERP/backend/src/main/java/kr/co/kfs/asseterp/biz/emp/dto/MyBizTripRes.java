package kr.co.kfs.asseterp.biz.emp.dto;

import java.time.LocalDate;

/** Y05 본인 출장 목록 한 줄 (AS-IS emp53_biz_trip.selectByPersonId — Emp53_BizTripModel) */
public record MyBizTripRes(Long bizTripId, LocalDate startDate, LocalDate closeDate, String bizTripCode, String bizTripName,
                           String destination, String purpose, String num, String companion, String note,
                           Long apprId, String apprStatusCode, String apprStatusName,
                           Long resultApprId, String resultApprStatusCode, String resultApprStatusName,
                           Boolean publicYn, String shareInfo) {
}
