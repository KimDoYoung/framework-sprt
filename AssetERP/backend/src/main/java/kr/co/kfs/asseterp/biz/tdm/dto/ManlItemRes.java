package kr.co.kfs.asseterp.biz.tdm.dto;

/**
 * 부서 책무매뉴얼의 점검항목 한 행 (AS-IS Tdm43_ManlModel 중 Tdm43_Lookup_ManlItem 그리드·삭제와 Tdm43_Edit_Manl(등록·수정·보기)이 쓰는 속성).
 * 점검항목이 아직 없는 관리의무 행은 manlCode가 null이고 manlId는 번호만 채운 값이며 점검항목 입력 열(checkItem 등)이 비어 있다.
 */
public record ManlItemRes(Long manlId, Long manlOrgId, Long companyId, Long orgId, Long exctId, Long roleId, String roleName,
                          Long taskId, String taskName, Long taskRelateDetailId, String taskRelateDetailName,
                          Long taskRelateDutyId, String taskRelateDutyName, Long manlDutyId,
                          String manlCode, String taskDetailAddSeq, String taskDutyAddSeq, String checkItem, String checkItemAddCode,
                          String checkCycleCode, String checkMonth, String checkHow, String checkHowLimit, String checkCycleName,
                          String checkEvidDocName, String refBasis, String startDate, String ceoDutyCode,
                          String exctDutyMap, String exctDutyName, String importLevelCode, Boolean unuseYn) {
}
