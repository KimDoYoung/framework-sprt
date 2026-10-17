package kr.co.kfs.asseterp.biz.ics.dto;

/** 체크리스트 분류 콤보 항목 (AS-IS sys.Sys09_Code.selectByIcs21·selectByIcs23: sys09_code = 분류 ID 문자열, sys09_name = 분류명) */
public record IcsChecklistClassCodeRes(String code, String name) {
}
