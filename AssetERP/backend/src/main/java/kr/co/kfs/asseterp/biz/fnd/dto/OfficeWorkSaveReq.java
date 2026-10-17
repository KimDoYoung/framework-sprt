package kr.co.kfs.asseterp.biz.fnd.dto;

/** 사무수탁사 저장 한 행 — 화면이 고치는 열(사무수탁사코드·협회코드·신한펀드·비고)과 새 행 INSERT에 쓰는 이름·사용여부 */
public record OfficeWorkSaveReq(Long officeWorkId, String officeWorkName, String officeWorkCode, String kofiaCode, String etcOfficeWorkCode01,
                                String useYn, String note) {
}
