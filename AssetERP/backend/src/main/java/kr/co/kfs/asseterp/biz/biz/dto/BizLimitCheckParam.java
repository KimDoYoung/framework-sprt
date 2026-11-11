package kr.co.kfs.asseterp.biz.biz.dto;

/**
 * 이익제공 한도초과현황 조회 조건 (AS-IS Biz01_Tab_LimitCheckList.retrieveTabpage 의 param, 2026-10-29 조회조건 추가).
 * provideRcvType은 LIKE 패턴('%' 전체). overCheck = [이익제공 편익 기준액 적용], limitCheck = [임의점검 이익제공 편익상대방 한도액]이고
 * limitCheck이면 limit1(인별 1회)·limit2(인별 연간)·limit3(회사별 연간)을 회사 한도 대신 쓴다(이익제공 쪽만)
 */
public record BizLimitCheckParam(
        Long companyId,
        String yearText,
        String provideRcvType,
        boolean overCheck,
        boolean limitCheck,
        Long limit1,
        Long limit2,
        Long limit3
) {
}
