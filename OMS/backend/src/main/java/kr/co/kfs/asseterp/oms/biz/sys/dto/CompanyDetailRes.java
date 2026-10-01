package kr.co.kfs.asseterp.oms.biz.sys.dto;

import java.time.LocalDate;

/**
 * 고객사 상세 (AS-IS Sys01_CompanyModel, 고객별 시스템정보 관리). AS-IS의 ICAM 회사유형(sys01_icam_company_type)은 asseterpdb에 없어 뺐다.
 *
 * @param locNm         서브도메인 (sys01_loc_nm)
 * @param bizNo         사업자등록번호 (asseterpdb NOT NULL·UNIQUE)
 * @param emgrcyPasswd  회사암호
 * @param loginSecureYn 보안로그인(공인IP) 사용
 */
public record CompanyDetailRes(
        Long companyId,
        String companyNm,
        String locNm,
        String bizNo,
        String emgrcyPasswd,
        LocalDate startDate,
        LocalDate closeDate,
        boolean useYn,
        boolean loginSecureYn,
        String icamCompanyCd,
        String icamAdvisCompanyCd,
        String empInfo,
        String officeTelNo,
        String emailAddr,
        String note
) {
}
