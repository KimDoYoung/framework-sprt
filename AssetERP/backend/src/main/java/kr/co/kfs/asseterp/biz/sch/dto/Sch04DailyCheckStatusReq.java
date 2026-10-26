package kr.co.kfs.asseterp.biz.sch.dto;

import java.time.LocalDate;

/** 데일리 체크 처리 한 건 (AS-IS Sch04_List.statusUpdateCheck 가 받는 Sch04_ListModel 중 쓰는 필드). 회사는 로그인 회사, 처리자는 로그인 사용자로 서버가 채운다 */
public record Sch04DailyCheckStatusReq(Long listId, LocalDate closeDate, LocalDate manageDate, Long infoId, String title, String scheduleCode, String cycleCode,
                                       Long managerId, String statusCode, String note, Long deadlineId, Long mngOrgId) {
}
