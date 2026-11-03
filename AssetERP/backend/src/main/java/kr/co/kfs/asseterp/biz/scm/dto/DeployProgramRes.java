package kr.co.kfs.asseterp.biz.scm.dto;

import java.time.LocalDateTime;

/** AS-IS scm13_dev_program.selectByDeployTgtDevId 한 줄 — 배포처리 아래쪽 목록 (EE18). 소스보기 창이 쓰는 프로그램(scm30) 열을 모두 담는다 */
public record DeployProgramRes(Long devProgramId, Long devId, Long programId, String modiType, String deployTgtYn, Long deploySeq,
                               String deployYn, Long deployerId, LocalDateTime deployDate, String deployNote, String deployDateStr,
                               String systemCd, String programType, String programCd, String programNm, String source, Long version,
                               Long personId, LocalDateTime regDate, String note, String useYn, String systemNm, String programTypeNm,
                               String regDateStr, String personNm) {
}
