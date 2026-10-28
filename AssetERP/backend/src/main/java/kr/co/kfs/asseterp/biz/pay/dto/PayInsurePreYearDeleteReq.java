package kr.co.kfs.asseterp.biz.pay.dto;

import java.util.List;

/** 전년도분 보수총액 삭제 — AS-IS pay.Pay31_InsureApply.deleteList(year = 기준년도 입력값) */
public record PayInsurePreYearDeleteReq(
        String year,
        List<Long> ids
) {
}
