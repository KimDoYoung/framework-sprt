package kr.co.kfs.asseterp.biz.mkt.dto;

/** AS-IS Mkt02_ManagerModel — 조회 응답이자 저장 요청(managerId가 0 이하면 새 담당자, targetCompanyId는 경로가 아니라 본문) */
public record MktManagerRes(
        Long managerId,
        Long targetCompanyId,
        String managerName,
        String orgName,
        String posName,
        String tel,
        String emailAddr,
        String note,
        String retireInfo) {
}
