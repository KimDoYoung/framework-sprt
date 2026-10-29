package kr.co.kfs.asseterp.biz.pay.dto;

/** 조회순서 저장 (AS-IS pay.Pay52_FavoriteAccount.update — 화면이 바꾸는 열은 seq 하나) */
public record FavoriteAccountSeqReq(Long favoriteAccountId, Long seq) {
}
