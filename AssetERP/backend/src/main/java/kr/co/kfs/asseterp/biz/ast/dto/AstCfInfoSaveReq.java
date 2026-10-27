package kr.co.kfs.asseterp.biz.ast.dto;

import java.io.Serializable;

/**
 * 현금흐름표 기본정보 저장/수정 요청 DTO
 */
public record AstCfInfoSaveReq(
        Long cfInfoId,
        Long astClassTreeId,
        String cfCode,
        String cfName,
        String trCode,
        Long corpId,
        String icamYn,
        String note
) implements Serializable {}
