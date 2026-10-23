package kr.co.kfs.asseterp.biz.biz.dto;

import java.time.LocalDate;

/** 이익제공 상세현황 [출력/다운로드] — 조회 조건과 같다. crmName은 전체면 `%`, empId는 없으면 null */
public record BizProvideListPrintReq(LocalDate startDate, LocalDate endDate, String provideRcvType, String crmName, Long empId) {
}
