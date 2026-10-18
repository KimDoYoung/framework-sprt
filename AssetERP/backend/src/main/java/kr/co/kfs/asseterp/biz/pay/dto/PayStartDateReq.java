package kr.co.kfs.asseterp.biz.pay.dto;

import java.time.LocalDate;

/** 적용일 생성 요청 */
public record PayStartDateReq(LocalDate startDate) {
}
