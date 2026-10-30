package kr.co.kfs.asseterp.biz.crd.dto;

import java.time.LocalDate;

/** crd.Crd01_Card.update (Crd01_Edit_Card 저장) — cardId가 없거나 0 이하면 새 카드. 회사는 로그인 값 */
public record CrdCardSaveReq(
        Long cardId,
        String bankCode,
        String cardName,
        String cardNoSlip,
        String cardNo,
        LocalDate frDate,
        LocalDate toDate,
        String closeYn,
        String cardType,
        String note,
        Long depositId
) {
}
