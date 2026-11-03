package kr.co.kfs.asseterp.biz.scm.dto;

import java.time.LocalDateTime;

/** scm13_dev_program.selectByDevId — 개발 프로그램 + 프로그램(scm30) 열 */
public record DevProgramRes(Long devProgramId, Long devId, Long programId, String modiType, String deployTgtYn, Long deploySeq,
                            String deployYn, Long deployerId, LocalDateTime deployDate, String deployNote,
                            String systemCd, String programType, String programCd, String programNm, String source, Long version,
                            Long personId, LocalDateTime regDate, String note, String useYn,
                            String modiTypeNm, String systemNm, String programTypeNm, String regDateStr) {
}
