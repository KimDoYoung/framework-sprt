package kr.co.kfs.asseterp.biz.pay.dto;

import java.time.LocalDate;

/** 적용일 목록 한 행 — 간이세액표·공제표·인적공제금액 탭의 왼쪽 그리드(적용일별 첫 행) */
public record PayStartDateRes(Long id, LocalDate startDate) {
}
