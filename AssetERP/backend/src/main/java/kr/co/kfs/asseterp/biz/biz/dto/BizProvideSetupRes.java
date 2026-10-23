package kr.co.kfs.asseterp.biz.biz.dto;

/**
 * 이익제공(수령) 내용 자동등록 설정 한 행 (AS-IS Biz04_ProvideSetupModel — Biz04_Lookup_EmpSetup 오른쪽 그리드).
 * 설정이 없는 내용은 provideSetupId가 순번(rownum)으로 나온다
 */
public record BizProvideSetupRes(
        Long provideSetupId,
        Long companyId,
        String provideContentCode,
        String provideContentName,
        String empSetYn
) {
}
