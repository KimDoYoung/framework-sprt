package kr.co.kfs.asseterp.biz.ast.dto;

import java.io.Serializable;

/**
 * 현금흐름표 기본정보 DTO (ast03_cf_info)
 */
public record AstCfInfoRes(
        Long cfInfoId,
        Long astClassTreeId,
        String cfCd,
        String cfNm,
        String trCd,
        String trNm,
        String startYm,
        String closeYm,
        Long cycle,
        String dateCd,
        String dateNm,
        String holidaySettleCd,
        String holidaySettleNm,
        Long amt,
        String note,
        Long round,
        String icamYn,
        Long contAmt,
        Long tax,
        Long corpId,
        String corpNm
) implements Serializable {}
