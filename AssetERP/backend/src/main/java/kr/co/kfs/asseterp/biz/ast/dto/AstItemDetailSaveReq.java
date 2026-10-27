package kr.co.kfs.asseterp.biz.ast.dto;

import java.io.Serializable;

/**
 * 종목 자산상세 항목 저장/수정 요청 DTO
 */
public record AstItemDetailSaveReq(
        Long detailId,
        Long astClassTreeId,
        Long seq,
        String title,
        String value,
        String note,
        String useYn,
        String defaultYn,
        String tag
) implements Serializable {}
