package kr.co.kfs.asseterp.biz.sys.dto;

/** 전자결재·내부통제 탭 저장 (AS-IS Sys01_TabPage_Info03.update → Sys01_Company.update). 그리드에서 편집하는 컬럼만 */
public record CompanyApprovalReq(
        Long companyId,
        String apprStepLockYn,
        String companyRepNm,
        String aprManagerInfoYn,
        String dcrNumberingCd,
        String dcrDetailUseYn,
        String icsCheckCycleType,
        String icsComplyCycleType,
        String icsNonStayYn,
        String fltOnlyCurrYn,
        String icsGuideYn) {
}
