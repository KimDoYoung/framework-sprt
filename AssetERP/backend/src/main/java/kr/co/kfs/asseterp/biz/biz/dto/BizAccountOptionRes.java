package kr.co.kfs.asseterp.biz.biz.dto;

/** 제공내역에 연결된 계정과목 (AS-IS sys.Sys00_Common.selectByProvideContentCode → sys09 코드 모양) */
public record BizAccountOptionRes(Long accountCodeId, String accountCode, String accountName) {
}
