package kr.co.kfs.asseterp.biz.tdm.dto;

import java.time.LocalDate;

/** 시스템설정 저장 한 행 — companySetupId ≤ 0이면 INSERT (AS-IS Tdm91_CompanySetup.update, UpdateDataModel) */
public record CompanySetupSaveReq(
        Long companySetupId,
        LocalDate startDate,
        Long cmntMinLimit,
        String batchCheckUseYn,
        String batchApprUseYn,
        String evidFileCheckYn,
        String note) {
}
