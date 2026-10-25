package kr.co.kfs.asseterp.biz.tdm.dto;

/** 점검시작·시작취소 (AS-IS tdm.Tdm52_ChckManl.updateCheckStatus) — personId는 화면의 점검자, actionType P(점검시작)·C(시작취소) */
public record CheckStatusReq(Long chckOrgId, Long personId, String actionType) {
}
