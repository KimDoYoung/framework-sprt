package kr.co.kfs.asseterp.biz.fnd.dto;

import java.time.LocalDate;

/** 펀드규약 개정 한 행 (P12, AS-IS Fnd26_TermsDetailModel 중 selectBySearchTextManager 열) */
public record TermsRevisionRes(
        Long termsDetailId,
        Long termsId,
        String termsName,
        String termsType,
        String termsTypeName,
        Long seq,
        Long fundId,
        String ksdFundCode,
        LocalDate revisionDate,
        Long revisionNo,
        Long fileCnt,
        Boolean useYn,
        LocalDate closeDate,
        String content,
        String note,
        String updName,
        String updDateStr
) {
}
