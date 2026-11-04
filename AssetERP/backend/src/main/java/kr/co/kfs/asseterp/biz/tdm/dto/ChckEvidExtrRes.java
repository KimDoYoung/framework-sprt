package kr.co.kfs.asseterp.biz.tdm.dto;

/** 외부보관 증빙자료 한 행 (AS-IS Tdm64_ChckEvidExtrModel, EE49). docDate는 yyyy-MM-dd */
public record ChckEvidExtrRes(Long chckEvidExtrId, Long targetId, String systemName, String docNo, String docName, String docDate, String note) {
}
