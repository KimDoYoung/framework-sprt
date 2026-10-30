package kr.co.kfs.asseterp.biz.pay.dto;

import jakarta.validation.constraints.NotEmpty;

import java.util.List;

/** 계정과목 저장 — accountCode가 있으면 일괄저장(모든 행에 그 코드), 없으면 행마다 자기 accountCode (AS-IS updateAccountCode) */
public record ExpenseAccountCodeReq(
        String accountCode,
        @NotEmpty List<ExpenseNewRes> rows
) {
}
