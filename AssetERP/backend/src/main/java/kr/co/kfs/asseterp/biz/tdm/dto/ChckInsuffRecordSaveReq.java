package kr.co.kfs.asseterp.biz.tdm.dto;

import java.util.List;

/** 조치기록 저장 요청 (AS-IS recordUpdate — 삭제 목록 먼저, 그 다음 바뀐 행) */
public record ChckInsuffRecordSaveReq(List<Long> deleteIds, List<ChckInsuffRecordReq> rows) {
}
