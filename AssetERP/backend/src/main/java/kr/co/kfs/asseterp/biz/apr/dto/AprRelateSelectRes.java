package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDate;

/**
 * 상신 때 고르는 법규/내규 한 줄 (AS-IS Apr20_RelateIcsModel·Apr22_RelateIcrModel — dcr20_relate_ics.insertIcs·dcr21_relate_icr.insertIcr 결과).
 * scheduleCodeCheck = 문서분류에 딸린 줄이면 "참고"(마감일 없음), 고른 법규/내규 자신이면 "" (마감일 = 오늘). relateId는 서버가 새로 발급한다
 */
public record AprRelateSelectRes(Long relateId, Long classTreeId, String classTreeName, String classTreeFullName, String content, String submitTo,
                                 String relatedLaw, String cycleName, Long deadlineId, String deadlineFullName, String deadlineNote,
                                 String scheduleCodeCheck, LocalDate closeDate) {
}
