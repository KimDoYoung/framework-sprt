package kr.co.kfs.asseterp.biz.emp.dto;

import java.time.LocalDate;

/** 조직별 사원조회 그리드 행 (AS-IS Emp00_TransInfoModel, emp00_trans_info.selectByAllOrgCodeId) */
public record OrgPersonRes(
        Long transId,
        Long personId,
        String empKorName,
        String posName,
        String orgKorName,
        String titleName2,
        LocalDate hireDate,
        String emailAddress,
        String mobileTelNo,
        String officeTelNo,
        String empNo
) {
}
