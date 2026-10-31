package kr.co.kfs.asseterp.biz.sch.dto;

import java.util.List;

/** 일일업무체크 상신 뒤 결재문서 ID 기록 (AS-IS Sch04_Tab_DailyCheckList.updateApprId — 그리드 전체 행 + apprId) */
public record Sch04ApprIdReq(List<Long> ids, Long apprId) {
}
