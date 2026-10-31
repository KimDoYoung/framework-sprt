package kr.co.kfs.asseterp.biz.apr.dto;

/** 쓰기 전에 보는 문서 한 줄 (apr01_appr, V03) */
public record AprApprBrief(Long apprId, Long regEmpId, String statusCode, Long classTreeId, String advertYn) {
}
