package kr.co.kfs.asseterp.biz.pay.dto;

/** 계약서 Mapping 저장 한 행 — actMappingId가 0 이하이거나 DB에 없으면 등록 */
public record PayActMappingSaveReq(
        Long actMappingId,
        String title,
        String content,
        String linkCode,
        Boolean defaultYn,
        String note,
        String kindCode
) {
}
