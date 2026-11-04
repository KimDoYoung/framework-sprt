package kr.co.kfs.asseterp.biz.att.dto;

import java.time.LocalDate;

/** 출근·퇴근·외근 후 퇴근 요청 (on: 출근 true / 퇴근 false, 외근 후 퇴근은 사용 안 함) */
public record AttMyCommuteReq(Boolean on, LocalDate baseDate) {
}
