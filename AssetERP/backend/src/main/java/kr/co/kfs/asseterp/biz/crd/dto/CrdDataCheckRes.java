package kr.co.kfs.asseterp.biz.crd.dto;

/**
 * biz.Biz01_Promo.targetCheck / targetListCheck 결과 — status -1 거절(message), 0 진행, 1 확인 후 진행(message), 2 저장 완료.
 * count는 확정 대상 건수(전체내역확정 확인창 문구용)
 */
public record CrdDataCheckRes(int status, String message, int count) {
}
