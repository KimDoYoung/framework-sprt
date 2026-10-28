package kr.co.kfs.asseterp.biz.pay.dto;

import java.util.List;

/** Pay24_Lookup_DeductTable — 공제한도(dataCode 1 첫 행의 limitAmt, 없으면 0) + 근로소득공제표(dataCode 2) */
public record PayRetireDeductRes(Long limitAmt, List<PayDeductTableRes> rows) {
}
