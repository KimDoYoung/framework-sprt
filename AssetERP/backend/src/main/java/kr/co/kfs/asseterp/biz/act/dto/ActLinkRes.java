package kr.co.kfs.asseterp.biz.act.dto;

/** 이익제공(수령) 연결정보 한 행 (AS-IS act14_link.selectByAccountCode) */
public record ActLinkRes(Long linkId, Long companyId, String accountCode, String provideContentCode, Long seq,
                         String provideName) {
}
