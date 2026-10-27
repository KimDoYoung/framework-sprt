package kr.co.kfs.asseterp.biz.ast.dto;

import java.time.LocalDate;

public record AstItemClassUpdateReq(
        Long classTreeId,
        String content,
        String itemLClassCode,
        String itemMClassCode,
        String itemSClassCode,
        String itemDClassCode,
        String accountType,
        String trUnit,
        LocalDate issueDate,
        LocalDate matDate,
        Long corpId,
        String curCode,
        Long depnYear,
        Double depnRate,
        String depnType,
        String evalType
) {
}
