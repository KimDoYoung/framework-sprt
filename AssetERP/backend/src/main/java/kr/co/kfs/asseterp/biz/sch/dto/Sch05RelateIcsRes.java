package kr.co.kfs.asseterp.biz.sch.dto;

/** 연관 내부통제 한 행 (AS-IS Sch05_RelateIcsModel, E04): 체크리스트(infoId)에 연결한 법규(icsClassTreeId)와 그 기한(deadlineId) */
public record Sch05RelateIcsRes(Long relateIcsId, Long infoId, Long icsClassTreeId, Long deadlineId, String icsClassTreeFullName, String deadlineName, String cycleName) {
}
