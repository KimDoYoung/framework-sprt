package kr.co.kfs.asseterp.biz.ast.dto;

import java.time.LocalDate;

/** ast06_tr.selectDepn 한 줄 — 감가상각처리 그리드(W11). 처리 안 한 줄의 trId는 SQL의 f_create_seq()가 임시로 발급한다 */
public record DepnRes(Long trId, Long astClassTreeId, LocalDate date, String trCode, String curCode, Double fxRate,
                      Long amt, Double forAmt, Long personId, Long purTrId, Long companyId, LocalDate purDate,
                      Long bookAmt, Long acmDepnCost, Long depnCost, String itemClassTypeName, String classTreeName,
                      Long depnYear, Double depnRate, String depnType, String depnTypeName, String statusName,
                      Long journalId, Long nonDeductTax, LocalDate calcStartDate) {
}
