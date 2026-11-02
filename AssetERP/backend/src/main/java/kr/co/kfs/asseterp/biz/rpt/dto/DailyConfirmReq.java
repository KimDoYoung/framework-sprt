package kr.co.kfs.asseterp.biz.rpt.dto;

import java.util.List;

/** 확인/확인취소 (AS-IS Rpt01_Daily.confirmUpdate) — confirmYn true = 확인, false = 확인취소 */
public record DailyConfirmReq(List<Long> dailyIds, boolean confirmYn) {
}
