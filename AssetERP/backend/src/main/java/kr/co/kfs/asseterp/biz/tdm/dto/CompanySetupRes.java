package kr.co.kfs.asseterp.biz.tdm.dto;

import java.time.LocalDate;

/** 책무관리 시스템설정 한 행 (AS-IS tdm91_company_setup.selectByCompanyId·selectById, Tdm91_CompanySetupModel) */
public record CompanySetupRes(
        Long companySetupId,
        LocalDate startDate,
        Long cmntMinLimit,
        String batchCheckUseYn,
        String batchApprUseYn,
        String evidFileCheckYn,
        String note) {
}
