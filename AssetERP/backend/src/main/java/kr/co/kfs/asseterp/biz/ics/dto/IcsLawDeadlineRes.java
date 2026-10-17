package kr.co.kfs.asseterp.biz.ics.dto;

/** 법규 + 그 기한 한 쌍 (AS-IS Ics01_Lookup_SelectMulti "deadline": ics.Ics01_ClassTree.selectByListIcsId — 법규 하나에 기한이 여럿이면 여러 행, E04) */
public record IcsLawDeadlineRes(Long classTreeId, String classTreeFullName, Long deadlineId, String deadlineFullName, String cycleName) {
}
