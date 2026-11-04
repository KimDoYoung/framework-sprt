package kr.co.kfs.asseterp.biz.flt.dto;

/** 법규준수서약서 상신 상태 (AS-IS Flt04_OathModel — flt04_oath.selectByPersonId): 상신ID·결재상태 코드/이름. 서약서 행이 없으면 응답 자체가 null */
public record EmpOathRes(Long apprId, String statusCode, String statusName) {
}
