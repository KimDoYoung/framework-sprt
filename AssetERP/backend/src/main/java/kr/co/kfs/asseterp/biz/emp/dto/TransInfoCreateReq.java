package kr.co.kfs.asseterp.biz.emp.dto;

import java.time.LocalDate;

/** 신규사원 등록 팝업 (AS-IS Emp03_Edit_Person → Emp00_TransInfo.update) */
public record TransInfoCreateReq(
        String empNo,
        String korNm,
        String kindCd,
        LocalDate hireDate,
        LocalDate expiryDate,
        String officeTelNo,
        String officeDetail,
        String mobileTelNo,
        String hireCd,
        String emailAddr,
        String titleCd,
        String posCd,
        Long orgCodeId,
        String note
) {
}
