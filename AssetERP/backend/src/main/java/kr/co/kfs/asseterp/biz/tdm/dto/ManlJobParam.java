package kr.co.kfs.asseterp.biz.tdm.dto;

/** 매뉴얼 작업대상 조회 SQL 파라미터 (AS-IS tdm40_manl_job.selectByText, N15). searchText는 LIKE 패턴, checkYn·createDutyYn은 이 화면에서 항상 false */
public record ManlJobParam(Long companyId, Long orgId, String searchText, boolean writingYn, boolean checkYn, boolean createDutyYn) {
}
