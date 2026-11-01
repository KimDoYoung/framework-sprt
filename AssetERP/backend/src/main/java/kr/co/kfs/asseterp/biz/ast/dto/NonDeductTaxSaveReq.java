package kr.co.kfs.asseterp.biz.ast.dto;

import jakarta.validation.constraints.NotEmpty;

import java.time.LocalDate;
import java.util.List;

/** 불공제세액 저장 — nonDeductTaxId가 비었거나 0 이하면 새 행 */
public record NonDeductTaxSaveReq(@NotEmpty List<Row> rows) {

    public record Row(Long nonDeductTaxId, Long purTrId, LocalDate applyDate, Long applyNonDeductTax, String note) {
    }
}
