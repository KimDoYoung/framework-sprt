package kr.co.kfs.asseterp.oms.biz.emp.dto;

import java.time.LocalDate;

/** 신규사원 등록 (AS-IS Emp03_Edit_Person → Emp00_TransInfo.update): 사원 + 채용발령(100) */
public record TransInfoCreateReq(
        String empNo,
        String korNm,
        String kindCd,
        LocalDate hireDate,
        String officeTelno,
        String officeDetail,
        String mobileTelno,
        String emailAddr,
        String titleCd,
        String posCd,
        Long orgCodeId,
        String note
) {
}
