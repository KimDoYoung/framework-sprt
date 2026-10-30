package kr.co.kfs.asseterp.biz.biz.dto;

/** 사용항목별 계정과목 맵핑 한 행 (AS-IS Biz03_AccountMapModel — Biz03_Lookup_AccountMap 오른쪽 그리드) */
public record BizAccountMapRes(Long accountMapId, String useItemCode, Long accountCodeId, String accountCode, String accountName) {
}
