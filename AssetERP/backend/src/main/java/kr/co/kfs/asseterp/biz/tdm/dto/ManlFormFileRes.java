package kr.co.kfs.asseterp.biz.tdm.dto;

/** 연결할 책무점검 양식 파일 한 행 (AS-IS Sys10_FileModel 중 Tdm43_Lookup_RelateFormFileList 그리드 열) */
public record ManlFormFileRes(Long fileId, String tdmCheckFormTypeName, String fileName, String note, String regDate) {
}
