package kr.co.kfs.asseterp.biz.scm.dto;

import java.time.LocalDate;

/** scm10_dev.selectBySrId — 개발자 그리드 한 줄 */
public record DevRes(Long devId, Long srId, Long personId, LocalDate startDate, LocalDate dueDate, String note, LocalDate regDate,
                     String arrangeNote, String personNm, LocalDate srDate, String srNo, String systemNm, String requestor,
                     LocalDate resultDate, String devStepResult, Long devProgramCnt, Long fileCnt) {
}
