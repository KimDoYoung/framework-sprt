package kr.co.kfs.asseterp.oms.biz.emp.dto;

import java.time.LocalDate;

/** 발령 변경 내역 (AS-IS emp03_trans.selectByHistory) */
public record TransHistoryRes(Long transId, LocalDate transDate, String empNo, String korNm, String transNm, String kindNm,
                              String orgNm, String titleNm, String posNm, String gradeNm, boolean orgHeadYn, String transReason) {
}
