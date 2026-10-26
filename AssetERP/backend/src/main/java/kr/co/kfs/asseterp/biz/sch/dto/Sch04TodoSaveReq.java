package kr.co.kfs.asseterp.biz.sch.dto;

import java.time.LocalDate;

/** 업무일정 처리 저장 한 행 (AS-IS Sch04_List.insertCheck 가 받는 Sch04_ListModel 중 쓰는 필드). 회사는 로그인 회사로 서버가 채운다 */
public record Sch04TodoSaveReq(Long listId, LocalDate closeDate, LocalDate manageDate, Long infoId, String title, String scheduleCode, String cycleCode,
                               Long managerId, Long personId, String statusCode, String note, Long deadlineId, Long mngOrgId) {
}
