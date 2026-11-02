package kr.co.kfs.asseterp.biz.ast.dto;

import java.time.LocalDate;

/** AS-IS ast06_tr.selectFxEvalList / selectById — 외화예금 환평가(3700) 그리드 한 행. evalYnName은 평가했으면 "평가" */
public record FxEvalRes(
        Long trId,
        Long astClassTreeId,
        Long depositId,
        LocalDate date,
        String trCode,
        Long companyId,
        String curCode,
        Double fxRate,
        Double forAmt,
        Long depositBookAmt,
        Long corpId,
        Long journalId,
        String classTreeName,
        String corpAccountName,
        String evalYnName,
        Long amt,
        String note,
        Long personId,
        String personName
) {
}
