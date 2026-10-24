package kr.co.kfs.asseterp.biz.tdm.dto;

/** 미흡 조치현황 한 행 (AS-IS tdm54_chck_insuff.selectDashboardInsuff 중 이 화면 그리드가 쓰는 열). 날짜는 yyyy-MM-dd */
public record DashboardInsuffRes(
        Long chckInsuffId,
        String checkYm,
        String dueDate,
        String actionDate,
        String actionDueDate,
        String statusName,
        String orgName,
        String actionEmpName,
        String actionName
) {
}
