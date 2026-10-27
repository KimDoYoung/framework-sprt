package kr.co.kfs.asseterp.biz.ast.dto;

import java.io.Serializable;

/**
 * 현금흐름표 일괄생성 요청 DTO
 */
public record AstCfBatchCreateReq(
        Long cfInfoId,
        String dateCode,
        String holidaySettleCode,
        String startYm,
        String closeYm,
        Long amt,
        Long contAmt,
        Long tax,
        Long cycle,
        Long round
) implements Serializable {}
