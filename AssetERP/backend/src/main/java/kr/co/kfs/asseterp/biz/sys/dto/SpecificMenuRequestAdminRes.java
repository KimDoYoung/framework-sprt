package kr.co.kfs.asseterp.biz.sys.dto;

import java.time.LocalDate;

/** AS-IS Sys53_SpecificMenuRequestModel (관리자 화면 selectByTextAdmin) — 고객사명·처리일이 더 있다 */
public record SpecificMenuRequestAdminRes(Long specificMenuRequestId, Long companyId, String companyNm, Long personId, String personNm,
                                          LocalDate regDate, String stateCd, String stateNm, String specificWorkCd, String specificWorkNm,
                                          Long apprId, String aprStatusCd, String aprStatusNm, String confirmNm, LocalDate confirmDate) {
}
