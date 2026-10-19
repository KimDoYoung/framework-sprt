package kr.co.kfs.asseterp.biz.emp.dto;

import java.time.LocalDate;

/** 기준 적용일 생성 (AS-IS Emp40_Lookup_Insert.update — 적용년도·적용월의 1일) */
public record EvalListStdCreateReq(LocalDate startDate) {
}
