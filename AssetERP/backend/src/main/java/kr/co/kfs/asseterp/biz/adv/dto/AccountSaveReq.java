package kr.co.kfs.asseterp.biz.adv.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

/** 일임계좌 저장 요청 (Q01 Adv02_Edit_Account [저장]) — accountId가 없거나 0 이하면 새 행. 회사는 서버가 로그인 회사로 채운다 */
public record AccountSaveReq(
        Long accountId, String manageCode, String manageName, String trCorpCode, String trCorpName,
        String accountNoDec, LocalDate startDate, LocalDate closeDate, LocalDateTime workDate, String worker) {
}
