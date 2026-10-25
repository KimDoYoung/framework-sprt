package kr.co.kfs.asseterp.biz.tdm.dto;

/** 미흡/개선 내역(조치계획) 한 건 (AS-IS tdm54_chck_insuff.selectByChckManlId, Tdm54_ChckInsuffModel) */
public record ChckInsuffRes(Long chckInsuffId, Long companyId, Long roleId, Long orgId, String regDate, String dueDate,
                            Long planActionEmpId, String planActionEmpName, String actionName, String actionPlan,
                            Long planRegEmpId, String statusCode, Long chckManlId, String occYm) {
}
