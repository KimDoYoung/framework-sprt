package kr.co.kfs.asseterp.biz.biz.dto;

/**
 * 이익제공 한도초과현황 조회·엑셀 요청 (쿼리 문자열). provideRcvType 비면 전체.
 * overCheck = [이익제공 편익 기준액 적용](비면 true), limitCheck = [임의점검 이익제공 편익상대방 한도액], limit1~3 = 인별 1회·인별 연간·회사별 연간 한도액
 */
public record BizLimitCheckReq(
        String yearText,
        String provideRcvType,
        Boolean overCheck,
        Boolean limitCheck,
        Long limit1,
        Long limit2,
        Long limit3
) {
}
