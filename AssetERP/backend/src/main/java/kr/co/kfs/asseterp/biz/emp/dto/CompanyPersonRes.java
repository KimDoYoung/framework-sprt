package kr.co.kfs.asseterp.biz.emp.dto;

/** AS-IS Emp01_PersonModel — selectByCompanyIdPaging (C06 문자발송 대상 고르기: 고객사 사원) */
public record CompanyPersonRes(Long personId, Long companyId, String companyName, String orgName, String posName, String korName, String mobileTelNo) {
}
