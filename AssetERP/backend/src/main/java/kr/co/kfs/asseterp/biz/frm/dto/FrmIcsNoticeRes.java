package kr.co.kfs.asseterp.biz.frm.dto;

import java.time.LocalDate;

/**
 * MyPage 법규보고공시 및 내규정보 한 행 (AS-IS Frm01_ListModel — frm01_list.selectIcsNotice)
 * 그리드(Monitoring_Page_IcsNotice.buildGrid L76-79): bizNoticeName 구분 · date 마감일 · todoTitle 제목.
 * 상세(callLookup L112-127): relateId → infoId, deadlineId, scheduleCode → gubunCode, bizNoticeCode "210"이면 내규
 */
public record FrmIcsNoticeRes(
        Long listId,
        String title,
        String todoTitle,
        LocalDate date,
        String bizNoticeName,
        String bizNoticeCode,
        Long relateId,
        Long companyId,
        Long deadlineId,
        String scheduleCode
) {
}
