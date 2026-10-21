package kr.co.kfs.asseterp.biz.flt.dto;

/** 책임자보고 > 임직원계좌신고내역 (AS-IS flt03_account.selectByStdDate) */
public record CeoAccountRes(Long accountId, String apprEffectDate, String checkCycleName, String personName, String orgName,
                            String corpName, String accountNoDec, String accountName, String familyRelateName) {
}
