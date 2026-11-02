package kr.co.kfs.asseterp.biz.ast.dto;

import java.time.LocalDate;

/** AS-IS Sys99_Print.insertRdFxEvalDeposit 파라미터 (closeDate = 평가년월의 말일) */
public record FxEvalRdReq(LocalDate closeDate, Long corpId, Long accountId) {
}
