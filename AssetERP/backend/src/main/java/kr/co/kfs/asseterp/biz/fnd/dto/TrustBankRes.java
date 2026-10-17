package kr.co.kfs.asseterp.biz.fnd.dto;

/** Fnd09_TrustBankModel 중 Fnd09_Tab_TrustBankManager 그리드 열 (+ id·회사) */
public record TrustBankRes(Long trustBankId, String trustBankCode, String trustBankName, String useYn, String note, Long companyId) {
}
