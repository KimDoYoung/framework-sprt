package kr.co.kfs.asseterp.biz.flt.dto;

/** 종목유형 콤보 한 행 (AS-IS sys00_common.selectByFltItemType — etcCode=주식시세적용, etcCode2=신고대상) */
public record ItemTypeCodeRes(Long codeId, String code, String name, Boolean stkPriceYn, Boolean targetYn) {
}
