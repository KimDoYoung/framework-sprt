package kr.co.kfs.asseterp.biz.org.dto;

import java.time.LocalDate;

/** 조직기구현황 출력 자료 만들기 — 기준일은 기준년월의 말일 (AS-IS Org02_Rd_OrgState.getCloseDate1) */
public record OrgStateRdReq(LocalDate baseDate) {
}
