package kr.co.kfs.asseterp.biz.biz.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/** 법인카드 현황(A35)·접대비 현황(A36) 상신 기록 (AS-IS Biz01_Tab_CardReport·Biz01_Tab_EntertmExpenseReport.updateApprId → biz.Biz05_RelateAppr.insert) */
public record BizRelateApprDataYmReq(@NotBlank String dataYm, @NotNull Long apprId, @NotBlank String linkCode) {
}
