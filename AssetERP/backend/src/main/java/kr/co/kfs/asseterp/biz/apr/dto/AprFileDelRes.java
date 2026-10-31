package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDateTime;

/** 삭제된 첨부파일 한 줄 (AS-IS Sys61_FileDelModel) */
public record AprFileDelRes(Long fileDelId, Long fileId, Long parentId, String fileName, String personName, LocalDateTime delDate, String reason) {
}
