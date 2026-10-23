package kr.co.kfs.asseterp.biz.biz.dto;

import java.time.LocalDate;

/** 이익제공 한도초과현황 — 인별 1회 초과건 한 행 (AS-IS Biz01_PromoModel 중 Biz01_TabPage_PersonDay 그리드 열, L07) */
public record BizLimitPersonDayRes(String provideRcvTypeName, String regEmpName, LocalDate provideDate, String providePurName,
                                   String provideContentName, String targetEmpName, Long averagePrice, String note) {
}
