package kr.co.kfs.asseterp.biz.pay.dto;

/** AS-IS Pay10_Month.checkAppr 결과 — ok=false면 message가 status -1 문구. 화면의 enabled() 판정이 예외 없이 쓰도록 값으로 돌려준다 */
public record PayApprCheckRes(boolean ok, String message) {
}
