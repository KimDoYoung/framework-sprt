package kr.co.kfs.asseterp.biz.pay.dto;

import java.time.LocalDate;

/** 임금계산방법(pay04_formula) 한 행 — 구분(itemName)은 pay20_item 조인 */
public record PayFormulaRes(Long formulaId, Long companyId, LocalDate startDate, String itemCd, String itemName, String formulaForm, String note) {
}
