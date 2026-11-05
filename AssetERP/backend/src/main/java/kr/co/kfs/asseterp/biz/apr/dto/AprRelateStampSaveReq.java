package kr.co.kfs.asseterp.biz.apr.dto;

/** 인감날인 저장 요청 한 줄 (AS-IS apr.Apr19_RelateStamp.update의 UpdateDataModel, U2-02). relateStampId가 0 이하이면 새 줄 */
public record AprRelateStampSaveReq(Long relateStampId, Long corpDocId, Long stampId, Long stampCnt, Boolean outYn) {
}
