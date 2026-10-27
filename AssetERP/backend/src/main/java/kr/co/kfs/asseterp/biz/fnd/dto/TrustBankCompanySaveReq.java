package kr.co.kfs.asseterp.biz.fnd.dto;

/** Fnd09_Tab_TrustBank 저장 요청 (수탁은행코드·수탁은행명·사용여부·비고·기타 수탁은행코드 01~10) */
public record TrustBankCompanySaveReq(
        Long trustBankId,
        String trustBankCode,
        String trustBankName,
        String useYn,
        String note,
        String etcTrustBankCode01,
        String etcTrustBankCode02,
        String etcTrustBankCode03,
        String etcTrustBankCode04,
        String etcTrustBankCode05,
        String etcTrustBankCode06,
        String etcTrustBankCode07,
        String etcTrustBankCode08,
        String etcTrustBankCode09,
        String etcTrustBankCode10
) {
}
