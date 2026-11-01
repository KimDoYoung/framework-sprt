package kr.co.kfs.asseterp.biz.mkt.dto;

/** 업무활동처 및 이익제공처 조회창(Mkt01_Lookup_Select) 한 행 — AS-IS Mkt01_TargetCompanyModel 중 조회창·부르는 화면이 쓰는 열 */
public record MktSelectRes(Long targetCompanyId, Long managerId, String targetCompanyName, String managerName,
                           String managerPosName, String managerOrgName, String managerTel) {
}
