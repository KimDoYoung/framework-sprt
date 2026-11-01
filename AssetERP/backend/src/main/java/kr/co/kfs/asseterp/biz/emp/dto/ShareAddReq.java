package kr.co.kfs.asseterp.biz.emp.dto;

/** 공유지정 추가 행 (Emp56_Lookup_Share.openLookupEmpInfo 구분 1 직원 / openLookupOrgInfo 구분 2 부서) */
public record ShareAddReq(String shareCode, Long personId, Long orgId) {
}
