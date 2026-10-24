package kr.co.kfs.asseterp.biz.tdm.dto;

import java.time.LocalDate;

/** tdm01_hr 한 행 (AS-IS tdm01_hr.selectByPersonId) */
public record HrRowRes(
        Long personId,
        String personName,
        String posCode,
        String posName,
        String titleCode,
        String titleName,
        LocalDate hireDate,
        LocalDate retireDate,
        LocalDate endDate,
        Long orgId,
        String orgName
) {
}
