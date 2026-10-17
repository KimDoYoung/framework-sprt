package kr.co.kfs.asseterp.biz.icam.dto;

import java.time.LocalDate;

/** actionCode: icamOfficeMngFee(사무관리보수) | icamFundMngFee(운용보수), companyId: 회사 ID 문자열 또는 "ALL" */
public record IcamFeeBatchReq(String actionCode, String companyId, LocalDate startDate, LocalDate closeDate) {
}
