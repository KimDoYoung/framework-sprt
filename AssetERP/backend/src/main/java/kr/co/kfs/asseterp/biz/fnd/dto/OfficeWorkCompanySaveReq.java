package kr.co.kfs.asseterp.biz.fnd.dto;

/** Fnd06_Tab_OfficeWork 저장 요청 (사무수탁사 코드·사무수탁사명·금융투자협회코드·신한펀드·사용여부·비고) */
public record OfficeWorkCompanySaveReq(
        Long officeWorkId,
        String officeWorkCode,
        String officeWorkName,
        String kofiaCode,
        String etcOfficeWorkCode01,
        String officeWorkUseYn,
        String officeWorkNote
) {
}
