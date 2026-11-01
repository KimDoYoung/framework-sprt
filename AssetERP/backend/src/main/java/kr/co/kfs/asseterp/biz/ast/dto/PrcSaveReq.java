package kr.co.kfs.asseterp.biz.ast.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;

import java.time.LocalDate;
import java.util.List;

/** 시세관리 저장 — priceId가 0 이하면 새 행, lockYn이면 공용 시세를 고객사 시세로 새로 만든다(Ast25_Price.upsert) */
public record PrcSaveReq(@NotEmpty @Valid List<Row> rows) {

    public record Row(Long priceId, LocalDate stdDate, String itemType, String itemCode, String itemName, Double evalPrice, String note, Boolean lockYn) {
    }
}
