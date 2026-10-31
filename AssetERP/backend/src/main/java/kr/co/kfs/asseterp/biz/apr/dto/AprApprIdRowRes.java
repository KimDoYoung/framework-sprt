package kr.co.kfs.asseterp.biz.apr.dto;

/** 결재문서 번호 목록으로 읽은 문서 한 줄 (AS-IS apr.Apr01_Appr.selectByApprIdList — Apr01_Lookup_ApprLink 그리드: 상신일자·상신제목·상태) */
public record AprApprIdRowRes(Long apprId, String regDate, String title, String statusCode, String statusName) {
}
