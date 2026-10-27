package kr.co.kfs.asseterp.biz.ast.dto;

import java.io.Serializable;

/**
 * 종목 자산상세 항목 DTO (ast02_detail)
 */
public record AstItemDetailRes(
        Long detailId,
        Long astClassTreeId,
        Long seq,
        String title,
        String value,
        String note,
        String useYn,
        String defaultYn,
        String tag,
        Long companyId
) implements Serializable {}
