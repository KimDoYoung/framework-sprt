package kr.co.kfs.asseterp.biz.rpt.dto;

import java.time.LocalDate;

/** 주간업무보고 확인 목록 한 줄 (AS-IS rpt03_week.selectByCompanyId → Rpt03_WeekModel) */
public record WeekConfirmRes(Long weekId, Long personId, LocalDate weekStartDate, LocalDate weekCloseDate,
                             String orgName, String personName, Long orgCodeId, String orgCd,
                             Long confirmerId, String confirmer, String confirmerOrgName,
                             String confirmDateStr, String confirmNote, boolean confirmYn) {
}
