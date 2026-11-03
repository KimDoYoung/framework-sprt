package kr.co.kfs.asseterp.biz.biz.dto;

/** sys.Sys99_Print.insertRdContCorp — 출력/다운로드 조건(조회 조건 + 정렬 1 계약일기준 / 2 계약만료일기준) */
public record BizContPrintReq(String searchText, boolean check, String stdYear, String statusCode, boolean statusCheck, String endMonth, String sortType) {
}
