package kr.co.kfs.asseterp.biz.adv.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

/** 일임/자문 고객계좌 한 행 (Q01, AS-IS Adv02_AccountModel) — 계좌번호는 복호화한 값(accountNoDec) */
public record AccountRes(
        Long accountId, Long companyId, String manageCode, String manageName, String trCorpCode, String trCorpName,
        String accountNoDec, LocalDate startDate, LocalDate closeDate, LocalDateTime workDate, String worker) {
}
