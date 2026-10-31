package kr.co.kfs.asseterp.biz.flt.dto;

import java.util.List;

/** 상신한 문서 ID를 기록할 행 목록 — A09(trIds, stdDate, checkCycle)·B05(accountIds)·B06(accountCloseIds) 공용 */
public record LinkApprIdReq(Long apprId, List<Long> ids, String stdDate, String checkCycle) {
}
