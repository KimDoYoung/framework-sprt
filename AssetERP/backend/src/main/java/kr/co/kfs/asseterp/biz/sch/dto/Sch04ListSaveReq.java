package kr.co.kfs.asseterp.biz.sch.dto;

import java.time.LocalDate;

/** 법규보고 점검 저장 한 행 (AS-IS Sch04_List.upsert의 Sch04_ListModel). 그리드에서 고친 행(처리구분·처리일)을 그대로 보낸다 */
public record Sch04ListSaveReq(Long listId, LocalDate closeDate, LocalDate manageDate, Long infoId, String title, String scheduleCode, String cycleCode,
                               Long managerId, String statusCode, String note, Long deadlineId, Long apprId, Long mngOrgId) {
}
