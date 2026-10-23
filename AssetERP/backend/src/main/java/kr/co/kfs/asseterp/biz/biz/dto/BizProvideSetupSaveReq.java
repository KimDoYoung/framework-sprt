package kr.co.kfs.asseterp.biz.biz.dto;

/** 자동등록 설정 저장 한 행 (AS-IS Biz04_ProvideSetup.upsert). companyId는 서버가 로그인 회사로 채운다 */
public record BizProvideSetupSaveReq(
        Long provideSetupId,
        String provideContentCode,
        String empSetYn
) {
}
