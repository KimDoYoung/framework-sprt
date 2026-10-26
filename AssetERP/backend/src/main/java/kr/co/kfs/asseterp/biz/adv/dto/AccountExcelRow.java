package kr.co.kfs.asseterp.biz.adv.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

/** 일임계좌 엑셀 업로드 한 행 (Q01, AS-IS ExcelUpload.adv02Upload — adv02_account.insert 값) */
public record AccountExcelRow(
        Long accountId, Long companyId, String manageCode, String manageName, String trCorpCode, String trCorpName,
        String accountNoDec, LocalDate startDate, LocalDate closeDate, LocalDateTime workDate, String worker) {
}
