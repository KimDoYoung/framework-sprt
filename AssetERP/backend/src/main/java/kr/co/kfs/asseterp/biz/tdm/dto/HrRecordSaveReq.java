package kr.co.kfs.asseterp.biz.tdm.dto;

/** 인사정보 저장 한 행 (AS-IS Tdm02_HrRecord.updateApplyCode: 적용여부 코드와 비고) */
public record HrRecordSaveReq(
        Long hrRecordId,
        String applyCode,
        String note) {
}
