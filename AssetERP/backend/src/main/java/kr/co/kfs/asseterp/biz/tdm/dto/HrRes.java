package kr.co.kfs.asseterp.biz.tdm.dto;

import java.time.LocalDate;

/** 임원 등록 목록 한 행 (AS-IS tdm01_hr.selectByCompanyId → Tdm01_HrModel) */
public record HrRes(
        Long hrId,
        Long personId,
        String personName,
        String posName,
        String orgName,
        LocalDate hireDate,
        LocalDate retireDate,
        LocalDate endDate,
        String addTitle,
        String updName,
        String updDateStr
) {
}
