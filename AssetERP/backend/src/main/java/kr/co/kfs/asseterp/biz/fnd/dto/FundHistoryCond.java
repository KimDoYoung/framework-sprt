package kr.co.kfs.asseterp.biz.fnd.dto;

/** 펀드 조회(변경이력) 조건 (P08). searchText는 %…%, closeYn은 'true'면 해지 펀드 포함 */
public record FundHistoryCond(Long companyId, String closeYn, String searchText) {
}
