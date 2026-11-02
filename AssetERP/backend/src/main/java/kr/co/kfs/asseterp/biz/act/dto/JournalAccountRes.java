package kr.co.kfs.asseterp.biz.act.dto;

/** 기간 중 분개가 있는 계정 한 행 (act02_journal.getAccountCode·getOneAccountCode — AS-IS는 trCode·trName 이름으로 담았다) */
public record JournalAccountRes(String trCode, String trName) {
}
