package kr.co.kfs.asseterp.biz.ast.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.List;

public record PriceSaveReq(@NotEmpty @Valid List<Row> rows) {

    public record Row(@NotNull LocalDate stdDate, @NotNull String itemType, String itemCode, String itemName, Double evalPrice, String note) {
    }
}
