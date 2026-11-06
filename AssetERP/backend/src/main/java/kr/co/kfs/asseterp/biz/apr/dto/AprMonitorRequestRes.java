package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDate;

/** MyPage 전자결재 박스 결재요청함 한 행 (AS-IS Monitoring_Page_Appr.buildGrid02 L95-98: 결재상태·등록일·제목·다음결재자) */
public record AprMonitorRequestRes(
        Long apprId,
        String statusName,
        LocalDate regDate,
        String title,
        String nextApprName
) {
}
