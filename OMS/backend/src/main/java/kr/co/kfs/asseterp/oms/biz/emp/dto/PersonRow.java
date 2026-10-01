package kr.co.kfs.asseterp.oms.biz.emp.dto;

import java.time.LocalDate;

/** emp01_person INSERT/UPDATE 파라미터 (UPDATE는 companyId 조건) */
public record PersonRow(Long personId, Long companyId, String empNo, String korNm, LocalDate hireDate, String orderSeq,
                        String emailAddr, String officeTelno, String officeDetail, String mobileTelno, String note) {
}
