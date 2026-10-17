package kr.co.kfs.asseterp.biz.sch.dto;

/** 기본 기한 콤보 항목 (AS-IS sys.Sys00_Common.selectDeadLine: sys09_code = 기한 ID 문자열, sys09_name = 기한 이름) */
public record Sch03DeadlineTemplateRes(String code, String name) {
}
