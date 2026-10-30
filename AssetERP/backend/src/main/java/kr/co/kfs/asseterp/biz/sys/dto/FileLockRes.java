package kr.co.kfs.asseterp.biz.sys.dto;

import java.time.LocalDateTime;

/** AS-IS sys.Sys10_File.selectByParentId2 — 파일 한 행 + 잠김(lockYn: 정산·결의서에서 따라온 파일이라 지울 수 없음). 연관문서 창(Act80_LookupGrid_RelateFile, W05)이 쓴다 */
public record FileLockRes(Long fileId, Long parentId, String fileNm, LocalDateTime regDate, String serverPath, Double size, String note,
                          String fileExt, String fileYn, String titleYn, String seq, boolean lockYn) {
}
