package kr.co.kfs.asseterp.biz.scm.dto;

import java.time.LocalDate;

/** AS-IS Scm11_Edit_DevStep.updateRow(Scm11_DevStep.modelUpdate) 요청 — 비고·결과상세·시작일·완료예정일 (EE17) */
public record DevStepUpdateReq(Long devId, String resultCd, String result, String note, LocalDate startDate, LocalDate dueDate) {
}
