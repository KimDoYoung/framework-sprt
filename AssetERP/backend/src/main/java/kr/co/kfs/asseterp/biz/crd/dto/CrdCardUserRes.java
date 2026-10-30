package kr.co.kfs.asseterp.biz.crd.dto;

import java.time.LocalDate;

/** crd.Crd03_Trans.selectByCardId — 카드 사용자(관리자) 이력 한 줄 */
public record CrdCardUserRes(
        Long transId,
        Long personId,
        Long cardId,
        LocalDate frDt,
        LocalDate toDt,
        String useYn,
        String publicYn,
        String personName,
        String titleName,
        String orgName
) {
}
