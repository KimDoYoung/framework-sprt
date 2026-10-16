package kr.co.kfs.asseterp.biz.sys.dto;

import java.time.LocalDate;

/** 신규고객사 등록 팝업 입력 (AS-IS Sys01_Edit_Company 편집 필드) */
public record CompanyCreateReq(
        String companyNm,
        String locNm,
        String emgrcyPasswd,
        LocalDate startDate,
        String mailInfo,
        String bizNo,
        String leaveMonthCd,
        String taxType,
        String accountCloseMonth) {
}
