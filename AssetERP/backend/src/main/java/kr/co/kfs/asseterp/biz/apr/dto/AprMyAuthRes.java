package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDateTime;

/** Apr01_Tab_MyAuthList 그리드 한 행 (G04 공람내역 조회). title은 HTML, mailYn은 '송신' 또는 '' */
public record AprMyAuthRes(Long apprId, String statusCode, LocalDateTime regDate, LocalDateTime effectDate, String statusName, String classTreeName,
                           String inOutTypeName, String title, String mailYn, String recentApprovalName, LocalDateTime recentApprovalDate, String note) {
}
