package kr.co.kfs.asseterp.biz.fnd.dto;

import java.time.LocalDate;

/** 펀드규약 조회 한 행 (P13, AS-IS Fnd25_TermsModel 중 selectBySearchTextManager 그리드 열) */
public record TermsViewRes(
        Long termsId,
        String termsTypeName,
        String termsName,
        String ksdFundCode,
        String fundName,
        String trustBankName,
        LocalDate fundStartDate,
        String kofiaFundTypeName,
        LocalDate revisionDate,
        Long revisionNo,
        LocalDate endExpectDate
) {
}
