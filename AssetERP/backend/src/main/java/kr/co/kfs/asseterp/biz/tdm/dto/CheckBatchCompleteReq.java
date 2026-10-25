package kr.co.kfs.asseterp.biz.tdm.dto;

import java.util.List;

/** 일괄점검 창 [점검완료] (AS-IS tdm.Tdm52_ChckManl.batchCheckComplete) — 점검결과 이름은 이력에 그대로 남긴다 */
public record CheckBatchCompleteReq(List<Long> chckManlIds, String checkDate, String checkResultCode, String checkResultName, String checkCmnt) {
}
