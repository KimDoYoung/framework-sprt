package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDate;

/** 대결자 지정 저장 한 행 (AS-IS Apr07_AltAppr.update). altApprId가 없거나 0 이하면 새 행, targetEmpId는 서버가 로그인 사원으로 채운다. altEmpName은 중복 기간 메시지용, leaveId는 휴가신청 [대결자 지정] 창(Apr07_Lookup_AltAppr)이 새 행에 붙이는 휴가신청ID */
public record AprAltApprSaveReq(
        Long altApprId,
        Long altEmpId,
        String altEmpName,
        LocalDate startDate,
        LocalDate closeDate,
        String stampYn,
        String reasonCd,
        String emgrPoint,
        Long leaveId
) {
}
