package kr.co.kfs.asseterp.biz.icr.dto;

/** Icr01_Lookup_SelectMulti "deadline": 내규 하나에 기한이 여럿이면 여러 행 */
public record IcrClassTreeDeadlineRes(Long classTreeId, String classTreeFullName, Long deadlineId, String deadlineFullName, String cycleName) {
}
