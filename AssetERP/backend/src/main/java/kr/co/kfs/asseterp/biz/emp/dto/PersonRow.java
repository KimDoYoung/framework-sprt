package kr.co.kfs.asseterp.biz.emp.dto;

import java.time.LocalDate;

/** emp01_person INSERT/UPDATE 파라미터 (회사는 로그인 회사) */
public record PersonRow(
        Long personId,
        Long companyId,
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
