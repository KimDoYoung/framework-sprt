package kr.co.kfs.asseterp.biz.sch.dto;

/** 업무일정 보기 창 (AS-IS Sch01_Lookup_InfoView — sch01_info.selectByDeadLineId). deadlineName은 기한 이름(f_get_deadline_nm '2') */
public record Sch01InfoViewRes(Long infoId, String className, String title, String content, String report, String deadlineName, String note) {
}
