package kr.co.kfs.asseterp.biz.sch.dto;

import java.time.LocalDate;

/**
 * 업무일정 체크내역 한 행 (AS-IS Sch04_ListModel — sch04_list.selectCheckListStatus). scheduleCode '1'=업무일정, '5'=공모주. apprId가 null이면 상신 문서 없음.
 * 생성자 순서 = 매퍼 SELECT 순서
 */
public record Sch04CheckStatusRes(Long listId, LocalDate manageDate, LocalDate closeDate, String className, String title, String scheduleCode, Long infoId,
                                  Long deadlineId, String statusName, String note, Long apprId, String apprStatusName) {
}
