package kr.co.kfs.asseterp.biz.fnd.dto;

/** Fnd06_OfficeWorkModel 중 Fnd06_Tab_OfficeWorkManager 그리드 열 (+ 저장에 쓰는 id·회사) */
public record OfficeWorkRes(Long officeWorkId, String officeWorkName, String officeWorkCode, String kofiaCode, String etcOfficeWorkCode01,
                            String useYn, String note, Long companyId) {
}
