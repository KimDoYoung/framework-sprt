package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDate;

/** MyPage 전자결재 박스 임시저장함 한 행 (AS-IS Monitoring_Page_Appr.buildGrid03 L134-136: 등록일·제목) */
public record AprMonitorTemporaryRes(
        Long apprId,
        LocalDate regDate,
        String title,
        String statusCode
) {
}
