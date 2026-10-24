package kr.co.kfs.asseterp.biz.tdm.dto;

/**
 * 관리의무 복사(copyDutyList)가 새 작업·직책·부서에 맞춰 넣을 점검항목 한 행 (AS-IS tdm43_manl.selectByDutyId).
 * orgId는 원본 점검항목의 부서, manlOrgId는 넣을 부서 책무매뉴얼이다.
 */
public record ManlCopyRow(Long manlId, Long manlOrgId, Long companyId, Long orgId, Long exctId, Long roleId, String roleName,
                          Long taskId, String taskName, Long taskRelateDetailId, String taskRelateDetailName,
                          Long taskRelateDutyId, String taskRelateDutyName, String checkItem, String checkCycleCode,
                          String checkMonth, String checkHow, String refBasis, String startDate, Long manlDutyId,
                          String manlCode, String checkEvidDocName, String ceoDutyCode, String importLevelCode,
                          String exctDutyMap) {
}
