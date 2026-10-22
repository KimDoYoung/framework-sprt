package kr.co.kfs.asseterp.biz.ics.dto;

/** 한 기준일의 체크리스트별 미체크·미확인 건수 (K07, AS-IS ics11_checklist_company.selectChecklistStatus) */
public record IcsChecklistStatusCount(Long checklistId, String checkLClassName, String checkMClassName, long unCheckCnt, long unConfirmCnt) {
}
