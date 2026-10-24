package kr.co.kfs.asseterp.biz.tdm.dto;

/** 책무점검 현황 모니터 (AS-IS tdm51_chck_org.selectDashboardProgress): 진행율·적정비율·점검결과 정보(HTML 조각 포함) */
public record DashboardProgressRes(
        Double progRate,
        Double suffRate,
        String checkCntInfo
) {
}
