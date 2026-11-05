package kr.co.kfs.asseterp.biz.emp.dto;

import java.time.LocalDate;

/** 기타 입사일 정보 저장 (AS-IS Emp02_Lookup_HireDate.update → emp.Emp02_Others.updateHireDate) */
public record HireDateSaveReq(
        Long othersId,
        LocalDate hireDateGroup,
        LocalDate hireDateLeaveCalc
) {
}
