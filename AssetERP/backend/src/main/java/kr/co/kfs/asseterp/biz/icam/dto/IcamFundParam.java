package kr.co.kfs.asseterp.biz.icam.dto;

/** selectByNamePaging·selectByNameTotal 조건: 고른 회사의 한 펀드 이력 */
public record IcamFundParam(Long companyId, String fundCode, int offset, int limit) {
}
