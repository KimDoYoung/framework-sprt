package kr.co.kfs.asseterp.biz.apr.dto;

/** 링크 문서를 열자마자 연관펀드 탭에 넣을 펀드 한 줄 (A26·A38 공모주, V38) */
public record AprLinkRelateFundRes(Long fundId, String fundTypeName, String fundCode, String fundName) {
}
