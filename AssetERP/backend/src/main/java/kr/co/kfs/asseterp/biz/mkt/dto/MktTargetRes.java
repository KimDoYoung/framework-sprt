package kr.co.kfs.asseterp.biz.mkt.dto;

/** 업무활동처(거래상대방) 조회창 한 행 — 회사별(cmp)은 담당자 열이 없다(null) */
public record MktTargetRes(Long targetCompanyId, Long managerId, String targetCompanyName, String managerName, String managerOrgName) {
}
