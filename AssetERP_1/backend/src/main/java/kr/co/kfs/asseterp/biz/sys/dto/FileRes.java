package kr.co.kfs.asseterp.biz.sys.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDateTime;

/**
 * 첨부 파일 한 행 (AS-IS Sys10_FileModel, sys10_file).
 * 실제 파일은 {serverPath}/{fileId}(확장자 없음)에 있다 — serverPath는 서버 안에서만 쓰고 응답에는 내보내지 않는다.
 */
public record FileRes(
        Long fileId,
        Long parentId,
        String fileNm,
        LocalDateTime regDate,
        @JsonIgnore String serverPath,
        Double size,
        String note,
        String fileExt,
        String fileYn,
        String titleYn,
        String seq
) {
}
