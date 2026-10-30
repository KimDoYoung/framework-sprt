package kr.co.kfs.asseterp.biz.ast.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

/** 투자한도/StopLoss 한 행(Ast41_Lookup_InvestLimit 오른쪽 그리드) — ast41_invest_limit */
public record InvestLimitRes(Long investLimitId, LocalDate startDate, String investAssetType, String investAssetName,
                             BigDecimal limitRate, BigDecimal stopLossRate, String note) {
}
