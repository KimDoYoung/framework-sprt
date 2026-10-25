package kr.co.kfs.asseterp.biz.tdm.dto;

/** 미흡/개선 조치기록 한 행 (AS-IS Tdm63_ChckInsuffRecordModel — selectBychckInsuffId) */
public record CheckApprInsuffRecordRes(Long chckInsuffRecordId, String regDate, String regEmpName, String content, String note, String fileCountStr) {
}
