package kr.co.kfs.asseterp.biz.ics.dto;

import java.time.LocalDateTime;

/** Sys10_FileModel 중 Ics01_Lookup_IcsFileAdmin 그리드 열 (등록일·법령구분·내용·서식파일명) + 파일 id */
public record IcsFormFileRes(Long fileId, LocalDateTime regDate, String lawName, String note, String fileName) {
}
