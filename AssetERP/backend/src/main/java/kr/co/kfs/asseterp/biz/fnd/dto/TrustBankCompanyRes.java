package kr.co.kfs.asseterp.biz.fnd.dto;

/** Fnd09_TrustBankModel (R12 Fnd09_Tab_TrustBank — 회사별 수탁은행정보 관리 #1100, 기타 수탁은행코드 01~10 포함) */
public record TrustBankCompanyRes(
        Long trustBankId,
        String trustBankCode,
        String trustBankName,
        String useYn,
        String note,
        Long companyId,
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
