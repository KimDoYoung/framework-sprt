package kr.co.kfs.asseterp.biz.ast.dto;

/** AS-IS sys.Sys00_Common.selectForDeposit (CommonComboBoxField) — 외화 예금계좌 한 건: sys09_code_id·sys09_code·sys09_name·sys09_corp_id */
public record ForeignDepositRes(Long codeId, String code, String name, Long corpId) {
}
