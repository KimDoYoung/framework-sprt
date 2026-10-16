package kr.co.kfs.asseterp.biz.sys.dto;

/**
 * 전자결재·내부통제 탭 행 (AS-IS Sys01_TabPage_Info03 ← sys01_company.selectById).
 * Y/N·코드는 AS-IS 모델 getter 기본값을 SQL COALESCE로 맞춘다(05 §6) — 이름은 원래 코드로 계산(원본과 같음).
 */
public record CompanyApprovalRes(
        Long companyId,
        String apprStepLockYn,
        String companyRepNm,
        String aprManagerInfoYn,
        String dcrNumberingCd,
        String dcrNumberingNm,
        String dcrDetailUseYn,
        String icsCheckCycleType,
        String icsCheckCycleNm,
        String icsComplyCycleType,
        String icsComplyCycleNm,
        String icsNonStayYn,
        String fltOnlyCurrYn,
        String icsGuideYn) {
}
