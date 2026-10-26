package kr.co.kfs.asseterp.biz.fnd.dto;

/** 신규기획펀드 삭제 대상 — AS-IS GridDeleteData가 보내는 체크된 행(펀드코드 + 펀드정보) */
public record FundPlanDeleteReq(Long fundCodeId, Long fundInfoId) {
}
