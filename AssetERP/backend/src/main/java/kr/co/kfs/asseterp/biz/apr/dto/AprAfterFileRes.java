package kr.co.kfs.asseterp.biz.apr.dto;

/** 결재완료후 첨부파일 한 줄 (AS-IS Sys10_FileModel — 파일명·인감날인본) */
public record AprAfterFileRes(Long fileId, Long parentId, String fileName, boolean stampYn) {
}
