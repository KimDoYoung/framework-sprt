package kr.co.kfs.asseterp.biz.ast.dto;

import java.io.Serializable;
import java.time.LocalDate;

/**
 * 현금흐름표 상세 DTO (ast04_cf)
 */
public record AstCfRes(
        Long cfId,
        Long cfInfoId,
        Long seq,
        LocalDate date,
        LocalDate settleDate,
        Long settleAmt,
        String note,
        Long contAmt,
        Long tax
) implements Serializable {}
