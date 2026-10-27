package kr.co.kfs.asseterp.biz.fnd.dto;

/** Fnd06_OfficeWorkModel (R11 Fnd06_Tab_OfficeWork — 회사별 사무수탁사정보 관리 #1052, 원본 모델 속성명 officeWorkUseYn·officeWorkNote 유지) */
public record OfficeWorkCompanyRes(
        Long officeWorkId,
        String officeWorkCode,
        String officeWorkName,
        String officeWorkUseYn,
        String officeWorkNote,
        Long companyId,
        String etcOfficeWorkCode01,
        String etcOfficeWorkCode02,
        String etcOfficeWorkCode03,
        String etcOfficeWorkCode04,
        String etcOfficeWorkCode05,
        String etcOfficeWorkCode06,
        String etcOfficeWorkCode07,
        String etcOfficeWorkCode08,
        String etcOfficeWorkCode09,
        String etcOfficeWorkCode10,
        String kofiaCode
) {
}
