package kr.co.kfs.asseterp.biz.ast.dto;

import java.time.LocalDate;

/** 보수원장정리 — closeDate는 결산일자(결산년월의 말일) */
public record FundFeeCloseReprocReq(LocalDate closeDate) {
}
