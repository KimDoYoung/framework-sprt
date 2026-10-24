package kr.co.kfs.asseterp.biz.tdm.dto;

/** 점검년월의 마감 정보 (AS-IS tdm50_chck_job.selectByCheckYm 중 endYn·endDate). 날짜는 yyyy-MM-dd */
public record DashboardCheckEndRes(
        Boolean endYn,
        String endDate
) {
}
