package kr.co.kfs.asseterp.biz.scm.dto;

import java.time.LocalDate;

/** AS-IS Scm11_Edit_DevStep.updateStatus 요청 — 개발상태 버튼(진행중 20 / 완료 90 / 이행불가 10) (EE17) */
public record DevStepStatusReq(Long devId, String devStatusCd, String result, String note, LocalDate startDate, LocalDate dueDate) {
}
