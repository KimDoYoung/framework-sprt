package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDate;

/** 대결자 지정 저장 한 행 (AS-IS Apr07_AltAppr.update). altApprId가 없거나 0 이하면 새 행, targetEmpId는 서버가 로그인 사원으로 채운다. altEmpName은 중복 기간 메시지용 */
public record AprAltApprSaveReq(
        Long altApprId,
        Long altEmpId,
        String altEmpName,
        LocalDate startDate,
        LocalDate closeDate,
        String stampYn,
        String reasonCd,
        String emgrPoint
) {
}
