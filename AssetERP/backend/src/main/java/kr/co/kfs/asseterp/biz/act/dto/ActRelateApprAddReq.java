package kr.co.kfs.asseterp.biz.act.dto;

import jakarta.validation.constraints.NotNull;

/** AS-IS act.Act80_RelateAppr.modelUpdate — 상신 문서를 거래 또는 전표에 연결한다. 둘 중 하나만 주면 서버가 다른 쪽을 채운다 */
public record ActRelateApprAddReq(@NotNull Long apprId, Long trId, Long journalId) {
}
