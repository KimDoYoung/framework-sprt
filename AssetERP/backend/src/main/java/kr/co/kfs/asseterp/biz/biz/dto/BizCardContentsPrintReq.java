package kr.co.kfs.asseterp.biz.biz.dto;

/** 법인카드 사용내역 출력·엑셀 자료 만들기 — managerId·providePurCode는 `%`가 전체, searchText는 감싸기 전 글자 */
public record BizCardContentsPrintReq(String dataYm, String managerId, String providePurCode, String searchText) {
}
