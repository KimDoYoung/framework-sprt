package kr.co.kfs.asseterp.biz.ics.dto;

import java.time.LocalDateTime;

/** Sys10_FileModel 중 Ics01_Tab_IcsFileUpload 그리드 열 (법령구분·내용·등록일·서식파일) + 파일 id·법령구분 코드 */
public record IcsFormFileAdminRes(Long fileId, String lawType, String lawName, String note, LocalDateTime regDate, String fileName) {
}
