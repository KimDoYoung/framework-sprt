package kr.co.kfs.asseterp.biz.sys.dto;

import java.time.LocalDate;

/** sys01_company INSERT 값 (AS-IS UpdateDataModel이 넣는 값 중 null이 아닌 것) */
public record CompanyRow(
        Long companyId,
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
