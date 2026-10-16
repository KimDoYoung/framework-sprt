package kr.co.kfs.asseterp.biz.sys.dto;

/** 경영·회계 탭 저장 (AS-IS Sys01_TabPage_Info04.update → Sys01_Company.update). 그리드에서 편집하는 컬럼만 */
public record CompanyAccountReq(
        Long companyId,
        String leaveMonthCd,
        String leaveYn,
        Long leaveCompulsionRt,
        String taxType,
        String cardRealUserYn,
        String incomeTaxFilingCd,
        String accountCloseMonth,
        String ownerCapitalApplyCd,
        String astManagerAutoYn,
        String astEvalCycleCd,
        String empEvalCycleCd,
        String empEvalMonthCd) {
}
