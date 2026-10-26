package kr.co.kfs.asseterp.biz.adv.dto;

/** 일임계좌 조회창(권한 있는 계좌) 조회 조건 (Q02) — searchText는 서버가 만든 %…% */
public record AccountOrgAuthSearchParam(Long companyId, Long orgId, String searchText, int offset, int limit) {
}
