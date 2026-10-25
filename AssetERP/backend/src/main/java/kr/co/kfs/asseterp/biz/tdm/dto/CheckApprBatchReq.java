package kr.co.kfs.asseterp.biz.tdm.dto;

import java.util.List;

/** 일괄승인/일괄승인취소 요청 — actionType P·C */
public record CheckApprBatchReq(String actionType, List<Long> chckManlIds) {
}
