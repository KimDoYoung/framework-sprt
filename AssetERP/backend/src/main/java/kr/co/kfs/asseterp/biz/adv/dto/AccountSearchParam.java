package kr.co.kfs.asseterp.biz.adv.dto;

/** 일임계좌 목록 조회 조건 (Q01) — searchText는 서버가 만든 %…% */
public record AccountSearchParam(Long companyId, String searchText, int offset, int limit) {
}
