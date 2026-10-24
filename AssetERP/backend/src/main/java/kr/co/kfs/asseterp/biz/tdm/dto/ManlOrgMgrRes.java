package kr.co.kfs.asseterp.biz.tdm.dto;

/** 매뉴얼 관리 그리드 한 행 (AS-IS Tdm42_ManlOrgModel 중 Tdm42_Tab_ManlManager 그리드·결재요청·문서보기·잠금·점검항목 조회창에 쓰는 속성) */
public record ManlOrgMgrRes(Long manlOrgId, Long companyId, Long orgId, Long roleId, Long exctId,
                            String orgName, String roleName, String exctName,
                            Long taskCnt, Long taskRelateDetailCnt, Long taskRelateDutyCnt,
                            Long manlCnt, Long manlUseCnt, Long manlUnuseCnt,
                            Boolean manlDutyEndYn, String manlDutyEndDate,
                            String startDate, String endDate, Boolean lockYn, String startDateYnStr,
                            Long apprId, String apprStatusCode, String apprStatusName, String jobName) {
}
