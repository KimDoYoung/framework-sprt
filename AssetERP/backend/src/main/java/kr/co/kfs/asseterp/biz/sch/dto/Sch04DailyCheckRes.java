package kr.co.kfs.asseterp.biz.sch.dto;

import java.time.LocalDate;

/**
 * 데일리 체크리스트 한 행 (AS-IS Sch04_ListModel — sch04_list.selectByManagerId, 데일리 체크). listId는 저장된 행이면 sch04_list_id, 아직 처리하지 않은 일정(UNION)이면 임시 번호.
 * statusCode '1'=처리완료, '5'=해당없음(체크 열 yes/not). apprStatusCode 10·20·30이면 상신 중이라 고칠 수 없다. 생성자 순서 = 매퍼 SELECT 순서
 */
public record Sch04DailyCheckRes(Long listId, LocalDate closeDate, LocalDate manageDate, String scheduleCode, Long infoId, String cycleCode, String title,
                                 Long mngOrgId, Long managerId, Long personId, String statusCode, String note, Long companyId, Long deadlineId,
                                 String className, Long apprId, String apprStatusCode, String apprStatusName) {
}
