package kr.co.kfs.asseterp.biz.apr.dto;

/** 상신 문서에 붙은 첨부파일 한 줄 — 옵션설정(출력·확장자·순서)과 추가/삭제 창이 쓴다 (AS-IS Sys10_FileModel) */
public record AprEditFileRes(Long fileId, Long parentId, String fileName, String fileExt, String fileYn, String titleYn, boolean printYn, boolean extYn, String seq) {
}
