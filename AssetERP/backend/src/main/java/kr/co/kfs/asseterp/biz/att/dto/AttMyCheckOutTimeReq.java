package kr.co.kfs.asseterp.biz.att.dto;

import java.time.LocalDate;

/** 미등록 퇴근시간 (AS-IS Att02_Edit_CheckOutTime: 퇴근일 + HH:mm) */
public record AttMyCheckOutTimeReq(LocalDate checkOutTime, String checkOutTimeStr) {
}
