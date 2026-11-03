package kr.co.kfs.asseterp.biz.act.dto;

import java.time.LocalDate;

/** 결산회기관리 저장 한 행 — 화면이 바꾸는 컬럼만 (accountNumId ≤ 0 이면 새 행) */
public record AccountNumSaveReq(
        Long accountNumId,
        Long num,
        LocalDate startDate,
        LocalDate closeDate,
        String note
) {
}
