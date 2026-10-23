package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDateTime;

/** 이익제공 사전승인신청 목록 한 행 (AS-IS Apr01_ApprModel 중 Apr01_Tab_BizPriorApproval 그리드 열, L06). apprId는 상세보기용 */
public record AprPreProvideRes(Long apprId, LocalDateTime regDate, LocalDateTime effectDate, String classTreeNameAllPath, String title, String statusName) {
}
