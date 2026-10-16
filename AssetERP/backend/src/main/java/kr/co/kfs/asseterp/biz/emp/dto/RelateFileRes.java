package kr.co.kfs.asseterp.biz.emp.dto;

import java.time.LocalDateTime;

/** 연관파일 행 (AS-IS Emp18_RelateFileModel — emp18_relate_file + sys10_file) */
public record RelateFileRes(Long relateFileId, Long personId, String note,
                            Long fileId, LocalDateTime regDate, String fileName, Double size) {
}
