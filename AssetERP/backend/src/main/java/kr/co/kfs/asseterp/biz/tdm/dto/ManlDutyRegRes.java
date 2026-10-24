package kr.co.kfs.asseterp.biz.tdm.dto;

/**
 * 매뉴얼(점검항목) 작성 화면 위 그리드 한 행 (AS-IS Tdm41_ManlDutyModel 중 Tdm43_Tab_ManlItemReg가 쓰는 속성 — selectByOrgIdPaging).
 * manlDutyId·manlOrgId·orgId·exctId·직책/책무/세부/관리의무 id·이름은 아래 점검항목 등록·불러오기에 그대로 넘어간다.
 */
public record ManlDutyRegRes(Long manlDutyId, Long manlJobId, Long manlOrgId, Long orgId, Long exctId, Long roleId, String roleName,
                             Long taskId, String taskName, Long taskRelateDetailId, String taskRelateDetailName,
                             Long taskRelateDutyId, String taskRelateDutyName, Long manlCnt, Boolean endYn, String endDate,
                             String endEmpName) {
}
