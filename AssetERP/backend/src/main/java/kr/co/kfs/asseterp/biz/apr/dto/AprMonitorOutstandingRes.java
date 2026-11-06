package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDate;

/** MyPage 전자결재 박스 미결함 한 행 (AS-IS Monitoring_Page_Appr.buildGrid01 L84-88: 진행상태·등록일·제목·상신자) */
public record AprMonitorOutstandingRes(
        Long apprId,
        String statusName,
        LocalDate regDate,
        String title,
        String regEmpName
) {
}
