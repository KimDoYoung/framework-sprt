package kr.co.kfs.asseterp.oms.biz.sys.dto;

import java.time.LocalDate;

/** 고객사 등록·수정 (AS-IS Sys01_Edit_Company, Sys01_TabPage_Info01/02) */
public record CompanySaveReq(
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
