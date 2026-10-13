package kr.co.kfs.asseterp.biz.sys.dto;

/**
 * 경영·회계 탭 행 (AS-IS Sys01_TabPage_Info04 ← sys01_company.selectById).
 * Y/N·휴가의무사용율은 AS-IS 모델 getter 기본값을 SQL COALESCE로 맞춘다(05 §6).
 */
public record CompanyAccountRes(
        Long companyId,
        String leaveMonthCd,
        String leaveMonthNm,
        String leaveYn,
        Long leaveCompulsionRt,
        String taxType,
        String taxTypeNm,
        String cardRealUserYn,
        String incomeTaxFilingCd,
        String incomeTaxFilingNm,
        String accountCloseMonth,
        String accountCloseMonthNm,
        String ownerCapitalApplyCd,
        String ownerCapitalApplyNm,
        String astManagerAutoYn,
        String astEvalCycleCd,
        String astEvalCycleNm,
        String empEvalCycleCd,
        String empEvalCycleNm,
        String empEvalMonthCd,
        String empEvalMonthNm) {
}
