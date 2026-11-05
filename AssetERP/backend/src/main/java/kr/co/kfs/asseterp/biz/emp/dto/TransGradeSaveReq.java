package kr.co.kfs.asseterp.biz.emp.dto;

/** 특정직위 및 알림설정 저장 행 (AS-IS Emp03_Lookup_Grade.update: emp03 특정직위 + emp25 알림설정) */
public record TransGradeSaveReq(
        Long transId,
        Long personId,
        String gradeCode,
        Boolean icsYn,
        Boolean apprYn
) {
}
