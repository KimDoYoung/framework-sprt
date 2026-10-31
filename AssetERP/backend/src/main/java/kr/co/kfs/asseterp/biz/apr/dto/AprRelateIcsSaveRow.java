package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDate;

/** 연관법규 저장할 줄 — 새 줄은 relateIcsId가 비고 classTreeId·deadlineId를 준다 */
public record AprRelateIcsSaveRow(Long relateIcsId, Long classTreeId, Long deadlineId, String standCode, LocalDate standDate, LocalDate closeDate) {
}
