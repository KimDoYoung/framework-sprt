package kr.co.kfs.asseterp.biz.ast.dto;

import java.time.LocalDate;

/** AS-IS ast06_tr.selectDepositTr 파라미터(assetType "1"·abroType "1"은 화면이 고정으로 보낸다). accountId 0은 서비스가 null로 */
public record TrDepositSearchCond(
        Long companyId,
        Long userId,
        Long orgId,
        LocalDate startDate,
        LocalDate closeDate,
        Long accountId
) {
}
