package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDate;

/** 대결자 지정(관리자) 저장 한 행 (AS-IS Apr07_AltAppr.update). altApprId가 없거나 0 이하면 새 행. 이름은 중복 기간 메시지용 */
public record AprAltApprMgrSaveReq(
        Long altApprId,
        Long targetEmpId, String targetEmpName,
        Long altEmpId, String altEmpName,
        LocalDate startDate, LocalDate closeDate, String stampYn, String reasonCd, String emgrPoint, String note
) {
}
