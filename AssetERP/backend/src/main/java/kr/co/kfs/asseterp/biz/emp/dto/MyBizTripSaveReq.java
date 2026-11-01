package kr.co.kfs.asseterp.biz.emp.dto;

import java.time.LocalDate;

/** Y05 출장품의 저장 (AS-IS Emp53_BizTrip.modelUpdate — Emp53_Lookup_BizTrip.update) */
public record MyBizTripSaveReq(LocalDate startDate, LocalDate closeDate, String bizTripCode, String destination, String purpose,
                               String num, String companion, String note, Boolean publicYn) {
}
