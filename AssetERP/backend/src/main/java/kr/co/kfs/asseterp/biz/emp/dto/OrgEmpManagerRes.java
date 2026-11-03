package kr.co.kfs.asseterp.biz.emp.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

/** 조직별 사원조회(관리자) 그리드 행 (AS-IS Emp00_TransInfoModel, emp00_trans_info.selectByAllOrgCodeId) */
public record OrgEmpManagerRes(
        Long transId,
        Long personId,
        String empKorName,
        String genderName,
        LocalDateTime birthday,
        String posName,
        String orgKorName,
        String titleName2,
        LocalDate hireDate,
        String hireName,
        String emailAddress,
        String mobileTelNo,
        String officeTelNo,
        String homeTelNo,
        String decCtzNo,
        String kindName,
        String empNo
) {
}
