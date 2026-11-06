package kr.co.kfs.asseterp.biz.frm.dto;

import java.time.LocalDate;

/**
 * MyPage Day List 한 행 (AS-IS Frm01_ListModel — frm01_list.selectToDoList)
 * 그리드(Monitoring_Page_DayList.buildGrid L187-192): bizNoticeName 업무구분 · date 등록(마감)일 · todoTitle 제목 · closeDate 처리(완료)일 · personName 담당자.
 * 상세(open L198-315)는 bizNoticeCode로 갈라 relateId·deadlineId·scheduleCode를 쓴다
 */
public record FrmToDoRes(
        Long listId,
        String title,
        String todoTitle,
        LocalDate date,
        LocalDate closeDate,
        String bizNoticeCode,
        String bizNoticeName,
        String personName,
        Long relateId,
        Long companyId,
        Long deadlineId,
        String scheduleCode
) {
}
