package kr.co.kfs.asseterp.biz.scm.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

/** scm11_dev_step.selectByDevId — 진행상태 창 한 줄 */
public record DevStepRes(Long devStepId, Long devId, String devStepSeq, String devStepCd, String devStatusCd, Long personId,
                         String resultCd, LocalDateTime resultDate, String result, String note,
                         String personNm, String devPersonNm, String devStepNm, String devStatusNm, String resultNm,
                         LocalDate regDate, LocalDate startDate, LocalDate dueDate, String resultDateStr,
                         LocalDate srDate, String srNo, String systemCd, String systemNm,
                         String devNote, String devArrangeNote, String arrangeResult, Long fileCount, String devStepResult) {
}
