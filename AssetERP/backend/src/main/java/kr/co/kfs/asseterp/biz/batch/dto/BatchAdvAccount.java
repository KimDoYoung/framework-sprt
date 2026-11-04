package kr.co.kfs.asseterp.biz.batch.dto;

import java.time.LocalDate;

/** adv02_account 한 건 (AS-IS Adv02_AccountModel). 계좌번호는 평문(accountNoDec), 저장 때 암호화한다 */
public record BatchAdvAccount(
        Long accountId,
        Long companyId,
        String manageCode,
        String manageName,
        String trCorpCode,
        String trCorpName,
        String accountNoDec,
        LocalDate startDate,
        LocalDate closeDate,
        String worker
) {
}
