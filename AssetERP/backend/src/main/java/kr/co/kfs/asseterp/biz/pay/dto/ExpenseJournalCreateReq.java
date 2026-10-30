package kr.co.kfs.asseterp.biz.pay.dto;

import jakarta.validation.constraints.NotEmpty;

import java.util.List;

/** [전표생성] — 고른 회계처리 대상 내역과 "하나의 전표로 생성하기" 체크 (AS-IS createJournal의 oneJournalYn·목록) */
public record ExpenseJournalCreateReq(
        boolean oneJournalYn,
        @NotEmpty List<ExpenseNewRes> rows
) {
}
