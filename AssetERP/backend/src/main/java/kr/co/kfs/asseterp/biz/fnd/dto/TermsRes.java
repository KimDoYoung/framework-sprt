package kr.co.kfs.asseterp.biz.fnd.dto;

import java.time.LocalDate;

/** 펀드규약 한 행 (P12, AS-IS Fnd26_TermsDetailModel 중 selectBySearchText 열 — 규약마다 사용 중인 최신 개정) */
public record TermsRes(
        Long termsId,
        String termsType,
        String termsTypeName,
        String termsName,
        Long seq,
        Long fundId,
        String ksdFundCode,
        String fundName,
        String trustBankName,
        LocalDate fundStartDate,
        LocalDate revisionDate,
        Long revisionNo
) {
}
