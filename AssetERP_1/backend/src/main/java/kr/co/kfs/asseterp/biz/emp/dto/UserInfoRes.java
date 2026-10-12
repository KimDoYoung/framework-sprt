package kr.co.kfs.asseterp.biz.emp.dto;

import java.time.LocalDate;

/** 사용자정보 조회 행 (AS-IS Emp01_PersonModel 중 그리드 컬럼 + keyId) */
public record UserInfoRes(
        Long personId,
        Long companyId,
        String companyName,
        String korName,
        String empNo,
        String posName,
        String orgName,
        String officeTelNo,
        String mobileTelNo,
        String emailAddress,
        LocalDate hireDate,
        String retireDate,
        String noteAdmin
) {
}
