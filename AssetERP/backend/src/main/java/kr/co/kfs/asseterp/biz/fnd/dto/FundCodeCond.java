package kr.co.kfs.asseterp.biz.fnd.dto;

public record FundCodeCond(Long companyId, Long orgId, Long empId, String admin, String closeYn, String classFundExceptYn,
                           String fundName, String fundTypeCode, String classTypeCode) {
}
