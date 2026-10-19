package kr.co.kfs.asseterp.biz.ast.dto;

/** 화면별 사용 거래코드 (Ast15_TrCodeWindowModel). 화면 등록 행은 trCode가 없고, 거래코드 행은 windowClassName이 그 화면 */
public record TrCodeWindowRes(Long trCodeWindowId, Long companyId, String windowClassName, String menuFullName, String trCode, String trName, String note) {
}
