package kr.co.kfs.asseterp.biz.fnd.dto;

import java.time.LocalDate;

/** 펀드규약 한 행 (P12, AS-IS Fnd26_TermsDetailModel 중 selectBySearchText 열). 원본 2026-10-28: 규약명 빠짐, 펀드 정식명·만기일. 최종 제개정일·개정회차는 원본이 빠뜨려 빈칸이지만 TOBE는 남김(원본-이상한점 #231) */
public record TermsRes(
        Long termsId,
        String termsType,
        String termsTypeName,
        Long seq,
        Long fundId,
        String ksdFundCode,
        String fundFullName,
        String trustBankName,
        LocalDate fundStartDate,
        LocalDate endExpectDate,
        LocalDate revisionDate,
        Long revisionNo
) {
}
