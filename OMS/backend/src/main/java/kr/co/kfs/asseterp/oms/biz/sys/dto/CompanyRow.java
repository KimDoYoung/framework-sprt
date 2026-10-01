package kr.co.kfs.asseterp.oms.biz.sys.dto;

import java.time.LocalDate;

/** sys01_company INSERT/UPDATE 파라미터 ('true'/'false' 컬럼은 문자열) */
public record CompanyRow(
        Long companyId,
        String companyNm,
        String locNm,
        String bizNo,
        String emgrcyPasswd,
        LocalDate startDate,
        LocalDate closeDate,
        String useYn,
        String loginSecureYn,
        String icamCompanyCd,
        String icamAdvisCompanyCd,
        String empInfo,
        String officeTelNo,
        String emailAddr,
        String note
) {
    public static CompanyRow of(Long companyId, CompanySaveReq r) {
        return new CompanyRow(companyId, trim(r.companyNm()), trim(r.locNm()), trim(r.bizNo()), trim(r.emgrcyPasswd()),
                r.startDate(), r.closeDate(), String.valueOf(r.useYn()), String.valueOf(r.loginSecureYn()),
                trim(r.icamCompanyCd()), trim(r.icamAdvisCompanyCd()), trim(r.empInfo()), trim(r.officeTelNo()),
                trim(r.emailAddr()), r.note());
    }

    /** AS-IS spaceDelete: 앞뒤 공백 제거, 빈 값은 null */
    private static String trim(String s) {
        return s == null || s.isBlank() ? null : s.trim();
    }
}
