package kr.co.kfs.asseterp.biz.emp.dto;

import java.time.LocalDate;

/** 기본정보 탭 저장 (AS-IS Emp01_TabPage_Person.update → Emp01_Person.update) */
public record PersonSaveReq(
        String empNo,
        String korNm,
        LocalDate hireDate,
        String hireCd,
        String applyCd,
        String orderSeq,
        String emailAddr,
        String officeTelNo,
        String officeDetail,
        String mobileTelNo,
        String note
) {
}
