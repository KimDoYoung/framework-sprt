package kr.co.kfs.asseterp.biz.fnd.dto;

import java.time.LocalDate;

/** #1503 [엑셀다운로드] 한 행 (AS-IS fnd26_terms_detail.selectByCompanyId → Sys99_Print.insertRdFundTermsManager가 sys99_print에 싣는 열) */
public record TermsExcelRow(
        String termsTypeName,
        String ksdFundCode,
        String fundFullName,
        String trustBankName,
        LocalDate fundStartDate,
        LocalDate endExpectDate,
        LocalDate revisionDate,
        Long revisionNo,
        Long fileCnt,
        LocalDate closeDate,
        String note,
        String updName,
        String updDateStr
) {
}
