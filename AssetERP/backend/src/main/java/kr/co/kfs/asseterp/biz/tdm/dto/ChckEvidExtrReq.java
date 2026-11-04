package kr.co.kfs.asseterp.biz.tdm.dto;

/** 외부보관 증빙자료 저장 한 행 (AS-IS Tdm64_ChckEvidExtrModel). chckEvidExtrId가 0 이하면 신규, docDate는 yyyy-MM-dd */
public record ChckEvidExtrReq(Long chckEvidExtrId, String systemName, String docNo, String docName, String docDate, String note) {
}
