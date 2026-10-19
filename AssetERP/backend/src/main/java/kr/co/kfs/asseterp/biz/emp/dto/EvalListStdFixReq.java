package kr.co.kfs.asseterp.biz.emp.dto;

import java.time.LocalDate;

/** 확정(true)·확정취소(false) (AS-IS emp.Emp40_EvalListStd.updateFixYn) */
public record EvalListStdFixReq(LocalDate startDate, Boolean fixYn) {
}
