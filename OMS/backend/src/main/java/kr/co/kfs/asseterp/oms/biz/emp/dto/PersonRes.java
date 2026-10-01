package kr.co.kfs.asseterp.oms.biz.emp.dto;

import java.time.LocalDate;

/** 사원 기본정보 (AS-IS Emp01_PersonModel, emp01_person — 비밀번호 제외) */
public record PersonRes(
        Long personId,
        Long companyId,
        String empNo,
        String korNm,
        LocalDate hireDate,
        String orderSeq,
        String emailAddr,
        String officeTelno,
        String officeDetail,
        String mobileTelno,
        String note
) {
}
