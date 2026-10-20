package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDateTime;

/** 결재내역 조회 목록 한 줄 (AS-IS Apr01_Tab_MyApproveList 그리드). statusCode는 [메일보내기]의 완료(30) 검사용. title은 HTML(폐기 문서는 빨간 [폐기]), mailYn은 '송신' 또는 '' */
public record AprMyApproveRes(Long apprId, String statusCode, String statusName, LocalDateTime regDate, String inOutTypeName, String title, String regEmpName,
                              String nextApprName, LocalDateTime effectDate, String classTreeName, String mailYn,
                              LocalDateTime myApprovalDate, LocalDateTime finalApprovalDate, String note) {
}
