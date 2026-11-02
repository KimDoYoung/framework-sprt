package kr.co.kfs.asseterp.biz.icam.dto;

import java.math.BigDecimal;

/** AS-IS Icam10_FeeModel — 펀드 하루의 적요별 보수(Ast30_Lookup_FeeDetail 그리드). fee는 차대 부호·이중운용 보정 적용 */
public record IcamFeeDetailRes(String rmkCode, String rmkName, String curCode, BigDecimal fee) {
}
