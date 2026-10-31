package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDateTime;

/** 최근 결재선 불러오기 창의 문서 한 줄 (apr01_appr.selectByWeek·selectByDcrGroup, V08) */
public record AprRecentDocRes(Long apprId, String statusName, LocalDateTime regDate, String classTreeNameAllpath, String title) {
}
