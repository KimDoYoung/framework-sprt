package kr.co.kfs.asseterp.biz.ics.dto;

import java.time.LocalDateTime;

/** Sys11_RelateFileModel 중 Ics01_Lookup_IcsFile 그리드 열 (서식파일명·등록일) + id */
public record IcsRelateFileRes(Long relateFileId, Long fileId, Long parentId, String fileName, LocalDateTime regDate) {
}
