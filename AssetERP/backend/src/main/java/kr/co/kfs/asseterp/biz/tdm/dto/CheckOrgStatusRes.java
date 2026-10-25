package kr.co.kfs.asseterp.biz.tdm.dto;

/** 부서 점검현황 그리드 한 행 + 확정·승인요청 판단 값 (AS-IS Tdm51_ChckOrgModel — tdm51_chck_org.selectByOrgId) */
public record CheckOrgStatusRes(Long chckOrgId, Long chckJobId, Long orgId, String checkYm,
                                String roleName, String exctName,
                                Long taskCnt, Long detailCnt, Long dutyCnt, Long manlCnt, Long monthManlCnt,
                                Long monthCheckCnt, Long monthCheck1Cnt, Long monthCheck2Cnt, Long monthCheck9Cnt,
                                Long insuffCnt, Boolean checkEndYn, String orgStatusCode, String orgStatusName,
                                Boolean fixYn, Boolean checkStatusAll10Yn, Boolean insuffUnActionYn, Boolean insuffRejectYn,
                                String checkStatusCode, String checkStatusName) {
}
