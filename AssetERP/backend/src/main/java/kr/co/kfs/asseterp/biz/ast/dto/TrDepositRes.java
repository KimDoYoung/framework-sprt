package kr.co.kfs.asseterp.biz.ast.dto;

import java.time.LocalDate;

/** AS-IS ast06_tr.selectDepositTr / selectById — 계좌이체(9005) 그리드 한 행(편집창이 받는 값 포함). 건수 문자열 apprCnt는 "N 건" */
public record TrDepositRes(
        Long trId,
        LocalDate date,
        String trCode,
        Long astClassTreeId,
        String classTreeName,
        Long depositId,
        String depositName,
        Long corpId,
        String curCode,
        Long amt,
        Long fee,
        String note,
        Long personId,
        String personName,
        Long journalId,
        Long apprId,
        String apprCnt
) {
}
