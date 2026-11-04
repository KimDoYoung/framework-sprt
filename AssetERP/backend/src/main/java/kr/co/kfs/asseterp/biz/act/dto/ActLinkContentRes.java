package kr.co.kfs.asseterp.biz.act.dto;

/** 제공내역에 연결된 계정과목 한 행 (AS-IS act14_link.selectByProvideContentCode — Act14_Lookup_LinkProvideContent) */
public record ActLinkContentRes(Long linkId, Long companyId, String accountCode, String accountName,
                                String provideContentCode, Long seq) {
}
