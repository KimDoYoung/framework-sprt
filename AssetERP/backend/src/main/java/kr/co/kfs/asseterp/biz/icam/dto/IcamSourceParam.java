package kr.co.kfs.asseterp.biz.icam.dto;

import java.time.LocalDate;

/** serverType·sourceType·nameSearchText·sourceSearchText는 LIKE 패턴(AS-IS가 "%"·"%text%"로 만들어 보낸 값) */
public record IcamSourceParam(LocalDate stdDate, String serverType, String sourceType, String nameSearchText, String sourceSearchText, int offset, int limit) {
}
