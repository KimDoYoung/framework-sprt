package kr.co.kfs.asseterp.biz.pay.dto;

import java.time.LocalDate;

/** 삭제할 전표의 일자·승인 여부 (AS-IS는 화면 행의 값을 보냈다 — TOBE는 DB 값으로 다시 본다) */
public record ExpenseJournalInfoRes(
        Long journalId,
        Long companyId,
        LocalDate occDate,
        Boolean journalFixYn
) {
}
