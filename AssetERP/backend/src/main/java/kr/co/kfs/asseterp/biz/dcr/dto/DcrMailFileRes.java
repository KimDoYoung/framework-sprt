package kr.co.kfs.asseterp.biz.dcr.dto;

/** 발신메일 첨부파일 (AS-IS Sys10_FileModel 중 상세보기창 그리드가 쓰는 것, sys10_file.selectMailFileHistory) */
public record DcrMailFileRes(Long fileId, String fileName) {
}
