package kr.co.kfs.asseterp.biz.tdm.dto;

/**
 * 부서 책무매뉴얼의 점검항목 한 행 (AS-IS Tdm43_ManlModel 중 Tdm43_Lookup_ManlItem 그리드·삭제와, 등록·수정창(다음 단계)이 넘겨받는 속성).
 * 점검항목이 아직 없는 관리의무 행은 manlCode가 null이고 manlId는 번호만 채운 값이다.
 */
public record ManlItemRes(Long manlId, Long manlOrgId, Long orgId, Long exctId, Long roleId, String roleName,
                          Long taskId, String taskName, Long taskRelateDetailId, Long taskRelateDutyId, Long manlDutyId,
                          String manlCode, String taskDetailAddSeq, String taskDutyAddSeq, String checkItemAddCode,
                          String checkHowLimit, String checkCycleName, String checkEvidDocName, Boolean unuseYn) {
}
