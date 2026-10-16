package kr.co.kfs.asseterp.biz.sys.dto;

import java.time.LocalDateTime;

/**
 * 고객 목록·저장 결과 행 (AS-IS sys01_company.selectByName / selectById, Sys01_CompanyModel).
 * 이름(…Nm) 컬럼은 SQL이 f_cdnm으로 계산한다. Y/N 값은 AS-IS 모델 getter의 null 기본값을 SQL에서 맞춘다.
 */
public record CompanyRes(
        Long companyId,
        String companyNm,
        String locNm,
        String bizNo,
        String loginSecureYn,
        String icamCompanyCd,
        String icamAdvisCompanyCd,
        String useYn,
        String note,
        String empInfo,
        String mobileTelNo,
        String officeTelNo,
        String fullAddress,
        String companyRepNm,
        String mailInfo,
        String mailLogYn,
        String apprStepLockYn,
        String dcrNumberingNm,
        String dcrDetailUseYn,
        String aprManagerInfoYn,
        String leaveMonthNm,
        String leaveYn,
        Long leaveCompulsionRt,
        String icsCheckCycleNm,
        String icsComplyCycleNm,
        String taxTypeNm,
        String accountCloseMonthNm,
        String ownerCapitalApplyNm,
        String astManagerAutoYn,
        String icsGuideYn,
        LocalDateTime noticeDate,
        LocalDateTime startDate) {
}
