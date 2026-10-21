package kr.co.kfs.asseterp.biz.flt.dto;

/** 책임자보고 > 매월신고대상임직원 (AS-IS flt10_tr.selectByStdDate) */
public record CeoReportPersonRes(Long trId, Long personId, String personName, String orgName, String apprEffectDate) {
}
