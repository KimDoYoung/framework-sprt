package kr.co.kfs.asseterp.biz.pay.dto;

import java.time.LocalDate;

/** 적용일 생성(Pay04_Lookup_Insert)·기초데이터생성(basicDataCreate)의 요청 — companyId는 기초데이터생성에서만 쓴다 */
public record PayFormulaCreateReq(Long companyId, LocalDate startDate) {
}
