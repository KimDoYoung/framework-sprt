package kr.co.kfs.asseterp.biz.pay.dto;

/** 자주 쓰는 계정과목 (AS-IS Pay52_FavoriteAccountModel). 전체 계정과목 보기에서는 favoriteAccountId가 임시 번호다 */
public record FavoriteAccountRes(
        Long favoriteAccountId,
        Long accountCodeId,
        Long seq,
        String accountCode,
        String accountName,
        String attributeCode,
        String attributeName
) {
}
