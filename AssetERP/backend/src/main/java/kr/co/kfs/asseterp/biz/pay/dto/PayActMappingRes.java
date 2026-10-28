package kr.co.kfs.asseterp.biz.pay.dto;

/** 계약서 Mapping 한 행 — AS-IS Pay06_ActMappingModel */
public record PayActMappingRes(
        Long actMappingId,
        Long companyId,
        String title,
        String content,
        String linkCode,
        String linkName,
        Boolean defaultYn,
        String note,
        String kindCode,
        String kindName
) {
}
