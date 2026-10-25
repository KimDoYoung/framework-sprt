package kr.co.kfs.asseterp.biz.tdm.dto;

/** 작업정보등록 (AS-IS tdm.Tdm50_ChckJob.modelUpdate) — chckJobId는 selectByCheckYm이 준 값(없는 달이면 새 ID) */
public record CheckJobSaveReq(Long chckJobId, String checkYm, String checkName, String startDate, String endDate) {
}
