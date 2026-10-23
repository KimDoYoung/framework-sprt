package kr.co.kfs.asseterp.biz.biz.dto;

/** 이익제공(수령) 인원 한 행 (AS-IS Biz02_PersonModel). 직원은 empName·orgName, 거래상대방은 target* */
public record BizPersonRes(
        Long personId,
        Long promoId,
        Boolean empYn,
        Long empId,
        String empName,
        String orgName,
        String targetCompanyName,
        String targetEmpName,
        String targetOrgName
) {
}
