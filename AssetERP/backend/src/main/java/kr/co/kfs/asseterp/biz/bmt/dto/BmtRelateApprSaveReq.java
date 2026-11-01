package kr.co.kfs.asseterp.biz.bmt.dto;

/** Bmt20_Lookup_RelateAppr [등록] — 불러오기로 고른 문서를 장비에 연결 */
public record BmtRelateApprSaveReq(
        Long infoId,
        Long apprId
) {
}
