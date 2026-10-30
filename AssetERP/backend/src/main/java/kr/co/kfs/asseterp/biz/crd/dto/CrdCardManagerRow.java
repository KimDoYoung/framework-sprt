package kr.co.kfs.asseterp.biz.crd.dto;

/** crd01_card.selectCardManager — 카드번호·승인일 기준 카드와 그날의 카드 사용자 */
public record CrdCardManagerRow(Long cardId, Boolean publicYn, Long cardManagerId) {
}
