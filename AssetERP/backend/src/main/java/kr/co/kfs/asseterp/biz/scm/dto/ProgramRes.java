package kr.co.kfs.asseterp.biz.scm.dto;

import java.time.LocalDateTime;

/** scm30_program.selectByTextPaging */
public record ProgramRes(Long programId, String systemCd, String programType, String programCd, String programNm, String source,
                         Long version, Long personId, LocalDateTime regDate, String note, String useYn,
                         String systemNm, String programTypeNm, String regDateStr, Long fileId, Long fileParentId, String fileNm) {
}
