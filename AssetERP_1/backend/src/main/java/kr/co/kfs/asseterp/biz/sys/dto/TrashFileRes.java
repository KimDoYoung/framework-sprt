package kr.co.kfs.asseterp.biz.sys.dto;

import java.time.LocalDateTime;

/** 미사용 파일 한 행 (AS-IS Sys10_FileModel 중 미사용 파일조회 그리드 열 + 확장자). fileExt는 파일보기 조회창이 쓴다 */
public record TrashFileRes(Long fileId, Long parentId, String fileNm, LocalDateTime regDate, String serverPath, Double size, String fileExt) {
}
