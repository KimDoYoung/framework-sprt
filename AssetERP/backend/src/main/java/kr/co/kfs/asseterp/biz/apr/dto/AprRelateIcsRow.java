package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDate;

/** 연관법규 한 줄 (AS-IS Apr20_RelateIcsModel — 법규 + 기한 + 기준일·마감일). relateIcsId가 없으면 아직 저장 안 한 새 줄 */
public record AprRelateIcsRow(Long relateIcsId, Long classTreeId, String classTreeFullName, String content, String submitTo, String relatedLaw,
                              Long deadlineId, String deadlineFullName, String deadlineNote, String cycleName, String standCode, LocalDate standDate, LocalDate closeDate, String standYn) {
}
