package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDateTime;

/** Apr01_Tab_MyRequestList 그리드 한 행 (G02 상신내역 조회). title은 HTML, mailYn은 '송신' 또는 '', preconfirmMsgYnStr은 '있음' 또는 '' */
public record AprMyRequestRes(Long apprId, String statusCode, LocalDateTime regDate, LocalDateTime effectDate, String statusName, String classTreeName,
                              String inOutTypeName, String title, String preconfirmStatusName, String preconfirmMsgYnStr, String mailYn,
                              String recentApprovalName, LocalDateTime recentApprovalDate, String note) {
}
