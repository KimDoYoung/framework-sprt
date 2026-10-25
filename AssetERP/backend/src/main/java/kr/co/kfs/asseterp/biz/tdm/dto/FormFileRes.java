package kr.co.kfs.asseterp.biz.tdm.dto;

/** 이행점검 연관양식 파일 한 행 (AS-IS Sys10_FileModel 중 Tdm43_Tab_RelateFormFileUpload 그리드·파일보기에 쓰는 열) */
public record FormFileRes(Long fileId, Long parentId, String tdmCheckFormType, String tdmCheckFormTypeName,
                          String fileName, String note, String regDate, String fileExt) {
}
