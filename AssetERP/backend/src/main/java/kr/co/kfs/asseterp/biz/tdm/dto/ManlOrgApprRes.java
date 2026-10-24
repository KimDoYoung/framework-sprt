package kr.co.kfs.asseterp.biz.tdm.dto;

/** 부서별 매뉴얼 보고 그리드 한 행 (AS-IS Tdm42_ManlOrgModel 중 Tdm42_Tab_ManlOrgAppr 그리드·결재요청·문서보기·잠금에 쓰는 속성) */
public record ManlOrgApprRes(Long manlOrgId, Long companyId, Long orgId, Long roleId, Long exctId,
                             String roleName, String exctName,
                             Long taskCnt, Long taskRelateDetailCnt, Long taskRelateDutyCnt, Long manlCnt,
                             Boolean manlDutyEndYn, String manlDutyEndDate,
                             String startDate, String endDate, Boolean lockYn, String startDateYnStr,
                             Long apprId, String apprStatusCode, String apprStatusName, String jobName) {
}
