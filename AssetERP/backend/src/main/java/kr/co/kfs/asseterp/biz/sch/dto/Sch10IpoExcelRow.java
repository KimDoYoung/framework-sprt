package kr.co.kfs.asseterp.biz.sch.dto;

import java.time.LocalDate;

/** 공모주 일정 엑셀 한 줄 (ExcelUpload.ipoUpload). 날짜가 없으면 null */
public record Sch10IpoExcelRow(Long ipoId, Long companyId, String marketCode, String itemName, String issCorpCode,
                               LocalDate demandStartDate, LocalDate demandCloseDate, LocalDate subscriptionStartDate,
                               LocalDate subscriptionCloseDate, LocalDate payDate, LocalDate listDate,
                               String priceBracket, Long price, String note, String cancelYn) {
}
