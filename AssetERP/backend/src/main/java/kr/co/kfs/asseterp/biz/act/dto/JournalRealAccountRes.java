package kr.co.kfs.asseterp.biz.act.dto;

/** 관리계좌(종목분류)에 맞는 실계정 (act13_real_account_map.selectByAstClassTreeId) */
public record JournalRealAccountRes(String accountCode, String accountName, String realAccountName) {
}
