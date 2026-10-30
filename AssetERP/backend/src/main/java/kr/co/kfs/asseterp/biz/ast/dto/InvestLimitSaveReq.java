package kr.co.kfs.asseterp.biz.ast.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

/** 투자한도/StopLoss 저장 요청 한 행 — investLimitId ≤ 0이면 신규(startDate는 선택한 적용일) */
public record InvestLimitSaveReq(Long investLimitId, LocalDate startDate, String investAssetType, BigDecimal limitRate,
                                 BigDecimal stopLossRate, String note) {
}
