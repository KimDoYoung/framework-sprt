package kr.co.kfs.asseterp.biz.bbs.dto;

/** [저장] 그리드 — 공개여부만 */
public record ApplicationFormSaveReq(Long applicationFormId, Boolean publicYn) {
}
