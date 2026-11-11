package kr.co.kfs.asseterp.biz.tdm.dto;

/**
 * 부서 점검현황 그리드 한 행 (AS-IS Tdm51_ChckOrgModel — selectByRoleId).
 * 원본 2026-10-30(CH-0079·0145): 관리의무·점검항목 수 빠짐, 단계 Y/N 6개(점검자확정·점검시작·점검완료·승인요청·승인시작·승인완료)
 */
public record ChckOrgRes(Long chckOrgId, Long orgId, String orgName, Long orgManagerId, String orgManagerName,
                         Long monthManlCnt, Long monthManlDoneCnt, Long monthManlUndoneCnt,
                         String orgStatusCode, String orgStatusName,
                         Boolean statusFixYn, Boolean statusCheckStartYn, Boolean statusCheckEndYn,
                         Boolean statusApprRequestYn, Boolean statusApprStartYn, Boolean statusApprEndYn) {
}
