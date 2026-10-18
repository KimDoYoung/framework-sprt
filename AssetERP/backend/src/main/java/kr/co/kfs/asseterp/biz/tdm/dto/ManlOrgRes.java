package kr.co.kfs.asseterp.biz.tdm.dto;

/** 책무매뉴얼 재생성 그리드 한 행 (AS-IS Tdm42_ManlOrgModel 중 화면·재생성·보기·점검항목 조회창에 쓰는 속성) */
public record ManlOrgRes(Long manlOrgId, Long companyId, String companyName, String orgName, String roleName,
                         Long exctId, String exctName, Boolean manlDutyEndYn, String manlDutyEndDate,
                         Long taskCnt, Long taskRelateDetailCnt, Long taskRelateDutyCnt, Long manlCnt,
                         String startDate, String endDate, String startDateYnStr,
                         String apprStatusCode, String apprStatusName, String jobName, Boolean lockYn) {
}
