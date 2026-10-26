package kr.co.kfs.asseterp.biz.sch.dto;

import java.time.LocalDate;

/** 출력/다운로드 (AS-IS sys.Sys99_Print.insertRdIpo 파라미터): 화면의 조회 조건과 같다 */
public record Sch10IpoPrintReq(String dateType, LocalDate startDate, LocalDate closeDate, String searchText, String marketCode, Boolean interestYn) {
}
