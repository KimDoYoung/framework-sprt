package kr.co.kfs.asseterp.biz.act.dto;

public record CloseCheckSaveReq(
        Long closeCheckId,
        Long companyId,
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
