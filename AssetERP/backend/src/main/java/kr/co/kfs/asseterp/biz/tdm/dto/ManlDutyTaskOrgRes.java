package kr.co.kfs.asseterp.biz.tdm.dto;

/** 책무 · 담당부서별 관리의무 건수 한 행 (AS-IS tdm41_manl_duty.selectTaskAndOrg, N16 부서변경) */
public record ManlDutyTaskOrgRes(Long manlDutyId, Long companyId, Long manlJobId, Long roleId, Long exctId,
                                 Long taskId, String taskName, Long orgId, String orgName, Long taskRelateDutyCnt) {
}
