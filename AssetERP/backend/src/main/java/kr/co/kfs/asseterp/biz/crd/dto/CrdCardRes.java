package kr.co.kfs.asseterp.biz.crd.dto;

import java.time.LocalDate;

/** crd.Crd01_Card.selectByText / selectById — 법인카드 한 줄. closeYn·Y/N은 'true'/'false' 문자열 */
public record CrdCardRes(
        Long cardId,
        Long companyId,
        String bankCode,
        String bankName,
        String cardName,
        String cardNoSlip,
        String cardNo,
        LocalDate frDate,
        LocalDate toDate,
        String closeYn,
        String cardType,
        String cardTypeName,
        String note,
        Long depositId,
        String depositName,
        String cardManagerName
) {
}
