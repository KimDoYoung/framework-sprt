package kr.co.kfs.asseterp.biz.scm.dto;

import java.time.LocalDateTime;

/** scm30_program.selectBySystemCode (Scm30_Lookup_Program, EE19) — 프로그램 버전 한 줄 */
public record ProgramVersionRes(Long programId, String systemCd, String programType, String programCd, String programNm, String source,
                                Long version, Long personId, LocalDateTime regDate, String note, String useYn,
                                Long fileId, Long fileParentId, String fileNm,
                                String systemNm, String programTypeNm, String regDateStr, String deployDateStr, String personNm) {
}
