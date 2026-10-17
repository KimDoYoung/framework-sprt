package kr.co.kfs.asseterp.biz.fnd.dto;

/** 수탁은행 저장 한 행 (그리드 편집 열) */
public record TrustBankSaveReq(Long trustBankId, String trustBankCode, String trustBankName, String useYn, String note) {
}
