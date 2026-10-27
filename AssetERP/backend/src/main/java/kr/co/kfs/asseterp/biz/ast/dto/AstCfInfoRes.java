package kr.co.kfs.asseterp.biz.ast.dto;

import java.io.Serializable;

/**
 * 현금흐름표 기본정보 DTO (ast03_cf_info)
 */
public record AstCfInfoRes(
        Long cfInfoId,
        Long astClassTreeId,
        String cfCode,
        String cfName,
        String trCode,
        String trName,
        String startYm,
        String closeYm,
        Long cycle,
        String dateCode,
        String dateName,
        String holidaySettleCode,
        String holidaySettleName,
        Long amt,
        String note,
        Long round,
        String icamYn,
        Long contAmt,
        Long tax,
        Long corpId,
        String corpName
) implements Serializable {}
