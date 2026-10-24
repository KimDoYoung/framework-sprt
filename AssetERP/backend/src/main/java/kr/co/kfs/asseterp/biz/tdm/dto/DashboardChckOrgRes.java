package kr.co.kfs.asseterp.biz.tdm.dto;

/** 임원별(직책별)·부서별 진행현황 한 행 (AS-IS tdm51_chck_org.selectDashboardExct / selectDashboardOrg) — 쓰지 않는 쪽 이름은 null */
public record DashboardChckOrgRes(
        Long chckOrgId,
        String exctName,
        String roleName,
        String orgName,
        Double progRate,
        Long monthCheckCnt,
        Long monthManlUndoneCnt,
        Long monthCheck1Cnt,
        Long monthCheck2Cnt,
        Long monthCheck9Cnt
) {
}
