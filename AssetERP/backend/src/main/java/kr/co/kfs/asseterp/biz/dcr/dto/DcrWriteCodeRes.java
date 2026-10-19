package kr.co.kfs.asseterp.biz.dcr.dto;

/** 문서작성 분류 콤보 한 항목 (AS-IS sys.Sys09_Code.selectByDcrLv1~3·selectByDcrDetail의 sys09_code·sys09_name) */
public record DcrWriteCodeRes(Long code, String name) {
}
