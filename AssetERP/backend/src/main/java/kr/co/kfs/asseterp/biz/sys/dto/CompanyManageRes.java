package kr.co.kfs.asseterp.biz.sys.dto;

import java.time.LocalDate;

/**
 * 관리정보 탭 행 (AS-IS Sys01_TabPage_Info01 ← sys01_company.selectById).
 * Y/N 컬럼은 DB 값을 그대로(null 포함) 돌려준다 — AS-IS는 화면에서만 null을 꺼짐으로 보이고 저장할 때 null을 그대로 둔다.
 */
public record CompanyManageRes(
        Long companyId,
        String loginSecureYn,
        String companyNm,
        String locNm,
        String mailInfo,
        String emgrcyPasswd,
        String erpProductCd,
        String erpProductNm,
        String contType,
        LocalDate noticeDate,
        LocalDate closeDate,
        String icamCompanyCd,
        String icamAdvisCompanyCd,
        String assetYn,
        String advisYn,
        String pbsYn,
        String useYn,
        String note,
        String bizNo) {
}
