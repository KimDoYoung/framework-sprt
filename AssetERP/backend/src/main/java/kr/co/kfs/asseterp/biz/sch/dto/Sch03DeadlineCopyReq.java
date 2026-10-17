package kr.co.kfs.asseterp.biz.sch.dto;

/** 기한 불러오기 (AS-IS Sch03_Lookup_Ics.load → sch.Sch03_Deadline.updateModel): 기본 기한(deadlineId)을 법규(infoId)에 복사 */
public record Sch03DeadlineCopyReq(Long deadlineId, Long infoId) {
}
