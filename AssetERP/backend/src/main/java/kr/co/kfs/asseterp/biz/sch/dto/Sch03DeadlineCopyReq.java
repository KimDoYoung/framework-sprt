package kr.co.kfs.asseterp.biz.sch.dto;

/** 기한 불러오기 (AS-IS Sch03_Lookup_Ics·Sch03_Lookup_Icr.load → sch.Sch03_Deadline.updateModel): 기본 기한(deadlineId)을 법규·내규(infoId)에 복사. scheduleCode는 법규 "2"(없으면), 내규 "6" */
public record Sch03DeadlineCopyReq(Long deadlineId, Long infoId, String scheduleCode) {
}
