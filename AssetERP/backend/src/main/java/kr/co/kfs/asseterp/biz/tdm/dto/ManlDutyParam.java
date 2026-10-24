package kr.co.kfs.asseterp.biz.tdm.dto;

/** 관리의무 페이징 조회 SQL 파라미터 (AS-IS tdm41_manl_duty.selectByTextPaging·Total, N16). searchText는 LIKE 패턴 */
public record ManlDutyParam(Long manlJobId, Long roleId, Long taskId, boolean unRegYn, String searchText, long limit, long offset) {
}
