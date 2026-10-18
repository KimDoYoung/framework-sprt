package kr.co.kfs.asseterp.biz.pay.dto;

import java.time.LocalDate;

/** 임금계산방법의 기준 적용일 목록 한 행 (AS-IS selectByCompanyId — 번호는 row_number) */
public record PayFormulaDateRes(Long formulaId, LocalDate startDate) {
}
