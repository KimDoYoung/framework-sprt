package kr.co.kfs.asseterp.oms.biz.emp.dto;

import java.time.LocalDate;

/** 사원 기본정보 수정 (AS-IS Emp01_TabPage_Person → Emp01_Person.update). 사번은 바꾸지 않는다 */
public record PersonSaveReq(String korNm, LocalDate hireDate, String orderSeq, String emailAddr,
                            String officeTelno, String officeDetail, String mobileTelno, String note) {
}
