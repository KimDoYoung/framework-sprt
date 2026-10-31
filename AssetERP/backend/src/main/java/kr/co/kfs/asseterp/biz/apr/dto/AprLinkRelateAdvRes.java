package kr.co.kfs.asseterp.biz.apr.dto;

/** 링크 문서를 열자마자 연관일임 탭에 넣을 일임계좌 한 줄 (A26·A38 공모주, V38) */
public record AprLinkRelateAdvRes(Long advId, String manageCode, String manageName) {
}
