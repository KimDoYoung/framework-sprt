package kr.co.kfs.asseterp.biz.tdm.dto;

/** 부서 점검현황 그리드 한 행 (AS-IS Tdm51_ChckOrgModel — selectByRoleId) */
public record ChckOrgRes(Long chckOrgId, Long orgId, String orgName, Long orgManagerId, String orgManagerName,
                         Long dutyCnt, Long manlCnt, Long monthManlCnt, Long monthManlDoneCnt, Long monthManlUndoneCnt,
                         String orgStatusCode, String orgStatusName) {
}
