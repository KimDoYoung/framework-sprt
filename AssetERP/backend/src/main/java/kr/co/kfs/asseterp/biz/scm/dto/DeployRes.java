package kr.co.kfs.asseterp.biz.scm.dto;

import java.time.LocalDate;

/** AS-IS scm11_dev_step.selectByDeployPersonId 한 줄 — 배포처리 위쪽 목록 (EE18) */
public record DeployRes(Long devStepId, Long devId, LocalDate srDate, String systemCd, String systemNm, String devNote,
                        String devPersonNm, String resultDateStr, Long deployCount, String devStepResult, String srNo) {
}
