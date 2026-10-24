package kr.co.kfs.asseterp.biz.tdm.dto;

/** 미점검·반려·당월발생 미흡 한 행 (AS-IS tdm52_chck_manl.selectDashboardUndone 중 이 화면 그리드가 쓰는 열) */
public record DashboardUndoneRes(
        Long chckManlId,
        String orgName,
        String checkerName,
        String checkItem,
        String checkCycleName,
        String checkStatusName
) {
}
