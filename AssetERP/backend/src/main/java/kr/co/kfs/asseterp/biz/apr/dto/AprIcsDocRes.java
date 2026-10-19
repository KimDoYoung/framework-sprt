package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDateTime;

/** 법규별 문서작성 목록 한 행(Ics01_Grid_ApprList). relateFundId는 연관펀드가 없으면 상신문서 id — 원본의 행 key */
public record AprIcsDocRes(Long relateFundId, Long apprId, LocalDateTime regDate, LocalDateTime effectDate, String regEmpName, String title) {
}
