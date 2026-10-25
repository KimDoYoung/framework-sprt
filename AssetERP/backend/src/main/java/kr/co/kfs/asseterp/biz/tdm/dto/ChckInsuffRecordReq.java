package kr.co.kfs.asseterp.biz.tdm.dto;

/** 조치기록 한 행 (AS-IS Tdm63_ChckInsuffRecordModel). chckInsuffRecordId가 0 이하면 신규 */
public record ChckInsuffRecordReq(Long chckInsuffRecordId, String regDate, String content, String note) {
}
