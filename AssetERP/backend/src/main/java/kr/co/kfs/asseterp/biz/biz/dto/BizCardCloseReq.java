package kr.co.kfs.asseterp.biz.biz.dto;

/** [마감]·[취소] (AS-IS Biz01_Promo.cardClose). procType P=마감 / C=취소 */
public record BizCardCloseReq(String dataYm, String procType) {
}
