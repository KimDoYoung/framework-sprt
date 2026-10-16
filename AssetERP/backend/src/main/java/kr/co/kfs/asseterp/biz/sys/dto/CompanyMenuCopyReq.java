package kr.co.kfs.asseterp.biz.sys.dto;

/** 매뉴권한복사(초기) (AS-IS Sys03_Lookup_CompanyMenu: outPut = 출발지 회사, inPut = 도착지 회사) */
public record CompanyMenuCopyReq(Long outPut, Long inPut) {
}
