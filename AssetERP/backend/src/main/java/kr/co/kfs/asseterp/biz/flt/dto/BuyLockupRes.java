package kr.co.kfs.asseterp.biz.flt.dto;

/** 매수제한 검사 결과 (AS-IS Flt08_BuyLockup.checkLockup) — status OK(적용) / CONFIRM(확인 뒤 적용, AS-IS -1) / REJECT(막음, AS-IS -2) */
public record BuyLockupRes(String status, String message) {
}
