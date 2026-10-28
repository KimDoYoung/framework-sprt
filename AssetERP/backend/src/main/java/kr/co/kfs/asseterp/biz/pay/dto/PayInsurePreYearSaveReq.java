package kr.co.kfs.asseterp.biz.pay.dto;

import java.util.List;

/** 전년도분 보수총액 저장 — AS-IS pay.Pay31_InsureApply.updateList(year = 기준년도 입력값) */
public record PayInsurePreYearSaveReq(
        String year,
        List<PayInsurePreYearRowReq> rows
) {
}
