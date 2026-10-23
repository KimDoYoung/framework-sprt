package kr.co.kfs.asseterp.biz.biz.dto;

import java.time.LocalDate;

/** (s)이익제공 상세현황 [출력/다운로드] 자료 만들기. provideRcvType·crmName `%`는 전체 */
public record BizProvideSimplePrintReq(LocalDate startDate, LocalDate endDate, String provideRcvType, String crmName) {
}
