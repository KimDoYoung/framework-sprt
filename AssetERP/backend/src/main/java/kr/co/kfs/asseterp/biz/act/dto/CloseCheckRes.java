package kr.co.kfs.asseterp.biz.act.dto;

public record CloseCheckRes(
        Long closeCheckId,
        Long companyId,
        String companyName,
        String depositRealMatchYn,
        String depositApprYn,
        String depositLedgerMatchYn,
        String financeEvalYn,
        String financeLedgerMatchYn,
        String fxEvalYn,
        String depnYn,
        String tangibleMatchYn,
        String intangibleMatchYn,
        String fundFeeMatchYn,
        String fundFeeEvalYn,
        String unfixYn,
        String supplyMatchYn
) {
}
