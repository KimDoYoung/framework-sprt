package kr.co.kfs.asseterp.biz.emp.dto;

/** 상위 조직장 (AS-IS emp00_trans_info.getHighInfo) — 순서대로 1차·2차 평가자 후보 */
public record HighInfoRes(Long personId, String orgTitleNm, String korNm) {
}
