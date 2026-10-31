package kr.co.kfs.asseterp.biz.apr.dto;

import java.util.List;

/** [연관펀드설정] [확정] — 창에 보이는 전체 줄 (AS-IS Apr03_RelateFund.insert의 updateList, V16) */
public record AprAfterFundSaveReq(List<AprApprRelateReq.Fund> funds) {
}
