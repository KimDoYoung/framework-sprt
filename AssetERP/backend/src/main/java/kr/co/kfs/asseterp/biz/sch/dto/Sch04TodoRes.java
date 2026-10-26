package kr.co.kfs.asseterp.biz.sch.dto;

import java.time.LocalDate;

/**
 * 업무일정 처리 한 행 (AS-IS Sch04_ListModel — sch04_list.selectByManagerId). listId는 저장된 행이면 sch04_list_id, 아직 처리하지 않은 일정(UNION)이면 임시 번호.
 * scheduleCode '1'=업무일정, '5'=공모주. 생성자 순서 = 매퍼 SELECT 순서
 */
public record Sch04TodoRes(Long listId, LocalDate closeDate, LocalDate manageDate, String scheduleCode, Long infoId, String cycleCode, String title,
                           Long mngOrgId, Long managerId, Long personId, String statusCode, String note, Long companyId, Long deadlineId,
                           String cycleName, String statusName, String managerName, String personName, String className) {
}
