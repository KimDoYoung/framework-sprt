package kr.co.kfs.asseterp.biz.ast.dto;

/**
 * 비품대장 등록 저장 (AS-IS Ast06_Lookup_TrBizCard.preUpdate/update → ast.Ast06_Tr.updateDepn).
 * 금액·승인번호·일자는 promoId의 카드 승인정보에서 서버가 읽는다(AS-IS는 화면이 들고 있던 값을 보냈다)
 */
public record TrBizCardSaveReq(Long promoId, String trCode, Long corpId, Long astClassTreeId, String note) {
}
