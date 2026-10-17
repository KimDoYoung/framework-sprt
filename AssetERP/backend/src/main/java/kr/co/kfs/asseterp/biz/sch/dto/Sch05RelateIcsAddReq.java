package kr.co.kfs.asseterp.biz.sch.dto;

/** 연관 내부통제 추가 (AS-IS Sch05_RelateIcs.modelUpdate): 법규와 그 기한 한 쌍 */
public record Sch05RelateIcsAddReq(Long icsClassTreeId, Long deadlineId) {
}
