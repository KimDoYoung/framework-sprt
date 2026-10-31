package kr.co.kfs.asseterp.biz.pay.dto;

import java.time.LocalDate;

/** 급여대장 상신 행의 급여 구분 (pay05_relate_appr — A02 제목의 구분명은 화면의 "지급일 / 구분명" 글자와 같다, V25) */
public record PayRelateApprBase(Long relateApprId, String payCode, LocalDate startDate, String payGroupName) {
}
