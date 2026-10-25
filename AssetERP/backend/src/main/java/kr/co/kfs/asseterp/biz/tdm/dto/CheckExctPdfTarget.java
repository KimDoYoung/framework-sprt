package kr.co.kfs.asseterp.biz.tdm.dto;

/** 이행점검보고서 PDF 생성 대상 (AS-IS Tdm53_ChckExctModel 중 createRd·viewRd가 쓰는 속성) */
public record CheckExctPdfTarget(Long chckExctId, Long companyId, Long exctId, String updDate, String checkYm,
                                 String roleName, String exctName, String locName) {
}
