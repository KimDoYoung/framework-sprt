package kr.co.kfs.asseterp.biz.sys.dto;

import java.time.LocalDate;

/** 관리정보 탭 저장 (AS-IS Sys01_TabPage_Info01.update → Sys01_Company.update). 그리드에서 편집하는 컬럼만 */
public record CompanyManageReq(
        Long companyId,
        String loginSecureYn,
        String companyNm,
        String locNm,
        String mailInfo,
        String emgrcyPasswd,
        String erpProductCd,
        String contType,
        LocalDate noticeDate,
        LocalDate closeDate,
        String icamCompanyCd,
        String icamAdvisCompanyCd,
        String assetYn,
        String advisYn,
        String pbsYn,
        String useYn) {
}
